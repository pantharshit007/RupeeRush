import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
// import { RecoilRoot } from "recoil";
export const UseProvider = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  return (
    // <RecoilRoot  />
    <SessionProvider session={session}>{children}</SessionProvider>
    // </RecoilRoot>
  );
};
