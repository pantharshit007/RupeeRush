import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import { LoginSchema } from "@repo/schema/authSchema";
import { getUserByEmail } from "./utils/userFetch";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GITHUB_CLIENT_ID = process.env.AUTH_GITHUB_ID!;
const GITHUB_CLIENT_SECRET = process.env.AUTH_GITHUB_SECRET!;

export const authConfig: NextAuthConfig = {
  providers: [
    // GOOGLE
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),

    // GITHUB
    Github({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    }),

    // Email-Password
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        // fields aren't valid
        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        const user = await getUserByEmail(email);
        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return null;
        }

        return user;
      },
    }),
  ],
};

export default authConfig;
