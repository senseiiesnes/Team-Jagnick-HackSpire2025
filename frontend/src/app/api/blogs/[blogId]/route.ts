import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET function to retrieve a specific blog by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { blogId: string } }
) {
  try {
    const blogId = params.blogId;
    
    if (!blogId || !ObjectId.isValid(blogId)) {
      return NextResponse.json(
        { error: 'Invalid blog ID' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Find the blog by ID
    const blog = await db.collection('blogs').findOne({
      _id: new ObjectId(blogId)
    });
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Format for client use
    const formattedBlog = {
      id: blog._id.toString(),
      title: blog.title,
      content: blog.content,
      imageUrl: blog.imageUrl,
      author: blog.author,
      authorId: blog.user_id,
      date: blog.createdAt ? new Date(blog.createdAt).toISOString() : new Date().toISOString(),
      tags: blog.tags || []
    };
    
    return NextResponse.json(formattedBlog);
    
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve blog' },
      { status: 500 }
    );
  }
}

// PUT function to update a blog
export async function PUT(
  request: NextRequest,
  { params }: { params: { blogId: string } }
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
    const blogId = params.blogId;
    
    if (!blogId || !ObjectId.isValid(blogId)) {
      return NextResponse.json(
        { error: 'Invalid blog ID' },
        { status: 400 }
      );
    }
    
    const { title, content, imageUrl, tags } = await request.json();
    
    // Validate required fields
    if (!title || !content || !imageUrl) {
      return NextResponse.json(
        { error: 'Title, content, and image are required' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Ensure the user is the owner of the blog
    const existingBlog = await db.collection('blogs').findOne({ 
      _id: new ObjectId(blogId)
    });
    
    if (!existingBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    if (existingBlog.user_id !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to update this blog' },
        { status: 403 }
      );
    }
    
    // Update the blog
    const result = await db.collection('blogs').updateOne(
      { _id: new ObjectId(blogId) },
      { 
        $set: { 
          title,
          content,
          imageUrl,
          tags: tags || [],
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Blog updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE function to delete a blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: { blogId: string } }
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
    const blogId = params.blogId;
    
    if (!blogId || !ObjectId.isValid(blogId)) {
      return NextResponse.json(
        { error: 'Invalid blog ID' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Ensure the user is the owner of the blog
    const existingBlog = await db.collection('blogs').findOne({ 
      _id: new ObjectId(blogId)
    });
    
    if (!existingBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    if (existingBlog.user_id !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to delete this blog' },
        { status: 403 }
      );
    }
    
    // Delete the blog
    const result = await db.collection('blogs').deleteOne({
      _id: new ObjectId(blogId)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Blog not found or not authorized to delete' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Blog deleted successfully' 
    });
    
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
} 