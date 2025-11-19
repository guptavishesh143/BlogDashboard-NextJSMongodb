import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const { entityId, entityType, userId, action } = await request.json();

    if (!entityId || !entityType || !userId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!['like', 'unlike'].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const db = await connectDB();
    const collection = entityType === 'post' ? 'posts' : 'comments'; // assuming only posts and comments for now

    const update = action === 'like'
      ? { $addToSet: { likes: userId } }
      : { $pull: { likes: userId } };

    const result = await db.collection(collection).updateOne(
      { _id: new ObjectId(entityId) },
      update
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Entity not found" }, { status: 404 });
    }

    // Get updated likes count
    const updatedEntity = await db.collection(collection).findOne(
      { _id: new ObjectId(entityId) },
      { projection: { likes: 1 } }
    );

    return NextResponse.json({
      success: true,
      likesCount: updatedEntity?.likes?.length || 0,
      isLiked: action === 'like'
    });
  } catch (error) {
    console.error("Error in like API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}