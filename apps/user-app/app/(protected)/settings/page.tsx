import { auth, signOut } from "@/lib/auth";
import React from "react";

async function page() {
  // TODO: why is logoutAction gives /undefine
  const session = await auth();
  const handleSignOut = async () => {
    "use server";
    await signOut({ redirectTo: "/auth/login" });
  };
  return (
    <div>
      <p>User Info: {JSON.stringify(session?.user)}</p>
      <form action={handleSignOut}>
        <button type="submit">Sign Out</button>
      </form>
    </div>
  );
}

export default page;
