// @types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import { SchemaTypes } from "@repo/db/client";

export type ExtendedUser = {
  id: string;
  role: SchemaTypes.UserRole;
  email: string | null;
  name: string | null;
  image: string | null;
  isTwoFactorEnabled: boolean;
};

declare module "next-auth" {
  interface User extends SchemaTypes.User {}

  interface Session {
    user?: ExtendedUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: SchemaTypes.UserRole;
  }
}
