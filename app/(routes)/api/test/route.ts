import { auth } from "@/app/modules/auth/services/auth";

import { getToken } from "next-auth/jwt"

import { headers } from 'next/headers'

//const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

import { verifyToken } from "@/app/modules/auth/services/jwt";



export async function GET(req: Request) {
  const session = await auth();
  if (!session) {

    //const token = 

    return new Response('unauthorized', {status: 401});
  }

  //if (session) console.log(session)

    //return new Response('ok', {status: 201});
    return Response.json({success: true, accessToken: session.accessToken, session}, {status: 200});
}

export async function POST(req: Request) {
  const session = await auth();

  //const token = await getToken({ req, JWT_SECRET })
  //console.log("JSON Web Token", token)

  

  if (!session) {

    //check for JWT as Bearer
    const headersList = await headers()
    const authHeader = headersList.get('authorization')

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return Response.json({success: false, message: "Authorization token is required"}, {status: 401});
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        return Response.json({success: false, message: "Invalid or expired token"}, {status: 403})
    }

    return Response.json({success: true, message: "Granted", decoded: decoded}, {status: 201})

  }

  if (session) console.log(session)

  try {
    //const { name, description, price } = await req.json();
    
    return new Response('ok', {status: 201});
  } catch (error) {
    return new Response('server error', {status: 500});

  }
}
