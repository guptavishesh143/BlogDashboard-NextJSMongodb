// acts like express route : GET/POST like we need to fetch "GET Req" all posts and "POST Req" for all the collection

// app/api/posts/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const db = await connectDB();

    // total document
    const total = await db.collection("posts").countDocuments();

    const posts = await db
      .collection("posts")
      .find({ deleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Add likes count and comments count to each post
    const postsWithLikeAndCounts = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await db.collection("likes").countDocuments({
          entityId: post._id,
          entityType: "post",
        });
        const commentsCount = await db.collection("comments").countDocuments({
          entityId: post._id,
          entityType: "post",
        });
        return {
          ...post,
          likesCount,
          commentsCount,
        };
      })
    );

    return NextResponse.json({
      data: postsWithLikeAndCounts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + limit < total,
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.title || !body?.body) {
    return NextResponse.json(
      { error: "Missing title or body" },
      { status: 400 }
    );
  }
  const db = await connectDB();
  const now = new Date().toISOString();
  const newPost = {
    title: String(body.title),
    body: String(body.body),
    published: Boolean(body.published ?? false),
    category: body.category || null,
    createdAt: now,
    updatedAt: now,
    tags: [],
    likes: [],
    commentsCount: 0,
  };
  const result = await db.collection("posts").insertOne(newPost);
  return NextResponse.json({ ...newPost, _id: result.insertedId });
}
