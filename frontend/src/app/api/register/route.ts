import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { name, username, email, password, age, bio } = await request.json();
    
    // Validate the data
    if (!name || !username || !email || !password || !age) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Connect to DB
    const client = await clientPromise;
    const db = client.db("mindmosaic");
    
    // Check if user already exists with the email
    const existingUserByEmail = await db.collection("users").findOne({ email });
    if (existingUserByEmail) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 409 }
      );
    }
    
    // Check if username is taken
    const existingUserByUsername = await db.collection("users").findOne({ username });
    if (existingUserByUsername) {
      return NextResponse.json(
        { message: "Username is already taken" },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await hash(password, 10);
    
    // Insert user
    const result = await db.collection("users").insertOne({
      name,
      username,
      email,
      age,
      bio: bio || "",
      password: hashedPassword,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json(
      { message: "User created successfully", userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    );
  }
} 