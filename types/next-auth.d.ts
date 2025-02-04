import NextAuth, { DefaultSession, DefaultUser, NextAuthUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User extends NextAuthUser {
    primaryRole: string,
    accessToken?: string | null,
    apiKey?: string | null,
  }

  interface Session extends DefaultSession {
    accessToken?: string
    apiKey?: string | null
    user: {
      id: string,
      primaryRole: string,
      accessToken?: string | null,
      apiKey?: string | null,
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    accessToken?: string | null,
    apiKey?: string | null,
  }
}

/*
declare module "next-auth/adapters" {
  interface AdapterUser extends DefaultUser {
    primaryRole: string
  }
}
*/