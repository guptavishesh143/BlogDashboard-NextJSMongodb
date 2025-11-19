import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get("entityId");
    const entityType = searchParams.get("entityType");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!entityId || !entityType) {
      return NextResponse.json(
        { error: "entityId and entityType are required" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const skip = (page - 1) * limit;

    const comments = await db
      .collection("comments")
      .find({
        entityId: new ObjectId(entityId),
        entityType: entityType.toLowerCase(),
      })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalComments = await db.collection("comments").countDocuments({
      entityId: new ObjectId(entityId),
      entityType: entityType.toLowerCase(),
    });

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total: totalComments,
        hasMore: skip + comments.length < totalComments,
      },
    });
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

      console.log('entityType',entityType.toLowerCase())
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
      entityType: entityType?.toLowerCase(),
      userId: userId,
      text,
      createdAt: now,
      updatedAt: now,
      parentId: parentId ? new ObjectId(parentId) : null, // parent comment
    };

    const result = await db.collection("comments").insertOne(newComment);

    // console.log('result',result)
    return NextResponse.json({
      _id: result.insertedId,
      ...newComment,
    });
  } catch (error) {
    console.log('error',error)
    return NextResponse.json({
      error,
    });
  }
}
