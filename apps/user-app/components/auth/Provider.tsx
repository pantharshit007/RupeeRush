"use client";
import { Button } from "@repo/ui/components/ui/button";
import React from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

function Provider() {
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        variant={"outline"}
        size={"lg"}
        className="w-full"
        onClick={() => {}}
      >
        <FcGoogle className="h-6 w-6" />
      </Button>

      <Button
        variant={"outline"}
        size={"lg"}
        className="w-full"
        onClick={() => {}}
      >
        <FaGithub className="h-6 w-6" />
      </Button>
    </div>
  );
}

export default Provider;
