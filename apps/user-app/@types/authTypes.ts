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
  lastUpdate?: number;
  iat: number;
  exp: number;
  jti: string;
}
