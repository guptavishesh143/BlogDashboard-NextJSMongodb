import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyToken } from "@/lib/jwt";

export async function getCurrentSession(req?: Request) {
  const nextAuthSession = await getServerSession(authOptions);
  if (nextAuthSession) {
    return { type: "nextauth", user: nextAuthSession.user };
  }

  if (req) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (token) {
      try {
        const decoded = verifyToken(token);
        return { type: "jwt", user: decoded };
      } catch {
        return null;
      }
    }
  }

  return null;
}
