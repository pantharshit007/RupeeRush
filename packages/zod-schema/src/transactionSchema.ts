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

export const PaymentViaCardSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be at least 16 digits"),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Invalid expiry date format"),
  cvv: z.string().length(3, "CVV must be 3 digits").regex(/^\d+$/, "CVC must contain only numbers"),
  cardholderName: z.string().min(1, "Cardholder name is required"),
  country: z.string().min(1, "Country is required"),
  pin: z.string().min(4, "PIN must be at least 4 digits").max(6, "PIN must be at most 6 digits"),
  saveInfo: z.boolean(),
});
