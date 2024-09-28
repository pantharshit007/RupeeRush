"use client";

import { Appbar } from "@repo/ui/appbar";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
  return (
    <>
      <Appbar onSignin={signIn} onSignout={signOut} user={session.data?.user} />
      <div className="text-3xl text-red-400">
        hi{" "}
        {JSON.stringify(
          session?.data?.user?.name || session?.data?.user?.email
        )}
      </div>
    </>
  );
}
