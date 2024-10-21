import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import db, { PrismaAdapter } from "@repo/db/client";
import bcrypt from "bcrypt";
import NextAuth, { NextAuthConfig, NextAuthResult } from "next-auth";
import { randomUUID } from "crypto";
import authConfig from "@/auth.config";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

if (!NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not set");
}

const authOptions: NextAuthConfig = {
  secret: NEXTAUTH_SECRET || "secret",
  callbacks: {
    async session({ token, session }: any) {
      if (token && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const { email, name } = profile as { email?: string; name?: string };

        if (!email) {
          return false;
        }

        await db.user.upsert({
          where: { email },
          update: { name },
          create: {
            email: email,
            name: name || name || email.split("@")[0],
            password: randomUUID(),
          },
        });
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 3, // 3 hr
  },
  ...authConfig,
};

const nextAuth = NextAuth(authOptions);

// need to do that coz of: https://github.com/nextauthjs/next-auth/issues/10568
export const auth: NextAuthResult["auth"] = nextAuth.auth;
export const {
  handlers: { GET, POST },
  signIn,
  signOut,
} = nextAuth;
