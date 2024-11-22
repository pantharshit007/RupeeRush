import React from "react";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-full flex flex-col gap-y-10 items-center justify-center bgBlue">
      {children}
    </div>
  );
};

export default ProtectedLayout;
