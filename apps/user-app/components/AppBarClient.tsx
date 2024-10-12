"use client";

import { Appbar } from "@repo/ui/components/AppBar";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

function AppBarClient() {
  const session = useSession();
  const router = useRouter();

  async function signoutFunc() {
    await signOut();
    router.push("/api/auth/signin");
  }
  return (
    <>
      <div>
        <Appbar
          onSignin={signIn}
          onSignout={() => signoutFunc()}
          user={session.data?.user}
        />
      </div>
    </>
  );
}

export default AppBarClient;
