import * as z from "zod";

export const FormSchema = z.object({
  pin: z.string().min(6, { message: "Your PIN should be 6 digits." }),
});

export const P2PFormSchema = z.object({
  recipient: z.string().min(1, "Recipient is required"),
  amount: z.number().min(1, "Amount must be greater than 0"),
});

export const onBoardingSchema = z.object({
  phoneNumber: z.string().max(10, { message: "Maximum 10 characters" }),
  pin: z.string().min(6, { message: "Your PIN should be 6 digits." }),
  confirmPin: z.string().min(6, { message: "Minimum 6 characters" }),
});

export const B2BFormSchema = z.object({
  receiverAccountNumber: z.string().min(1, { message: "Receiver account number is required" }),
  amount: z.number().min(1, { message: "Amount must be greater than 0" }),
});
