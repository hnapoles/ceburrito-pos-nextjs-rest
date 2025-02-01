export {auth as middleware} from "@/app/modules/auth/services/auth";

// Don't invoke Middleware on some paths
export const config = {
  //matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public/).*)']
  //matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
  matcher: ['/((?!api|public|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};


/*
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from "@/lib/auth"
import { headers } from 'next/headers'
import { verifyToken } from "@/lib/jwt";

export async function middleware(request: NextRequest) {

  const { pathname } = request.nextUrl;

  // Allow requests to public routes
  const publicRoutes = ['/api/auth', '/login', '/register', '/public'];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const session = await auth()

  if (!session) {

    const headersList = await headers()
    const authHeader = headersList.get('authorization')

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return Response.json({success: false, message: "Auth session or access token is required [from: MW]"}, {status: 401});
    }
    const token = authHeader.split(" ")[1];
    console.log("split_token ", token)
    const decoded = verifyToken(token);

    if (!decoded) {
        return Response.json({success: false, message: "Invalid or expired token [from: MW]"}, {status: 403})
    } else {
      return NextResponse.next()
    }

    //return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.next()
}
*/

