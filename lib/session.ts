import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function getCurrentSession() {
  // 1️⃣ Try NextAuth first
  const nextAuthSession = await getServerSession(authOptions);
  if (nextAuthSession) {
    return { type: "nextauth", user: nextAuthSession.user };
  }

  // 2️⃣ Try JWT stored in cookies
  const cookieStore = await cookies(); //  required now
  console.log('cookieStore',cookieStore)
  const token = cookieStore.get("token")?.value;
  console.log("token", token);

  if (token) {
    try {
      const decoded = verifyToken(token);
      return { type: "jwt", user: decoded };
    } catch (err) {
      console.log("Invalid token:", err);
      return null;
    }
  }

  return null;
}
