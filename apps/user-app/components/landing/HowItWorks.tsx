"use client";

import { Button } from "@repo/ui/components/ui/button";
import { motion } from "motion/react";
import Link from "next/link";

const steps = [
  {
    title: "Create Your Account",
    description:
      "Sign up with your phone number and email. Complete KYC verification for instant account activation.",
  },
  {
    title: "Link Bank Account & Wallet",
    description:
      "Connect your bank account securely and set up your digital wallet for seamless transactions.",
  },
  {
    title: "Wallet Transfers",
    description:
      "Transfer money between your bank and wallet instantly using UPI ID or phone number.",
  },
  {
    title: "P2P Transfers",
    description: "Send money to friends and family instantly using their phone number or UPI ID.",
  },
  {
    title: "B2B Transfers",
    description:
      "Make secure business payments using bank credentials with detailed transaction tracking.",
  },
];

export default function HowItWorks() {
  return (
    <section id="#how-it-works" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            How RupeeRush Works
          </motion.h2>
          <motion.p
            className="font-normal tracking-tight text-landing/60 md:text-xl  text-lg max-w-2xl mx-auto"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Get started with RupeeRush in just a few simple steps. Experience the future of digital
            banking today.
          </motion.p>
        </div>

        <div className="relative">
          <div className="absolute left-0 md:left-1/2 top-0 h-[86%] w-1 bg-azureBlue-500 transform -translate-x-1/2 hidden md:block"></div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`relative flex flex-col md:flex-row items-center gap-8 group ${index % 2 === 0 ? "" : "md:flex-row-reverse"}`}
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div
                  className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:text-right md:pr-1" : "md:text-left md:pl-1"}`}
                >
                  <div className="bg-landing-foreground p-6 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-azureBlue-400 dark:hover:border-azureBlue-400 transition-all duration-300 hover:shadow-lg">
                    <h3 className="text-xl font-bold mb-3 text-landing">{step.title}</h3>
                    <p className="text-landing/60">{step.description}</p>
                  </div>
                </div>
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center w-12 h-12 rounded-full bg-azureBlue-500 text-white font-bold border-4 border-white group-hover:scale-110 transition-transform duration-300">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-16 text-center"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 1 }}
            viewport={{ once: true }}
          >
            <Button size={"lg"} asChild variant={"marketing"} className="rounded-full">
              <Link href={"/dashboard/home"} target="_blank">
                Get Started
              </Link>
            </Button>
            <p className="mt-4 text-landing/60">No credit card required • Set up in minutes</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
