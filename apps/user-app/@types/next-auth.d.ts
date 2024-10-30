// @types/next-auth.d.ts
import NextAuth from "next-auth";
// import { UserRole } from "@repo/db/client";

declare module "next-auth" {
  // TODO: find a way to user userModel direct form `db/client` instead of custom types.
  interface User extends CustomUser {}

  interface Session {
    user?: User;
  }

  interface JWT {
    role: User["role"];
  }
}

// Custom user type for application-specific data
type CustomUser = {
  id: string;
  email: string;
  emailVerified: Date | null;
  name: string | null;
  phoneNumber: string | null;
  password: string | null;
  image: string | null;
  role: "USER" | "ADMIN";
  upiId: string | null;
  bankName: string | null;
};

export { CustomUser };
