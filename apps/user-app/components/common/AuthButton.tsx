"use client";

import { logoutAction } from "@/actions/auth/logout";
import { Button } from "@repo/ui/components/ui/button";
import { signIn } from "next-auth/react";
import React from "react";

interface AuthButtonProps {
  isAuthenticated: boolean;
}

export function AuthButton({ isAuthenticated }: AuthButtonProps) {
  const handleLogout = async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // is User signed In?
  return isAuthenticated ? (
    <Button onClick={handleLogout}>Logout</Button>
  ) : (
    <Button onClick={() => signIn()} variant="destructive">
      Login
    </Button>
  );
}
