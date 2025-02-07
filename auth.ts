
import NextAuth,  { type DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"
import { generateAccessToken } from "./lib/generate-access-token";
//import { getServerData } from "./lib/get-server-data";

const appApiServerUrl = process.env.APP_API_SERVER_URL || "http://172.104.117.139:3000"

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

        /*
        const result = await getServerData(accessToken);
        token.apiKey = result.apiKey
        token.primaryRole = result.primaryRole
        */
    
        return token
    },
    async session({ session, token }) {

        const accessToken = await generateAccessToken(session.user.email, session.user.email, 'google')   
  
        const response = await fetch(`${appApiServerUrl}/auth/login/jwt`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Example header
          },
        });
        if (!response.ok) {
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