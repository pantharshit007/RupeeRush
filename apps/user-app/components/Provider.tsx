"use client";

import { RecoilRoot } from "recoil";
import { SessionProvider } from "next-auth/react";
export const Provider = ({ children, session }: { children: React.ReactNode; session: any }) => {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <RecoilRoot>{children}</RecoilRoot>
    </SessionProvider>
  );
};
