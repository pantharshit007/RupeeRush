import React from "react";
import { font } from "@/utils/fonts";
import NavBar from "@/components/NavBar";
import LandingPage from "@/components/landing/LandingPage";

export default async function Home() {
  return (
    <>
      <NavBar />
      <div className="">
        {/* <h1 className={cn("text-6xl font-semibold text-white drop-shadow-md", font.className)}>
            hi {JSON.stringify(session?.user?.name)} 👋
          </h1> */}

        <main>
          <LandingPage />
        </main>
      </div>
    </>
  );
}
