
import NextAuth,  { type DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"

import { SignJWT, jwtVerify } from "jose";

import { apiRequest } from "./lib/axios-client-v2";
import { IUserResponse } from "./app/model/users-model";

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

declare module "next-auth" {
    /**
     * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
      user: {
        /** The user's postal address. */
        accessToken: string,
        apiKey?: string,
        primaryRole?: string,
        /**
         * By default, TypeScript merges new interface properties and overwrites existing ones.
         * In this case, the default session user properties will be overwritten,
         * with the new ones defined above. To keep the default session user properties,
         * you need to add them back into the newly declared interface.
         */
      } & DefaultSession["user"]
    }
}

export const runtime = "nodejs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: false,
  pages: {
        error: "/error",
        signIn: "/login"
  },
  providers: [Google],
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      return isLoggedIn;

    },
    async jwt({token, account}) {

        if (account) {
            token.provider = account.provider; // Store provider in token
        }
    
        return token
    },
    async session({ session, token }) {

        // Generate a JWT token
        const accessToken = await new SignJWT({username: session.user.email, email: session.user.email, provider: token.provider})
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(JWT_TOKEN_EXPIRES_IN) // Token expires in 2 hours
        .sign(secret);

        //get more user data from the server
        let apiKey = ""
        let primaryRole = ""
        if (accessToken) {
          const { data, error } = await apiRequest<IUserResponse>({ url: `${appApiServerUrl}/auth/login/jwt`, 
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+accessToken,
            },
          });

          if (error) {
            console.log('error from api serer => ', error)
            apiKey = 'error-from-api-server'
            primaryRole = 'error-from-api-server'
          } else {
            if (data && data.apiKey) {
              apiKey = data.apiKey
            }
            if (data && data.primaryRole) {
              primaryRole = data.primaryRole
            }
          }


        }

        return {
            ...session,
            user: {
                ...session.user,
                accessToken: accessToken,
                apiKey: apiKey,
                primaryRole: primaryRole
            }
        }
    }, 
    async redirect({ url, baseUrl }) {
        // Allows relative callback URLs
        /*
        const queryString = url.split('?')[1]
        const callbackUrl = new URLSearchParams(queryString).get('callbackUrl')
        if (callbackUrl) return `${callbackUrl}`
        return '/dashboard'
        */
        return url.startsWith(baseUrl) ? url : baseUrl;
    },
  } //end of callbacks
    
})