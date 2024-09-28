import CredentialsProvider from "next-auth/providers/credentials";
import db from "@repo/db/client";
import bcrypt from "bcrypt";

interface Creds {
  id: string;
  name?: string;
  email: string;
  password: string;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
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
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const existingUser = await db.user.findFirst({
          where: {
            email: credentials.email,
          },
        });

        // if user email already exists
        if (existingUser) {
          const isPassValid = await bcrypt.compare(
            credentials.password,
            existingUser.password
          );

          if (isPassValid) {
            return {
              id: existingUser.id.toString(),
              name: existingUser?.name,
              email: existingUser.email,
            };
          }
        }

        // SignIn
        try {
          const name = credentials.email.split("@")[0];
          const user = await db.user.create({
            data: {
              email: credentials.email || "",
              password: hashedPassword,
              name: name,
            },
          });

          return {
            id: user.id.toString(),
            name: name || null,
            email: user.email,
          };
        } catch (err: any) {
          console.error("Signup Failed", err.message);
        }

        return null;
      },
    }),
  ],

  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async session({ token, session }: any) {
      session.user.id = token.sub;
      return session;
    },
  },
};
