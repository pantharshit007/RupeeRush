import { SessionProvider } from "next-auth/react";
// import { RecoilRoot } from "recoil";
export const UseProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    // <RecoilRoot  />
    <SessionProvider>{children}</SessionProvider>
    // </RecoilRoot>
  );
};
