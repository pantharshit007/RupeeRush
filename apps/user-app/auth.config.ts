import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { LoginSchema } from "@repo/schema/authSchema";
import { getUserByEmail } from "./lib/userFetch";

export default {
  providers: [
    // email-password
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
          console.warn("> Login Error: email not found: " + email);
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          console.warn("> Login Error: Invalid password");
          return null;
        }

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
