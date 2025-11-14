import { signToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const db = await connectDB();
    const user = await db.collection("user").findOne({ email });
console.log('user',user)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 401 }
      );
    }

    const token = signToken({ id: user._id, email: user.email });
    return NextResponse.json({ token, user });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      // { error: error },
      { status: 500 }
    );
  }
}
