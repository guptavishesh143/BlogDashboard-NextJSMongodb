import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    const userId = (session?.user as any)?.id || (session?.user as any)?.sub;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectDB();
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession();
    const userId = (session?.user as any)?.id || (session?.user as any)?.sub;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await request.json();
    const db = await connectDB();

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { ...updates, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}