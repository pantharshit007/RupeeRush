import React from "react";
import { redirect } from "next/navigation";
import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/ui/button";
import LoginButton from "@/components/auth/LoginButton";
import { font } from "@/utils/fonts";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  // if (!session?.user) {
  //   redirect("/api/auth/signin");
  // }

  return (
    <>
      <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
        <div className="space-y-6 text-center mb-3">
          <h1 className={cn("text-6xl font-semibold text-white drop-shadow-md", font.className)}>
            hi {JSON.stringify(session?.user?.name)} 👋
          </h1>
        </div>

        <div>
          <LoginButton asChild>
            <Button variant="secondary" size="lg">
              Sign In
            </Button>
          </LoginButton>
        </div>
      </div>
    </>
  );
}
