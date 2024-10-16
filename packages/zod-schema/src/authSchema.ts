import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z
    .string({ invalid_type_error: "Invalid password" })
    .min(6, { message: "Minimum length is 6 characters" }),
});
