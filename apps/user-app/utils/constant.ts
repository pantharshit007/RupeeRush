import { SchemaTypes } from "@repo/db/client";

interface BanksProps {
  name: SchemaTypes.Bank;
  redirectUrl: string;
}

export const SUPPORTED_BANKS: BanksProps[] = [
  {
    name: "HDFC",
    redirectUrl: "https://netbanking.hdfcbank.com",
  },
  {
    name: "AXIS",
    redirectUrl: "https://www.axisbank.com/",
  },
];

export const REGEXP_ONLY_DIGITS_AND_CHARS = "^[a-zA-Z0-9]+$";
export const REGEXP_ONLY_DIGITS = "^\\d+$";
