import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET function to retrieve chat history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const { db } = await connectToDatabase();
    
    // Get recent chats for sidebar listing
    const chats = await db
      .collection('chats')
      .find({ user_id: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .project({
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        ended: 1,
        feeling_better: 1,
        messages: { $slice: 1 } // Get just the first message for preview
      })
      .toArray();
    
    // Transform to client-friendly format
    const formattedChats = chats.map(chat => ({
      id: chat._id.toString(),
      createdAt: chat.createdAt ? new Date(chat.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: chat.updatedAt ? new Date(chat.updatedAt).toISOString() : new Date().toISOString(),
      ended: chat.ended || false,
      feeling_better: chat.feeling_better || false,
      previewMessage: chat.messages?.[0]?.content || 'New conversation'
    }));
    
    return NextResponse.json({ chats: formattedChats });
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve chats' },
      { status: 500 }
    );
  }
}

// POST function to send a message to the AI and store in database
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const { message, chatId, newChat } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    let chat_id = chatId;
    const now = new Date();
    
    // For new chats, create a document in MongoDB
    if (newChat || !chatId) {
      console.log("Creating new chat document");
      const newChatDoc = {
        user_id: userId,
        messages: [
          { role: 'user', content: message, timestamp: now }
        ],
        createdAt: now,
        updatedAt: now,
        ended: false
      };
      
      const result = await db.collection('chats').insertOne(newChatDoc);
      chat_id = result.insertedId.toString();
    } else {
      // For existing chats, find the chat and add the new message
      console.log(`Updating existing chat: ${chatId}`);
      const existingChat = await db.collection('chats').findOne({ 
        _id: new ObjectId(chatId),
        user_id: userId
      });
      
      if (!existingChat) {
        // If the chat doesn't exist (maybe it was deleted), create a new one
        console.log("Chat not found, creating new document");
        const newChatDoc = {
          user_id: userId,
          messages: [
            { role: 'user', content: message, timestamp: now }
          ],
          createdAt: now,
          updatedAt: now,
          ended: false
        };
        
        const result = await db.collection('chats').insertOne(newChatDoc);
        chat_id = result.insertedId.toString();
      } else {
        // Update the existing chat
        await db.collection('chats').updateOne(
          { _id: new ObjectId(chatId), user_id: userId },
          { 
            $push: { messages: { role: 'user', content: message, timestamp: now } },
            $set: { updatedAt: now }
          }
        );
      }
    }
    
    // Call backend API to get AI response
    try {
      // Use a fallback URL if BACKEND_URL is not defined
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
      console.log(`Connecting to backend at: ${backendUrl}`);
      
      // Call backend with message and user ID
      const response = await fetch(`${backendUrl}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message,
          user_id: userId,
        }),
      });
      
      if (!response.ok) {
        console.error('Backend error:', response.status, response.statusText);
        if (response.status === 503) {
          throw new Error('Backend service unavailable');
        } else if (response.status === 401) {
          throw new Error('Unauthorized');
        } else {
          throw new Error(`Backend error: ${response.status}`);
        }
      }

      const apiResponse = await response.json();
      
      const aiMessage = {
        role: 'assistant',
        content: apiResponse.assistant_message.replace(/^AI: /, ''),
        timestamp: new Date(),
        recommendations: apiResponse.recommendations || null,
        significant_emotions: apiResponse.current_significant_emotions || null,
        feels_better: apiResponse.feeling_better_acknowledged || false,
      };
      
      // Add the AI response to the chat document
      await db.collection('chats').updateOne(
        { _id: new ObjectId(chat_id) },
        { 
          $push: { messages: aiMessage },
          $set: { 
            updatedAt: new Date(),
            ended: apiResponse.conversation_ended || false
          }
        }
      );
      
      return NextResponse.json({
        message: aiMessage,
        chatId: chat_id
      });
      
    } catch (error) {
      console.error('Error calling backend:', error);
      
      // Update the chat document to mark that there was an error
      if (chat_id) {
        const errorMessage = {
          role: 'system',
          content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: new Date(),
        };
        
        await db.collection('chats').updateOne(
          { _id: new ObjectId(chat_id) },
          { 
            $push: { messages: errorMessage },
            $set: { updatedAt: new Date() }
          }
        );
      }
      
      if (error instanceof Error && error.message === 'Backend service unavailable') {
        return NextResponse.json(
          { error: 'AI service is temporarily unavailable. Please try again later.' },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to get response from AI' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
