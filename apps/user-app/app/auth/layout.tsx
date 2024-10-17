import React from "react";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex items-center justify-center bgBlue">
      {children}
    </div>
  );
}

export default AuthLayout;
