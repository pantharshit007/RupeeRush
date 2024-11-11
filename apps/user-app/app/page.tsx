import React from "react";
import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/ui/button";
import LoginButton from "@/components/auth/LoginButton";
import { font } from "@/utils/fonts";
import { auth } from "@/lib/auth";
import NavBar from "@/components/NavBar";

export default async function Home() {
  const session = await auth();

  return (
    <>
      <NavBar />
      <div className="flex h-[calc(100vh-3.5rem)] flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
        <div className="space-y-6 text-center mb-3">
          <h1 className={cn("text-6xl font-semibold text-white drop-shadow-md", font.className)}>
            hi {JSON.stringify(session?.user?.name)} 👋
          </h1>
        </div>

        <div>
          <LoginButton asChild mode="modal">
            <Button variant="secondary" size="lg">
              Sign In
            </Button>
          </LoginButton>
        </div>
      </div>
    </>
  );
}
