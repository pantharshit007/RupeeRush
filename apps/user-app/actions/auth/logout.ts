"use server";

import { signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

export const logoutAction = async () => {
  try {
    await signOut({ redirectTo: "auth/login" });
  } catch (err) {
    if (err instanceof AuthError) {
      console.log("> Logout failed: " + err.message);
    }
    throw err;
  }
};
