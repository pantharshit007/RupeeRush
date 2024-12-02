import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { walletAtom } from "../atoms/walletAtom";

// Hook to read wallet
export const useWalletTxn = () => {
  return useRecoilValue(walletAtom);
};

// Hook to update wallet
export const useSetWalletTxn = () => {
  return useSetRecoilState(walletAtom);
};

// Hook to get and set wallet together
export const useWalletTxnState = () => {
  return useRecoilState(walletAtom);
};
