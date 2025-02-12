
import NextAuth,  { type DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"
import { generateAccessToken } from "./lib/generate-access-token";

import type { JWT } from "next-auth/jwt";

const appApiServerUrl = process.env.APP_API_SERVER_URL || "http://172.104.117.139:3000"

declare module "next-auth" {
    /**
     * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
      user: {
        /** The user's postal address. */
        provider?: string,
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
// Extend JWT type to include `provider`
declare module "next-auth/jwt" {
  interface JWT {
    provider: string; // ✅ Fix: Allow TypeScript to recognize this property
  }
}

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
          token.provider = account.provider;
        }
      
        return token
    },
    async session({ session, token }) {

      try {
        const accessToken = await generateAccessToken(session.user.email, session.user.email, token.provider )   
        //console.log(accessToken)
  
        const response = await fetch(`${appApiServerUrl}/auth/login/jwt`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Example header
          },
        });
        if (!response.ok) {
          //console.log(response)
          throw new Error("Failed to get server data");
        }
        const data = await response.json();
       
        return {
            ...session,
            user: {
                ...session.user,
                accessToken: accessToken,
                apiKey: data.apiKey,
                primaryRole: data.primaryRole,
                provider: token.provider,
            }
        }

      } catch (error) {

        console.error('error session jwt ', error)
        /*
        return  {
          ...session,
        }
          */
         throw new Error

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