import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z
    .string({ invalid_type_error: "Invalid password" })
    .min(6, { message: "Minimum length is 6 characters" }),
  twoFactorCode: z.string().length(6).optional(),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, { message: "Minimum 6 characters required" }),
  name: z.string().min(3, { message: "Name is required" }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z
    .string({ invalid_type_error: "Invalid password" })
    .min(6, { message: "Minimum length is 6 characters" }),
});

export const SettingsSchema = z
  .object({
    name: z.string().optional(),
    isTwoFactorEnabled: z.boolean().optional(),
    email: z.string().email().optional(),
    oldPassword: z.optional(z.string().min(6, { message: "Minimum length is 6 characters" })),
    newPassword: z.optional(z.string().min(6, { message: "Minimum length is 6 characters" })),
  })
  .refine(
    (data) => {
      if (!data.oldPassword && data.newPassword) return false;
      return true;
    },
    { message: "Old Password is required", path: ["oldPassword"] }
  )
  .refine(
    (data) => {
      if (data.oldPassword && !data.newPassword) return false;
      return true;
    },
    { message: "New Password is required", path: ["newPassword"] }
  );
