import { atom } from "recoil";

export const b2bTransactionAtom = atom<{ timestamp: number | null }>({
  key: "b2bTransaction",
  default: { timestamp: null },
});
