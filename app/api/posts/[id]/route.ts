// all the get/put/delete based on id  request will done here

import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { error } from "console";

export async function GET(
  request: Request,
  params: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ unwrap params (since it's a Promise in Next.js 15+)
    const { id } = await params.params;
    const db = await connectDB();

    const postDetails = await db
      .collection("posts") // .findOne({ _id: new ObjectId(params.id) })
      .findOne({ _id: new ObjectId(id) });

    if (!postDetails) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get likes count for this post
    const likesCount = await db.collection("likes").countDocuments({
      entityId: new ObjectId(id),
      entityType: "post",
    });

    return NextResponse.json({
      ...postDetails,
      likesCount,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  params: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params.params;
    const updates = await request.json();
    console.log("updates data", updates);
    const db = await connectDB();

    const result = await db
      .collection("posts")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updates, updatedAt: new Date() } }
      );

    console.log(result);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Post not found" },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({ message: "Post updated Successfully" });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  params: { params: Promise<{ id: string }> }
) {
  const { id } = await params.params;
  const db = await connectDB();

  const result = db.collection("posts").deleteOne({
    _id: new ObjectId(id),
  });

  // if (result) {

  // }
  console.log("result", result);
  return NextResponse.json({ error: error, result: result });
}
