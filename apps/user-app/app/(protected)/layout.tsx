import NavBar from "@/components/NavBar";
import { UseProvider } from "@/hooks/UseProvider";
import React from "react";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <UseProvider>
        <NavBar />
        <div className="flex min-w-screen h-[calc(100vh-3.5rem)] bgBlue">{children}</div>
      </UseProvider>
    </main>
  );
};

export default ProtectedLayout;
