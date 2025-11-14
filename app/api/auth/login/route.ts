import { signToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
export async function POST(request: Request) {

  try {
    const { email, password } = await request.json();
    const db = await connectDB();
    const user = await db.collection("user").findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 401 }
      );
    }

    const token = await signToken({ email });
    // Create response
    const response = NextResponse.json({
      message: "Login successful",
      data: {
        user
      },
    });
    // Set cookie **ON RESPONSE**
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { error: error },
      { status: 500 }
    );
  }
}
