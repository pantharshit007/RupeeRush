import { atom } from "recoil";

export const walletAtom = atom<{ timestamp: number | null }>({
  key: "wallet",
  default: { timestamp: null },
});
