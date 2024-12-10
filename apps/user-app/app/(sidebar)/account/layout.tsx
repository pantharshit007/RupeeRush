import React from "react";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  return <div className="w-11/12 mx-auto max-w-maxContent">{children}</div>;
};

export default ProtectedLayout;
