import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await connectDB();

    const comment = await db.collection("comments").findOne({ _id: new ObjectId(id) });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error fetching comment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();
    const db = await connectDB();

    const result = await db.collection("comments").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date().toISOString() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Comment updated successfully" });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await connectDB();

    const result = await db.collection("comments").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}