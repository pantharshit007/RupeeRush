import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z
    .string({ invalid_type_error: "Invalid password" })
    .min(6, { message: "Minimum length is 6 characters" }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, { message: "Minimum 6 characters required" }),
  name: z.string().min(3, { message: "Name is required" }),
});
