import React from "react";
import NavBar from "@/components/NavBar";
import LandingPage from "@/components/landing/LandingPage";

export default async function Home() {
  return (
    <>
      <NavBar />
      <div className="">
        <main>
          <LandingPage />
        </main>
      </div>
    </>
  );
}
