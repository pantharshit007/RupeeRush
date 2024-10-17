"use server";

import { RegisterSchema } from "@repo/schema/authSchema";
import * as z from "zod";

export const registerAction = async (values: z.infer<typeof RegisterSchema>) => {
  const isValidFields = RegisterSchema.safeParse(values);

  // invalid login creds
  if (!isValidFields.success) {
    return { error: "Invalid fields" };
  }

  return { success: "Email Sent!" };
};
