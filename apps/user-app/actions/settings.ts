"use server";

import * as z from "zod";
import { compare, hash } from "bcryptjs";
import db from "@repo/db/client";

import { serverUser } from "@/utils/currentUser";
import { getUserByEmail, getUserById } from "@/utils/userFetch";
import { sendVerificationEmail } from "@/lib/mail";
import { SettingsSchema } from "@repo/schema/authSchema";
import { unstable_update } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/generateToken";

export const settingsAction = async (values: z.infer<typeof SettingsSchema>, userId: string) => {
  try {
    const validatedValues = SettingsSchema.safeParse(values);
    if (!validatedValues.success) {
      return { error: "Input is invalid" };
    }

    const user = await serverUser();
    if (!user) {
      return { error: "Unauthorized!" };
    }

    // to check if this is not leftover session (sideffects maybe?)
    const dbUser = await getUserById(user.id);
    if (!dbUser) {
      return { error: "Unauthorized!" };
    }

    // check OAuth Login
    if (user.isOAuth) {
      values.email = undefined;
      values.oldPassword = undefined;
      values.newPassword = undefined;
      values.isTwoFactorEnabled = undefined;
    }

    if (values.email && values.email !== user.email) {
      if (values.email === undefined) {
        return { info: "Email is empty" };
      }

      const existingUser = await getUserByEmail(values.email);
      // no need for id check though
      if (existingUser && existingUser.id !== user.id) {
        return { error: "Email already in use!" };
      }

      const verificationToken = await generateVerificationToken({ email: values.email, userId });
      await sendVerificationEmail(verificationToken.email, verificationToken.token);

      return { success: "Verification email sent!" };
    }

    let hashedPassword = "";
    if (values.oldPassword && values.newPassword && dbUser.password) {
      const validPassword = await compare(values.oldPassword, dbUser.password);
      if (!validPassword) {
        return { error: "Incorrect Password!" };
      }

      hashedPassword = await hash(values.newPassword, 10);
      values.oldPassword = undefined;
      values.newPassword = undefined;
    }

    const updatedUser = await db.user.update({
      where: { id: dbUser.id },
      data: {
        ...values,
        password: hashedPassword,
      },
    });

    //!BUGGY: This is really unstable
    // unstable_update({
    //   user: {
    //     email: updatedUser.email,
    //     name: updatedUser.name,
    //   },
    // });

    return { success: "Settings Updated!" };
  } catch (err) {
    console.error("Error updating settings:", err);
    return { error: "Error updating settings!" };
    // throw err;
  }
};
