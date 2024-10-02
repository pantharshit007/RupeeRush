import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <>
      <div className="text-3xl text-red-400">
        hi{" "}
        {JSON.stringify(
          session?.data?.user?.name || session?.data?.user?.email
        )}
      </div>
    </>
  );
}
