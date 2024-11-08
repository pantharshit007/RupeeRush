import { UseProvider } from "@/hooks/UseProvider";
import React from "react";
import NavigationBar from "./_components/NavigationBar";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <UseProvider>
      <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bgBlue">
        <NavigationBar />
        {children}
      </div>
    </UseProvider>
  );
};

export default ProtectedLayout;
