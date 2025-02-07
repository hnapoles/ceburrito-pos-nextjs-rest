
import { SignJWT } from "jose";

//import { apiRequest } from "./lib/axios-client-v2";
//import { IUserResponse } from "./app/model/users-model";

import { getServerData } from "@/lib/get-server-data";

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

const appApiServerUrl = process.env.APP_API_SERVER_URL || "http://172.104.117.139:3000/"

export async function generateAccessToken(username: string, email: string, provider: string) {
    const accessToken = await new SignJWT({username, email, provider})
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(JWT_TOKEN_EXPIRES_IN) // Token expires in 2 hours
            .sign(secret);

    return accessToken;
}