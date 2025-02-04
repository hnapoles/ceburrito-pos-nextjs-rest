import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Clear accessToken and NextAuth session cookies
  response.cookies.set("accessToken", "", { path: "/", expires: new Date(0) });
  response.cookies.set("refreshToken", "", { path: "/", expires: new Date(0) });
  response.cookies.set("next-auth.session-token", "", { path: "/", expires: new Date(0) });
  response.cookies.set("__Secure-next-auth.session-token", "", { path: "/", expires: new Date(0) });

  return response;
}
