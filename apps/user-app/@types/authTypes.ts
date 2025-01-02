import { SchemaTypes } from "@repo/db/client";

export interface CustomToken {
  name?: string;
  email?: string;
  picture: string | null;
  sub: string;
  role: SchemaTypes.UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  phoneNumber: string | null;
  upiId: string | null;
  lastUpdate?: number;
  iat: number;
  exp: number;
  jti: string;
}

//https://dribbble.com/shots/19397965-Transaction-History-UI-Design
export interface PaymentStatus {
  // what do you call when you add money in your wallet?
  type: "Deposit" | "Withdraw" | "Transfer" | "Recieve";
}
