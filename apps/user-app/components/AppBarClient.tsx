"use client";

import AppBar from "@repo/ui/components/custom/AppBar";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

function AppBarClient() {
  const session = useSession();
  const router = useRouter();

  async function signoutFunc() {
    // TODO: fix this since this is a signout by next-auth there is chances cache issue arrise use one from @/lib/auth
    await signOut();
    router.push("/api/auth/signin");
  }
  return (
    <>
      <div>
        <AppBar onSignin={signIn} onSignout={() => signoutFunc()} user={session.data?.user} />
      </div>
    </>
  );
}

export default AppBarClient;
