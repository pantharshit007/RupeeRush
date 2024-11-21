import { atom } from "recoil";

export const balanceAtom = atom<{ walletBalance: number | null; bankBalance: number | null }>({
  key: "balance",
  default: { walletBalance: null, bankBalance: null },
});
