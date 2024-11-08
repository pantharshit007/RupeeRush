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
    <>
      <button onClick={handleSignOut} className="">
        Sign out
        {JSON.stringify(session.data?.user)}
      </button>
    </>
  );
}

export default page;
