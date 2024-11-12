"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

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

  const verificationToken = await generateVerificationToken({ email, name, hashedPassword });
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation Email Sent!" };
};
