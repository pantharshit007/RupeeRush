import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { triggerAtom } from "../atoms/triggerAtom";

// Hook to read trigger
export const useTrigger = () => {
  return useRecoilValue(triggerAtom);
};

// Hook to update trigger
export const useSetTrigger = () => {
  return useSetRecoilState(triggerAtom);
};

// Hook to get and set trigger together
export const useTriggerState = () => {
  return useRecoilState(triggerAtom);
};
