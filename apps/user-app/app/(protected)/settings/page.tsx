"use client";
import { logoutAction } from "@/actions/auth/logout";
import { useSession } from "next-auth/react";
import React from "react";

function page() {
  const session = useSession();

  const handleSignOut = () => {
    logoutAction();
  };

  return (
    <div className="text-white">
      <p>User Info: {JSON.stringify(session)}</p>
      {session.status !== "authenticated" ? (
        <p>you are not signed in!</p>
      ) : (
        <p>You are Logged in!</p>
      )}
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
}

export default page;
