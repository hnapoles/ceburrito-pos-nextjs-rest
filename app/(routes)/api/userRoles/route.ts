// pages/api/userRoles.ts
/*
import { UserPrimaryRole } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const roles = Object.values(UserPrimaryRole); // Get enum values
  return Response.json(roles, {status: 200});
}
*/
//import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const roles = ["admin", "manager", "user"]
  return Response.json(roles);
}