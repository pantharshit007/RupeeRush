"use server";

import { signIn } from "@/lib/auth";
import { generateTwoFACode } from "@/lib/generateToken";
import { sendTwoFactorCode } from "@/lib/mail";
import { DEFAULT_LOGIN_REDIRECT } from "@/utils/apiRoute";
import { getTwoFactorCodeByEmail } from "@/utils/tokenFetch";
import { getUserByEmail } from "@/utils/userFetch";
import db from "@repo/db/client";
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
  const { email, password, twoFactorCode } = isValidFields.data;

  // check if user already has an account or not!
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email) {
    return { error: "Incorrect Credentials" };
  }
  if (!existingUser.password) {
    // TODO: add a check in loginForm to show a toast for this case like: {info: "..."}
    return { error: "Email already in use, login in with Google/Github" };
  }

  // though it shouldn't work since we arent creating account without first verifying
  /**
   * if (!existingUser.emailVerified) {
   *  const verificationToken = await generateVerificationToken({
   *    email: existingUser.email,
   *    name: existingUser.name!,
   *    hashedPassword: existingUser.password,
   *  });
   *  await sendVerificationEmail(verificationToken.email, verificationToken.token);
   *
   *  return { success: "Verification email send!" };
   *}
   */

  // If user enabled 2FA on there account
  if (existingUser.email && existingUser.isTwoFactorEnabled) {
    // one 2nd visit user provide the `twoFactorCode`:`CODE`
    if (twoFactorCode) {
      const existingCode = await getTwoFactorCodeByEmail(existingUser.email);

      if (existingCode?.code !== twoFactorCode) {
        return { error: "Invalid Code" };
      }

      const hasExpired = new Date(existingCode.expires) < new Date();
      if (hasExpired) {
        await db.twoFactorCode.delete({
          where: { id: existingCode.id },
        });

        return { info: "Re-Login, Code expired!" };
      }

      // delete the `CODE` from `twoFactorCode` table
      await db.twoFactorCode.delete({
        where: { id: existingCode.id },
      });

      // update `isTwoFactorConfirmation` in user db to true
      await db.user.update({
        where: { id: existingUser.id },
        data: { isTwoFactorConfirmation: true },
      });
    } else {
      const twoFactorCode = await generateTwoFACode(existingUser.email);
      await sendTwoFactorCode(twoFactorCode.email, twoFactorCode.code);

      return { twoFactorSend: true };
    }
  }

  try {
    // calling next-auth signin
    await signIn("credentials", {
      email: email,
      password: password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      console.warn(new Error("> Login failed: " + err));
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        case "AccessDenied":
          return { error: "Access Denied!" };
        case "OAuthAccountNotLinked":
          return { error: "Account already exists with same email!" };
        case "EmailSignInError":
          return { error: "Email sign in error!" };
        default:
          return { error: err.message || "Something went wrong!" };
      }
    }
    throw err; // required in next-auth to rediect back
  }

  return { success: "Login Success!" };
};
