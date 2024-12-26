import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { b2bTransactionAtom } from "../atoms/b2bAtom";

// Hook to read b2b transaction
export const useB2BTxn = () => {
  return useRecoilValue(b2bTransactionAtom);
};

// Hook to update b2b transaction
export const useSetB2BTxn = () => {
  return useSetRecoilState(b2bTransactionAtom);
};

// Hook to get and set b2b transaction together
export const useB2BTxnState = () => {
  return useRecoilState(b2bTransactionAtom);
};
