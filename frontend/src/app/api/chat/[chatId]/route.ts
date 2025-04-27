import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET function to retrieve a specific chat by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const chatId = params.chatId;
    
    if (!chatId || !ObjectId.isValid(chatId)) {
      return NextResponse.json(
        { error: 'Invalid chat ID' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Find the chat by ID and ensure it belongs to the current user
    const chat = await db.collection('chats').findOne({
      _id: new ObjectId(chatId),
      user_id: userId
    });
    
    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }
    
    // Transform messages for client use
    const messages = chat.messages.map((msg: any) => ({
      id: msg._id ? msg._id.toString() : Math.random().toString(36).substring(2, 15),
      text: msg.content,
      sender: msg.role === 'user' ? 'user' : 'ai',
      timestamp: msg.timestamp ? new Date(msg.timestamp).toISOString() : new Date().toISOString(),
      recommendations: msg.recommendations || null,
      significant_emotions: msg.significant_emotions || []
    }));
    
    return NextResponse.json({
      id: chat._id.toString(),
      messages,
      createdAt: chat.createdAt ? new Date(chat.createdAt).toISOString() : null,
      updatedAt: chat.updatedAt ? new Date(chat.updatedAt).toISOString() : null,
      ended: chat.ended || false
    });
    
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve chat' },
      { status: 500 }
    );
  }
}

// DELETE function to delete a chat
export async function DELETE(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const chatId = params.chatId;
    
    if (!chatId || !ObjectId.isValid(chatId)) {
      return NextResponse.json(
        { error: 'Invalid chat ID' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Delete the chat and ensure it belongs to the current user
    const result = await db.collection('chats').deleteOne({
      _id: new ObjectId(chatId),
      user_id: userId
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Chat not found or not authorized to delete' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting chat:', error);
    return NextResponse.json(
      { error: 'Failed to delete chat' },
      { status: 500 }
    );
  }
}
