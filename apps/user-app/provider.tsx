"use client";
import { RecoilRoot } from "recoil";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (<RecoilRoot>{children}</RecoilRoot>);
};
