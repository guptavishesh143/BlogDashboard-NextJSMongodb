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

    const likes = await db
      .collection("likes")
      .find({
        entityId: new ObjectId(entityId),
        entityType: entityType.toLowerCase(),
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalLikes = await db.collection("likes").countDocuments({
      entityId: new ObjectId(entityId),
      entityType: entityType.toLowerCase(),
    });

    return NextResponse.json({
      likes,
      pagination: {
        page,
        limit,
        total: totalLikes,
        hasMore: skip + likes.length < totalLikes,
      },
    });
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

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
    const now = new Date().toISOString();

    if (action === 'like') {
      // Check if like already exists
      const existingLike = await db.collection("likes").findOne({
        entityId: new ObjectId(entityId),
        entityType: entityType.toLowerCase(),
        userId: userId,
      });

      if (existingLike) {
        return NextResponse.json({ error: "Already liked" }, { status: 400 });
      }

      // Create new like
      const newLike = {
        entityId: new ObjectId(entityId),
        entityType: entityType.toLowerCase(),
        userId: userId,
        createdAt: now,
        updatedAt: now,
      };

      await db.collection("likes").insertOne(newLike);
    } else {
      // Unlike - remove the like
      const result = await db.collection("likes").deleteOne({
        entityId: new ObjectId(entityId),
        entityType: entityType.toLowerCase(),
        userId: userId,
      });

      if (result.deletedCount === 0) {
        return NextResponse.json({ error: "Like not found" }, { status: 404 });
      }
    }

    // Get updated likes count
    const likesCount = await db.collection("likes").countDocuments({
      entityId: new ObjectId(entityId),
      entityType: entityType.toLowerCase(),
    });

    return NextResponse.json({
      success: true,
      likesCount,
      isLiked: action === 'like'
    });
  } catch (error) {
    console.error("Error in like API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}