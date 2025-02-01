import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables")
}

// Generate a JWT token
export function generateToken(payload: object, options: SignOptions = {} ): string {
  return jwt.sign(payload, JWT_SECRET, { ...options  });
}

// Verify a JWT token
export function verifyToken(token: string) {
  try {
    console.log('jwt secret ', JWT_SECRET)
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("Invalid or expired token");
    return null;
  }
}
