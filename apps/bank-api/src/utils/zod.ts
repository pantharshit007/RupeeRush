import * as z from "zod";

export const PaymentViaCardSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be at least 16 digits"),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Invalid expiry date format"),
  cvv: z.string().length(3, "CVV must be 3 digits").regex(/^\d+$/, "CVC must contain only numbers"),
  cardholderName: z.string().min(1, "Cardholder name is required"),
  country: z.string().min(1, "Country is required"),
  pin: z.string().min(4, "PIN must be at least 4 digits").max(6, "PIN must be at most 6 digits"),
  saveInfo: z.boolean(),
  // New data added
  txnId: z.string().min(1, "Transaction ID is required"),
  nonce: z.string().min(1, "Nonce is required"),
});
