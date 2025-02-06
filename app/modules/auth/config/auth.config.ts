import type { NextAuthConfig } from 'next-auth';
import Google from "next-auth/providers/google"


//import jwt from 'jsonwebtoken';

import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_TOKEN_EXPIRES_IN = process.env.JWT_TOKEN_EXPIRES_IN || '1h'

if (!JWT_SECRET || !JWT_TOKEN_EXPIRES_IN) {
  throw new Error("JWT_SECRET is not defined in the environment variables")
}

if (!JWT_TOKEN_EXPIRES_IN) {
  throw new Error("JWT_TOKEN_EXPIRES_IN is not defined in the environment variables")
}

export const authConfig = {
  pages: {
    signIn: '/google',
    error: "/auth/error" // Redirect to custom error page
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const isOnDashboard = nextUrl.pathname.startsWith('/');
      if (isOnDashboard || nextUrl.pathname.startsWith('/logout')) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        //if (callbackUrl)  return Response.redirect(new URL(callbackUrl, nextUrl));
        //return Response.redirect(new URL('/', nextUrl));
        return true
      }


      return true;

    },
    async jwt({ token, user }) {
      if (user) {

        //console.log('user from jwt', user)
        token.primaryRole = user.primaryRole
        token.email = user.email
        token.accessToken = user.accessToken 
        token.apiKey = user.apiKey
          //no need to generate token. The api server generates the accessToken for now
          // Generate a JWT token
          //const JWT_TOKEN_EXPIRES_IN = process.env.JWT_TOKEN_EXPIRES_IN || '1h'
          //const signInOptions = { expiresIn: '1h' }
          //token.accessToken = jwt.sign({ userId: user.id, email: user.email, primaryRole: user.primaryRole }, JWT_SECRET, { expiresIn: '1h' })

          

        }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.primaryRole = token.primaryRole as string
        session.accessToken = token.accessToken as string
        session.apiKey = token.apiKey
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs

      const queryString = url.split('?')[1]
      const callbackUrl = new URLSearchParams(queryString).get('callbackUrl')
      if (callbackUrl) return `${callbackUrl}`
      return '/dashboard'
      //if (url.startsWith("/dashboard")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      //else if (new URL(url).origin === baseUrl) return url
      //return baseUrl
    }
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    maxAge: 60 * 60,
    strategy: "jwt", // Use JWT to store session info

  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 60 * 60 * 24 * 30,
    // You can define your own encode/decode functions for signing and encryption
    //async encode() {},
    //async decode() {},
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" 
        ? "__Secure-next-auth.session-token" 
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only send over HTTPS
        sameSite: "strict", // Prevent CSRF attacks
        path: "/",
      },
    },
  },
} satisfies NextAuthConfig;