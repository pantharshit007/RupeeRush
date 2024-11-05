// @types/next-auth.d.ts
import NextAuth from "next-auth";
import { SchemaTypes } from "@repo/db/client";

declare module "next-auth" {
  interface User extends SchemaTypes.User {}

  interface Session {
    user?: User;
  }

  interface JWT {
    role: SchemaTypes.AuthType;
  }
}
