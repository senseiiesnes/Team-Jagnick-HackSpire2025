import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// PUT update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, username, email, age, bio } = await request.json();

    // Basic validation
    if (!name || !username || !email) {
      return NextResponse.json(
        { message: "Name, username, and email are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("mindmosaic");
    
    // Check if email is already taken by another user
    if (email !== session.user.email) {
      const existingUserByEmail = await db.collection("users").findOne({ 
        email,
        _id: { $ne: new ObjectId(session.user.id) }
      });
      
      if (existingUserByEmail) {
        return NextResponse.json(
          { message: "Email is already in use" },
          { status: 409 }
        );
      }
    }
    
    // Check if username is already taken by another user
    const existingUserByUsername = await db.collection("users").findOne({ 
      username,
      _id: { $ne: new ObjectId(session.user.id) }
    });
    
    if (existingUserByUsername) {
      return NextResponse.json(
        { message: "Username is already taken" },
        { status: 409 }
      );
    }
    
    // Update user profile
    const updateData: Record<string, any> = {
      name,
      username,
      email,
      updatedAt: new Date()
    };
    
    if (age) updateData.age = age;
    if (bio !== undefined) updateData.bio = bio;
    
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    );
  }
} 