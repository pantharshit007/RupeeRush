import React from "react";
import { auth } from "@/lib/auth";
import TokenVerificationForm from "@/components/auth/TokenVerificationForm";

async function TokenVerificationPage() {
  const session = await auth();
  const loggedIn: boolean = !!session?.user;

  return <TokenVerificationForm existingUser={loggedIn} />;
}

export default TokenVerificationPage;
