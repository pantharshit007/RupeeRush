"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface LoginButtonProp {
  children: React.ReactNode;
  mode?: "redirect" | "modal";
  asChild: boolean;
}

function LoginButton({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProp) {
  const router = useRouter();

  function clickHandler() {
    router.push("/auth/login");
  }

  if (mode === "modal") {
    return "Modal is here!";
  }
  return (
    <span onClick={clickHandler} className="cursor-pointer">
      {children}
    </span>
  );
}

export default LoginButton;
