import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    const db = await connectDB();
    const now = new Date().toISOString();

    // check user exists
    const user = await db.collection("user").findOne({ email });
    if (user) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);
    const newUser = {
      createdAt: now,
      updatedAt: now,
      active: true,
      password: hashed,
      email,
      name,
    };
    const result = await db.collection("user").insertOne(newUser);

    // create JWT token
    const token = jwt.sign(
      { id: result.insertedId, email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Return user data (without password) + token
    return NextResponse.json({
      message: "User registered successfully",
      data: {
        email,
        name,
        token,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Registration failed", error }, { status: 500 });
  }
}
