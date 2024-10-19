"use server";

import * as z from "zod";
import bcrypt from "bcrypt";

import db from "@repo/db/client";
import { RegisterSchema } from "@repo/schema/authSchema";
import { getUserByEmail } from "@/lib/userFetch";

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

  await db.user.create({
    data: {
      name,
      email: email,
      password: hashedPassword,
    },
  });

  return { success: "Email Sent!" };
};
