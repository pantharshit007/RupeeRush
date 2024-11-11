"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/components/ui/dialog";
import LoginForm from "./LoginForm";

interface LoginButtonProp {
  children: React.ReactNode;
  mode?: "redirect" | "modal";
  asChild: boolean;
}

function LoginButton({ children, mode = "redirect", asChild }: LoginButtonProp) {
  const router = useRouter();

  function clickHandler() {
    if (mode === "redirect") {
      router.push("/auth/login");
    }
    return;
  }

  // TODO: fix the bug where modal appears and then we are redirected to `/auth/login`
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
