import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { p2pTransactionAtom } from "../atoms/p2pAtom";

// Hook to read p2p transaction
export const useP2PTxn = () => {
  return useRecoilValue(p2pTransactionAtom);
};

// Hook to update p2p transaction
export const useSetP2PTxn = () => {
  return useSetRecoilState(p2pTransactionAtom);
};

// Hook to get and set p2p transaction together
export const useP2PTxnState = () => {
  return useRecoilState(p2pTransactionAtom);
};
