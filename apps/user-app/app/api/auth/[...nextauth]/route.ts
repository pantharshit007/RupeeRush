import NextAuth from "next-auth";
import { authOptions } from "@lib/auth";

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
export const auth = handler;
export const signIn = handler;
export const signOut = handler;
