"use client";
import React from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useSearchParams } from "next/navigation";
import AuthType from "@repo/db/client";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/utils/apiRoute";
import { Button } from "@repo/ui/components/ui/button";

function Provider() {
  const searchParams = useSearchParams();
  // const urlError = searchParams.get("error");
  const callBackUrl = searchParams.get("callBackUrl");

  const handleClick = async (provider: "google" | "github") => {
    // console.log("provider", AuthType, provider);

    // TODO: this is wrong make it better, causes problem.
    // if (urlError === "OAuthAccountNotLinked") {
    //   window.alert("Email Already in use with another provide");
    //   return;
    // }

    signIn(provider, { redirectTo: DEFAULT_LOGIN_REDIRECT || callBackUrl });
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
}

export default Provider;
