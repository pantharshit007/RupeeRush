import { atom } from "recoil";

export const balanceAtom = atom<{ walletBalance: number; bankBalance: number }>({
  key: "balance",
  default: { walletBalance: 0, bankBalance: 0 },
});
