import { atom } from "recoil";

export const p2pTransactionAtom = atom<{ timestamp: number | null }>({
  key: "p2pTransaction",
  default: { timestamp: null },
});
