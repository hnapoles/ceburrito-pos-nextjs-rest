import NextAuth, { type DefaultSession } from 'next-auth';
import Google from 'next-auth/providers/google';
import { generateAccessToken } from './lib/generate-access-token';

import type { JWT } from 'next-auth/jwt';

const appApiServerUrl =
  process.env.NEXT_PUBLIC_APP_API_SERVER_URL || 'http://172.104.117.139:3000';

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      provider?: string;
      accessToken: string;
      apiKey?: string;
      primaryRole?: string;
      uiRoutesAccess?: string[];
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession['user'];
  }
}
// Extend JWT type to include `provider`
declare module 'next-auth/jwt' {
  interface JWT {
    provider: string; // ✅ Fix: Allow TypeScript to recognize this property
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: false,
  pages: {
    error: '/error',
    signIn: '/login',
  },
  providers: [Google],
  session: { strategy: 'jwt' }, // Use JWT sessions
  callbacks: {
    async jwt({ token, account }) {
      // Store provider on first login
      if (account) {
        token.provider = account.provider;
      }

      // If accessToken is already set, return token (prevents unnecessary API calls)
      if (token.accessToken) {
        return token;
      }

      // Generate new access token
      const accessToken = await generateAccessToken(
        token.email || '', // Use token.email instead of session
        token.email || '',
        token.provider,
      );

      // Fetch user permissions only once
      const response = await fetch(`${appApiServerUrl}/auth/login/jwt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      // Store fetched data in the token
      token.accessToken = accessToken;
      token.apiKey = data.apiKey;
      token.primaryRole = data.primaryRole;
      token.uiRoutesAccess = data.permissions;

      return token;
    },

    async session({ session, token }) {
      // Use cached data from the token to prevent unnecessary API calls
      return {
        ...session,
        user: {
          ...session.user,
          accessToken: token.accessToken,
          apiKey: token.apiKey,
          primaryRole: token.primaryRole,
          provider: token.provider,
          uiRoutesAccess: token.uiRoutesAccess,
        },
      };
    },
  },
});

/*
callbacks: {
  async session({ session, token }) {
    try {
      // If accessToken already exists, prevent unnecessary API calls
      if (session.user.accessToken) {
        return {
          ...session,
          user: {
            ...session.user,
            accessToken: token.accessToken, // Use stored accessToken
            apiKey: token.apiKey,
            primaryRole: token.primaryRole,
            provider: token.provider,
            uiRoutesAccess: token.uiRoutesAccess,
          },
        };
      }

      // Generate access token only when required
      const accessToken = await generateAccessToken(
        session.user.email,
        session.user.email,
        token.provider
      );

      const response = await fetch(`${appApiServerUrl}/auth/login/jwt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      // Store response in token to avoid repeated API calls
      token.accessToken = accessToken;
      token.apiKey = data.apiKey;
      token.primaryRole = data.primaryRole;
      token.uiRoutesAccess = data.permissions;

      return {
        ...session,
        user: {
          ...session.user,
          accessToken: accessToken,
          apiKey: data.apiKey,
          primaryRole: data.primaryRole,
          provider: token.provider,
          uiRoutesAccess: data.permissions,
        },
      };
    } catch (error) {
      console.error("Session error:", error);
      return session; // Return the session even if there's an error
    }
  },
}

*/
