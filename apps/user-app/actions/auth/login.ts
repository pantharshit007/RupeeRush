"use server";

import { signIn } from "@/lib/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/utils/apiRoute";
import { LoginSchema } from "@repo/schema/authSchema";
import { AuthError } from "next-auth";
import * as z from "zod";

export const loginAction = async (values: z.infer<typeof LoginSchema>) => {
  const isValidFields = LoginSchema.safeParse(values);

  // invalid login creds
  if (!isValidFields.success) {
    return { error: "Invalid fields" };
  }

  // destructure fields
  const { email, password } = isValidFields.data;

  try {
    // calling next-auth signin
    await signIn("credentials", {
      email: email,
      password: password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      console.log("> Login failed: " + err.message);
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        case "AccessDenied":
          return { error: "Access Denied!" };
        default:
          return { error: err.message || "Something went wrong!" };
      }
    }
    throw err; // required in next-auth to rediect back
  }

  return { success: "Login Success!" };
};
