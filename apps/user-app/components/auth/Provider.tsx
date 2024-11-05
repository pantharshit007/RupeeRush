"use client";

import React, { Suspense } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { DEFAULT_LOGIN_REDIRECT } from "@/utils/apiRoute";
import { Button } from "@repo/ui/components/ui/button";
import { SchemaTypes } from "@repo/db/client";

// Separate client component for handling search params
const AuthProviderContent = () => {
  const searchParams = useSearchParams();
  const callBackUrl = searchParams.get("callBackUrl");

  const handleClick = async (provider: SchemaTypes.AuthType) => {
    await signIn(provider, { redirectTo: DEFAULT_LOGIN_REDIRECT || callBackUrl });
  };
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        variant={"outline"}
        size={"lg"}
        className="w-full"
        onClick={() => handleClick("google")}
      >
        <FcGoogle className="h-6 w-6" />
      </Button>

      <Button
        variant={"outline"}
        size={"lg"}
        className="w-full"
        onClick={() => handleClick("github")}
      >
        <FaGithub className="h-6 w-6" />
      </Button>
    </div>
  );
};

// Main provider component with Suspense
function Provider() {
  return (
    // TODO: add loading screen
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProviderContent />
    </Suspense>
  );
}

export default Provider;
