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

    const like = await db.collection("likes").findOne({ _id: new ObjectId(id) });

    if (!like) {
      return NextResponse.json({ error: "Like not found" }, { status: 404 });
    }

    return NextResponse.json(like);
  } catch (error) {
    console.error("Error fetching like:", error);
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

    const result = await db.collection("likes").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date().toISOString() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Like not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Like updated successfully" });
  } catch (error) {
    console.error("Error updating like:", error);
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

    const result = await db.collection("likes").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Like not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Like deleted successfully" });
  } catch (error) {
    console.error("Error deleting like:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}