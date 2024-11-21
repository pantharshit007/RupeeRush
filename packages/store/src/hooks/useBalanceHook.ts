import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { balanceAtom } from "../atoms/balance";

// Hook to read balance
export const useBalance = () => {
  return useRecoilValue(balanceAtom);
};

// Hook to update balance
export const useSetBalance = () => {
  return useSetRecoilState(balanceAtom);
};

// Hook to get and set balance together
export const useBalanceState = () => {
  return useRecoilState(balanceAtom);
};
