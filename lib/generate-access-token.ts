import { SignJWT } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_TOKEN_EXPIRES_IN = process.env.JWT_TOKEN_EXPIRES_IN || '1h'
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables")
}
if (!JWT_TOKEN_EXPIRES_IN) {
  throw new Error("JWT_TOKEN_EXPIRES_IN is not defined in the environment variables")
}

const secretKey = process.env.JWT_SECRET!;
const secret = new TextEncoder().encode(secretKey);

export async function generateAccessToken(username: string, email: string, provider: string) {
    const accessToken = await new SignJWT({username, email, provider})
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(JWT_TOKEN_EXPIRES_IN) // Token expires in 2 hours
            .sign(secret);

    return accessToken;
}