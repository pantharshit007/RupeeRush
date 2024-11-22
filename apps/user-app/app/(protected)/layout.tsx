import React from "react";
import NavigationBar from "./_components/NavigationBar";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bgBlue">
        <NavigationBar />
        {children}
      </div>
    </SessionProvider>
  );
};

export default ProtectedLayout;
