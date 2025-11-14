import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  params: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params.params;
    const db = await connectDB();

    const result = await db.collection("posts").updateOne(
      {
        _id: new ObjectId(id),
      },
      { $set: { deleted: true, updatedAt: new Date() } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({
        message: "No matching document found",
        status: 400,
      });
    }

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
