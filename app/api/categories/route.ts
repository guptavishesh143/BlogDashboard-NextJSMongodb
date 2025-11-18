import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await connectDB();
    const result = await db.collection("categories").find().toArray()
    console.log('result',result);

    return NextResponse.json({
      data: result,
    });
  } catch (error) {
    console.log('error',error)
    return NextResponse.json({
      error,
    });
  }
}

export async function POST(request:Request) {

    

}
