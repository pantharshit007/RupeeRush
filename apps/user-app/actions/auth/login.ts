"use server";

import { LoginSchema } from "@repo/schema/authSchema";
import * as z from "zod";

export const loginAction = async (values: z.infer<typeof LoginSchema>) => {
  const isValidFields = LoginSchema.safeParse(values);

  // invalid login creds
  if (!isValidFields.success) {
    return { error: "Invalid fields" };
  }

  return { success: "Email Sent!" };
};
