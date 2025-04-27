import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET function to retrieve all blogs
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100');
    const userId = searchParams.get('userId');
    
    // Query object - if userId provided, filter by that user
    const query = userId ? { user_id: userId } : {};
    
    // Get blogs from the database
    const blogs = await db
      .collection('blogs')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    
    // Transform to client-friendly format
    const formattedBlogs = blogs.map(blog => ({
      id: blog._id.toString(),
      title: blog.title,
      content: blog.content,
      imageUrl: blog.imageUrl,
      author: blog.author,
      authorId: blog.user_id,
      date: blog.createdAt ? new Date(blog.createdAt).toISOString() : new Date().toISOString(),
      tags: blog.tags || []
    }));
    
    return NextResponse.json({ blogs: formattedBlogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve blogs' },
      { status: 500 }
    );
  }
}

// POST function to create a new blog
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
    const { title, content, imageUrl, tags } = await request.json();
    
    // Validate required fields
    if (!title || !content || !imageUrl) {
      return NextResponse.json(
        { error: 'Title, content, and image are required' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    const now = new Date();
    
    // Create new blog document
    const newBlog = {
      user_id: userId,
      title,
      content,
      imageUrl,
      author: session.user.name || 'Anonymous',
      createdAt: now,
      updatedAt: now,
      tags: tags || []
    };
    
    const result = await db.collection('blogs').insertOne(newBlog);
    
    return NextResponse.json({
      id: result.insertedId.toString(),
      message: 'Blog created successfully'
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
} 