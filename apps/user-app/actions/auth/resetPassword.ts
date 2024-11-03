"use server";

import * as z from "zod";

import { ResetSchema } from "@repo/schema/authSchema";
import { getUserByEmail } from "@/utils/userFetch";
import { generateResetToken } from "@/lib/generateToken";
import { sendResetPasswordEmail } from "@/lib/mail";

/**
 * function to generate password reset token
 * @serverAction
 * @param email is the email from the user
 * @returns
 */
export const resetPasswordAction = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid emails" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    // to avoid malicious actor from guessing correct emails thorugh which they can brute force there way into pass.
    return { success: "Check your Inbox!" };
  }

  const resetToken = await generateResetToken(email);
  await sendResetPasswordEmail(resetToken.email, resetToken.token);

  return { success: "Reset Email sent" };
};
