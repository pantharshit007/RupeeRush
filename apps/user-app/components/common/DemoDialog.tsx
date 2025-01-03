"use client"

import React, { useState } from "react";
import * as z from "zod";
import { BsLightningChargeFill } from "react-icons/bs";

import { LoginSchema } from "@repo/schema/authSchema";
import { toast } from "sonner";

function DemoDialog({ submitHandler }: { submitHandler: Function }) {
  const [showDemo, setShowDemo] = useState(true);

  const handleDemoClickAlice = () => {
    setShowDemo(false);
    const value: z.infer<typeof LoginSchema> = {
        email: "alice@example.com",
        password: "alice123",
      };
      submitHandler(value);

      toast.info("Remember this",{
        description: "Alice's Pin: 123456",
        duration: 8000,
      });

    }


  const handleDemoClickBob = () => {
    setShowDemo(false);
    const value: z.infer<typeof LoginSchema> = {
        email: "bob@example.com",
        password: "bob123",
      };
      submitHandler(value);

      toast.info("Remember this",{
        description: "Bob's Pin: 654321",
        duration: 8000,
      });
  };
  
  return (
    <div
      className={`${showDemo ? "" : "hidden"} justify-center items-center absolute bg-gradient-to-b from-azureBlue-400/90 via-azureBlue-500 to-azureBlue-700/90 top-52 md:top-[12%] xl:top-[15%] md:left-[17%] xl:left-[20%] right-[20%] p-6 rotate-[-28deg] z-20 rounded-md max-md:hidden w-[300px] origin-top-right animate-sway`}
    >
      <div className="flex flex-col gap-2 relative">
        <div
          onClick={() => {
            setShowDemo(false);
          }}
          className="absolute top-[-28px] right-[-27px] text-5xl text-indigo-500 rounded-full w-[40px] h-[40px] flex justify-center items-center cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="20" height="20">
            <circle cx="50" cy="50" r="45" fill="#888888" stroke="#000000" strokeWidth="2" />
            <circle cx="50" cy="50" r="20" fill="#ffffff" />
          </svg>
        </div>

        <div className=" gap-y-2 flex flex-col">
          <p className="text-2xl font-extrabold text-richblack-5 flex items-center">
            Try Demo &nbsp;
            <BsLightningChargeFill size={20} className="text-yellow-500" />
          </p>

          {/* ALICE LOGIN */}
          <button
            onClick={handleDemoClickAlice}
            className="bg-gradient-to-b from-azureBlue-600 to-azureBlue-700 font-medium font-mono mt-4 mb-1 text-richblack-25 px-4 py-2 rounded-md flex"
          >
            Login as Alice
          </button>

          {/* BOB LOGIN */}
          <button
            onClick={handleDemoClickBob}
            className="bg-gradient-to-b from-azureBlue-700 to-azureBlue-600 font-medium font-mono text-richblack-25 px-4 py-2 rounded-md flex"
          >
            Login as Bob
          </button>
        </div>
      </div>
    </div>
  );
}

export default DemoDialog;
