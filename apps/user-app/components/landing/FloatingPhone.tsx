"use client";

import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { Sparkles, Receipt, Zap } from "lucide-react";

import { HeroCard } from "@/components/landing/HeroCard";

// import Iphone from "public/iphone_png.png";

function FloatingPhone() {
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
    },
  };

  const floatingCards = {
    y: [0, -6, 0],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
    },
  };
  return (
    <div className="wrapper group max-md:hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.75,
          type: "spring",
          damping: 10,
          stiffness: 100,
        }}
        className="relative flex h-[75vh] w-[90%] mx-auto flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-blue-400 to-blue-700 p-8 md:h-[47vh] md:flex-col"
      >
        <motion.div
          animate={floatingAnimation}
          className="absolute flex w-full justify-center z-10 md:top-12"
        >
          <Image
            src="/iphone_png.png"
            alt="Iphone image"
            width={300}
            height={300}
            className="absolute w-[80%] rotate-3 transition-all duration-300 group-hover:-translate-y-4 group-hover:rotate-6   md:w-[30%]"
          />
        </motion.div>

        {/* Floating Cards */}
        <motion.div className="relative w-full h-full max-h-[300px] z-10" animate={floatingCards}>
          {/* Left floating card */}
          <div className="absolute left-4 top-1/4 md:left-16 lg:left-24 xl:left-32 z-10 max-w-[200px]">
            <HeroCard
              title="Cashback On Every Payment"
              icon={<Sparkles className="h-4 w-4" />}
              color="bg-[#82D8FF] dark:text-black"
              className="max-2xl:max-w-[180px]"
            />
          </div>

          {/* Bottom left floating card */}
          <div className="absolute left-8 max-2xl:bottom-2 max-mid:bottom-3 midx:bottom-4 bottom-[20%] md:left-52 lg:left-60 xl:left-48 midx:left-60 z-10 max-w-[200px]">
            <HeroCard
              title="Bills Payment"
              subtitle="Due in 2 days"
              icon={<Receipt className="h-4 w-4" />}
              color="bg-yellow-200 dark:text-black"
              className="max-2xl:max-w-[180px]"
            />
          </div>

          {/* Right floating card */}
          <div className="absolute right-4 top-1/3 md:right-16 lg:right-24 xl:right-24 z-10 max-w-[200px]">
            <HeroCard
              title="Power Pack"
              subtitle="Premium subscription"
              icon={<Zap className="h-4 w-4" />}
              color="bg-pink-200 dark:text-black"
              className="max-2xl:max-w-[180px]"
            />
          </div>
        </motion.div>

        {/* Connecting lines using SVG */}
        <svg
          className="absolute inset-0 w-full h-full z-9 max-lg:hidden"
          style={{ transform: "scale(0.9)" }}
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMid meet"
        >
          <motion.path
            d="M128 16.013C51.3859 -20.9278 20.3261 16.0132 1 64.9998"
            stroke="white"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className={"-translate-x-10 translate-y-0 rotate-12"}
          />
          <motion.path
            d="M1 50.545V64.1971L10.663 58.5757"
            stroke="white"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className={"-translate-x-10 translate-y-0 rotate-12"}
          />

          <motion.path
            d="M110.161 2.03285C113.661 -7.46727 68.1605 53.0327 1.16052 2.03285"
            stroke="white"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.7 }}
            className={"-translate-x-3 translate-y-[88%] rotate-6"}
          />
          <motion.path
            d="M4.16049 14.0327C4.16049 14.0327 0.160494 3.03269 1.16049 2.03269C2.16049 1.03269 14.6605 3.03269 14.6605 3.03269"
            stroke="white"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className={"-translate-x-3 translate-y-[88%] rotate-6"}
          />

          <motion.path
            d="M1 9.50024C31 -23.4998 97 51.5 133.5 9.50024"
            stroke="white"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className={"translate-x-[90%] translate-y-[60%]"}
          />
          <motion.path
            d="M123 10.0782C123 10.0782 134 7.65229 134 10.0782C134 12.5041 134 20.9946 134 18.5687"
            stroke="white"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className={"translate-x-[90%] translate-y-[60%]"}
          />
        </svg>
      </motion.div>
    </div>
  );
}

export default FloatingPhone;
