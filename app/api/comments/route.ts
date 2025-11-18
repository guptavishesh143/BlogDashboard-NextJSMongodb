import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get("entityId");
    const entityType = searchParams.get("entityType");

    if (!entityId || !entityType) {
      return NextResponse.json(
        { error: "entityId and entityType are required" },
        { status: 400 }
      );
    }

    const db = await connectDB();

    const comments = await db
      .collection("comments")
      .find({
        entityId: new ObjectId(entityId),
        entityType: entityType.toLowerCase(),
      })
      .sort({ createdAt: 1 })
      .toArray();

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { entityId, entityType, userId, text, parentId } =
      await request.json();

    if (!entityId || !entityType || !text) {
      return NextResponse.json(
        { error: "entityId, entityType, and text are required" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const now = new Date().toISOString();

    const newComment = {
      entityId: new ObjectId(entityId),
      entityType: entityType.toLoweCase(),
      userId: new ObjectId(userId),
      text,
      createdAt: now,
      updatedAt: now,
      likes: [],
      parentId: parentId ? new ObjectId(parentId) : null, // parent comment
    };

    const result = await db.collection("comments").insertOne(newComment);

    return NextResponse.json({
      _id: result.insertedId,
      ...newComment,
    });
  } catch (error) {
    return NextResponse.json({
      error,
    });
  }
}
