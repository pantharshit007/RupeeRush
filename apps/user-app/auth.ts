import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import db from "@repo/db/client";
import bcrypt from "bcrypt";
import NextAuth, { NextAuthConfig, NextAuthResult } from "next-auth";
import { randomUUID } from "crypto";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

if (!NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not set");
}

const authOptions: NextAuthConfig = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 3, // 3 hr
  },
  providers: [
    // Signup Provider
    CredentialsProvider({
      id: "creds-signup",
      name: "Sign Up",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "text", required: true },
        password: { label: "Password", type: "password", required: true },
      },

      async authorize(credentials: any) {
        const existingUser = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (existingUser) {
          throw new Error("User already exists!");
        }

        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const name = credentials.email.split("@")[0];

        const user = await db.user.create({
          data: {
            name: credentials.name || name,
            email: credentials.email,
            password: hashedPassword,
          },
        });

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),

    // Login Provider
    CredentialsProvider({
      id: "creds-Signin",
      name: "Log In",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "exampl@gmail.com",
          required: true,
        },
        password: { label: "Password", type: "password", required: true },
      },

      async authorize(credentials: any) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),

    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],

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
} satisfies NextAuthConfig;

const nextAuth = NextAuth(authOptions);
export const auth: NextAuthResult["auth"] = nextAuth.auth;
export const {
  handlers: { GET, POST },
  signIn,
  signOut,
} = nextAuth;
