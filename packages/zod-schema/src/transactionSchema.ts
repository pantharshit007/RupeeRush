import * as z from "zod";

export const FormSchema = z.object({
  pin: z.string().min(6, { message: "Your PIN should be 6 digits." }),
});

export const P2PFormSchema = z.object({
  recipient: z.string().min(1, "Recipient is required"),
  amount: z.number().min(1, "Amount must be greater than 0"),
});
