// acts like express route : GET/POST like we need to fetch "GET Req" all posts and "POST Req" for all the collection

// app/api/posts/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  const db = await connectDB();
  const posts = await db
    .collection("posts")
    .find({ deleted: { $ne: true } })
    .sort({ createdAt: -1 })
    .toArray();
  return NextResponse.json(posts);
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
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection("posts").insertOne(newPost);
  return NextResponse.json({ ...newPost, _id: result.insertedId });
}
