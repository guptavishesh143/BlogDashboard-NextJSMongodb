// jwt helper functions

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function signToken(payload: { email: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
