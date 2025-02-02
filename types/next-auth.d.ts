import NextAuth, { DefaultSession, DefaultUser, NextAuthUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User extends NextAuthUser {
    primaryRole: string,
    accessToken: string | null,
  }

  interface Session extends DefaultSession {
    accessToken?: string
    user: {
      id: string,
      primaryRole: string,
      accessToken?: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    accessToken?: string
  }
}

/*
declare module "next-auth/adapters" {
  interface AdapterUser extends DefaultUser {
    primaryRole: string
  }
}
*/