"use server";

import * as z from "zod";
import { hash } from "bcryptjs";

import { getResetTokenByToken } from "@/utils/tokenFetch";
import { NewPasswordSchema } from "@repo/schema/authSchema";
import db from "@repo/db/client";
import { getUserByEmail } from "@/utils/userFetch";

/**
 * function to verify reset token and reset password
 * @serverAction
 * @param token sent from URL
 *
 */

export const updatePasswordAction = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid password" };
  }

  if (!token) {
    return { error: "Missing token" };
  }

  const { password } = validatedFields.data;
  const hashedPassword = await hash(password, 10);

  // check if reset token is valid or not: exists in db
  const resetToken = await getResetTokenByToken(token);
  if (!resetToken) {
    return { error: "Token does not exist!" };
  }

  // check for is Token expired or not?: expires < current
  const hasExpired = new Date(resetToken.expires) < new Date();
  if (hasExpired) {
    await db.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    return { error: "Token has expired" };
  }

  const existingUser = await getUserByEmail(resetToken.email);
  if (!existingUser) {
    return { error: "User not found" };
  }

  try {
    // update user password with new password using
    await db.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });

    return { success: "Password Updated!" };
  } catch (err: any) {
    console.error("> Password Reset failed: " + err);
    return { error: "Failed to update password!" };

    // clean up the verification token
  } finally {
    await db.passwordResetToken.delete({
      where: { id: resetToken.id },
    });
  }
};
