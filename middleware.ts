/* v1 ---
export { auth as middleware } from '@/auth';

// Don't invoke Middleware on some paths
export const config = {
  //matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public/).*)']
  //matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
  matcher: [
    '/((?!api|public|_next/static|_next/image|manifest.*|favicon.ico|.*\\.png$).*)',
  ],
};
*/

// v3
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { match } from 'path-to-regexp';

export async function middleware(req: NextRequest) {
  const session = await auth(); // ✅ Get session
  const { pathname } = req.nextUrl;

  // ✅ Allow access to login & unauthorized pages to prevent infinite redirects
  if (
    pathname === '/login' ||
    pathname === '/unauthorized' ||
    pathname.startsWith('/pub/')
  ) {
    return NextResponse.next();
  }

  // ✅ Redirect unauthenticated users to login page
  if (!session?.user) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.url); // Store intended URL to redirect after login
    return NextResponse.redirect(loginUrl);
  }

  const userRole = session.user.primaryRole;
  const isAdmin =
    userRole === 'admin' ||
    userRole === 'superadmin' ||
    userRole === 'superuser';
  const isManager = userRole === 'manager';

  console.log(`🔍 Checking permissions for ${userRole} on ${pathname}`);

  if (isAdmin) return NextResponse.next();

  const uiRouteAccess = session.user.uiRoutesAccess;
  const hasAccess = uiRouteAccess?.some((routePattern) => {
    const matcher = match(routePattern, { decode: decodeURIComponent });
    return !!matcher(pathname); // Returns true if the route matches
  });

  if (hasAccess) return NextResponse.next();

  console.warn(`🚫 Access denied to ${userRole} on ${pathname}`);
  return NextResponse.redirect(new URL('/unauthorized', req.url));
}

// ✅ Exclude static assets, API routes, and prevent infinite loops
export const config = {
  matcher: [
    '/((?!api|public|_next/static|_next/image|manifest.*|favicon.ico|.*\\.png$|login|unauthorized).*)',
  ],
};

/*
import { match } from "path-to-regexp";
import { usePathname } from "next/navigation";

const userRouteAccess = ["/products/:id/edit", "/products/create"];

export function useIsRouteAccessible(): boolean {
  const pathname = usePathname(); // Get current path

  return userRouteAccess.some((routePattern) => {
    const matcher = match(routePattern, { decode: decodeURIComponent });
    return !!matcher(pathname); // Returns true if the route matches
  });
}

*/
