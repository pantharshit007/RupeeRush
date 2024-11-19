import { Provider } from "@/components/Provider";
import React from "react";
import NavigationBar from "./_components/NavigationBar";
import { auth } from "@/lib/auth";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  return (
    <Provider session={session}>
      <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bgBlue">
        <NavigationBar />
        {children}
      </div>
    </Provider>
  );
};

export default ProtectedLayout;
