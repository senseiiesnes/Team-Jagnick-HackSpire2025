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
      // For existing chats, add the new message
      await db.collection('chats').updateOne(
        { _id: new ObjectId(chatId), user_id: userId },
        { 
          $push: { messages: { role: 'user', content: message, timestamp: now } },
          $set: { updatedAt: now }
        }
      );
    }
    
    // Call the FastAPI backend
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    let aiResponse;

    try {
      const backendResponse = await fetch(`${BACKEND_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          text: message,
          user_name: session.user.name || 'User'
        })
      });
      
      if (!backendResponse.ok) {
        console.error(`Backend error: ${backendResponse.statusText}`);
        // Fall back to a simple echo response if backend is unavailable
        aiResponse = {
          user_id: userId,
          assistant_message: "I'm sorry, I couldn't process your message right now. The AI service is temporarily unavailable. Your message has been saved and will be processed when the service is back online.",
          conversation_ended: false,
          feeling_better_acknowledged: false,
          current_significant_emotions: ["neutral"]
        };
      } else {
        aiResponse = await backendResponse.json();
      }
    } catch (error) {
      console.error('Error connecting to backend:', error);
      // Fall back to a simple response if backend connection fails
      aiResponse = {
        user_id: userId,
        assistant_message: "I'm sorry, I couldn't connect to the AI service. Your message has been saved and will be processed when the connection is restored.",
        conversation_ended: false,
        feeling_better_acknowledged: false,
        current_significant_emotions: ["neutral"]
      };
    }
    
    // Add the AI response to the chat in MongoDB
    await db.collection('chats').updateOne(
      { _id: new ObjectId(chat_id) },
      { 
        $push: { 
          messages: { 
            role: 'assistant', 
            content: aiResponse.assistant_message, 
            timestamp: now,
            significant_emotions: aiResponse.current_significant_emotions || []
          }
        },
        $set: { 
          updatedAt: now,
          ended: aiResponse.conversation_ended || false,
          feeling_better: aiResponse.feeling_better_acknowledged || false
        }
      }
    );
    
    // Prepare recommendations if any
    let recommendations = null;
    if (aiResponse.recommendations) {
      recommendations = aiResponse.recommendations;
    }
    
    return NextResponse.json({
      chat_id,
      assistant_message: aiResponse.assistant_message,
      conversation_ended: aiResponse.conversation_ended || false,
      feeling_better_acknowledged: aiResponse.feeling_better_acknowledged || false,
      recommendations,
      current_significant_emotions: aiResponse.current_significant_emotions || []
    });
    
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
