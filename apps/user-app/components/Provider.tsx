"use client";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { RecoilRoot } from "recoil";
import { SessionProvider } from "next-auth/react";

export const Provider = ({ children, session }: { children: React.ReactNode; session: any }) => {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <RecoilRoot>{children}</RecoilRoot>
    </SessionProvider>
  );
};

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
