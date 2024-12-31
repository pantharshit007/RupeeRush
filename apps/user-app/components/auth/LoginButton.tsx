"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/components/ui/dialog";
import LoginForm from "./LoginForm";

interface LoginButtonProp {
  children: React.ReactNode;
  mode?: "redirect" | "modal" | "signup";
  asChild: boolean;
}

function LoginButton({ children, mode = "redirect", asChild }: LoginButtonProp) {
  const router = useRouter();

  function clickHandler() {
    if (mode === "redirect") {
      router.push("/auth/login");
    }

    if (mode === "signup") {
      router.push("/auth/signup");
    }
    return;
  }

  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="p-0 w-auto bg-transparent border-none">
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <span onClick={clickHandler} className="cursor-pointer">
      {children}
    </span>
  );
}

export default LoginButton;
