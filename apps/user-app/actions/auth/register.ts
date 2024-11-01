"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import db from "@repo/db/client";
import { RegisterSchema } from "@repo/schema/authSchema";
import { getUserByEmail } from "@/utils/userFetch";
import { generateVerificationToken } from "@/lib/generateToken";
import { sendVerificationEmail } from "@/lib/mail";

export const registerAction = async (values: z.infer<typeof RegisterSchema>) => {
  const isValidFields = RegisterSchema.safeParse(values);

  // invalid login creds
  if (!isValidFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password, name } = isValidFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email already in use!" };
  }

  // TODO: email verification: dont create account without first verifying the user
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  await db.user.create({
    data: {
      name,
      email: email,
      password: hashedPassword,
    },
  });

  return { success: "Confirmation Email Sent!" };
};
