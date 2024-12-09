import React from "react";
import NavBar from "@/components/NavBar";
import { Provider } from "@/components/Provider";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/utils/apiRoute";

async function Banklayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session?.user?.phoneNumber) {
    redirect(DEFAULT_LOGIN_REDIRECT);
  }

  return (
    <>
      <Provider session={session}>
        <NavBar />
        <div className="w-full h-[calc(100vh-3.5rem)] flex flex-col mx-auto bgBlue">{children}</div>
      </Provider>
    </>
  );
}

export default Banklayout;
