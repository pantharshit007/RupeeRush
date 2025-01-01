"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";

import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";

import FloatingPhone from "@/components/landing/FloatingPhone";
import FloatingCard from "@/components/landing/FloatingCard";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/landing/Footer";

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex h-full flex-col items-center justify-center gap-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.25,
            type: "spring",
            damping: 10,
            stiffness: 100,
          }}
          className="flex max-w-7xl flex-col items-center justify-center gap-2 px-4"
        >
          <h1 className="max-w-2xl max-sm:w-80 py-2 pt-16 text-center font-bold text-5xl tracking-tighter md:text-6xl xl:text-7xl">
            <span className="w-fit bg-gradient-to-b from-azureBlue-400 to-azureBlue-700 bg-clip-text pr-1.5 text-center text-transparent md:mb-4">
              Smart Banking,
            </span>{" "}
            <span className="bg-gradient-to-b from-landing/90 to-landing/60 bg-clip-text py-1 text-transparent">
              for a Smarter India
            </span>
          </h1>

          <p className="mx-auto text-center text-lg font-medium tracking-tight text-landing/80 md:text-xl max-sm:w-[80%]">
            Experience seamless digital banking with instant transfers.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.5,
            type: "spring",
            damping: 10,
            stiffness: 100,
          }}
          className="flex gap-4 max-w-3xl w-[60%] justify-center items-center"
        >
          <div className="flex gap-2 w-[50%] max-w-maxContentTab max-sm:hidden">
            <Input
              placeholder="Enter your email"
              type="email"
              className="px-3 py-2 shadow-sm shadow-azureBlue-400"
            />
          </div>
          <Button size={"lg"} asChild variant={"ghost"} className="sm:hidden border-[1px]">
            <Link href={"/dashboard/home"} target="_blank">
              Join Now
            </Link>
          </Button>{" "}
          <Button size={"lg"} asChild variant={"marketing"}>
            <Link href={"/dashboard/home"} target="_blank">
              Get Started
            </Link>
          </Button>{" "}
        </motion.div>

        {/* Floating Phone */}
        <FloatingPhone />

        {/* Floating Card */}
        <FloatingCard />

        {/* Features */}
        <Features />

        {/* How it Works */}
        <HowItWorks />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

export default LandingPage;
