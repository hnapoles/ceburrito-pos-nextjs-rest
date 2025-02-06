export { auth as middleware } from "@/auth"

// Don't invoke Middleware on some paths
export const config = {
    //matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public/).*)']
    //matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
    matcher: ['/((?!api|public|_next/static|_next/image|manifest.*|favicon.ico|.*\\.png$).*)'],
};