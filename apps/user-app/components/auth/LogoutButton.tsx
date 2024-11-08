"use client";

import { logoutAction } from "@/actions/auth/logout";

interface LogoutButtonProps {
  children: React.ReactNode;
}

function LogoutButton({ children }: LogoutButtonProps) {
  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <>
      <span onClick={handleLogout} className="cursor-pointer">
        {children}
      </span>
    </>
  );
}

export default LogoutButton;
