import { auth } from "@/lib/auth";
import React from "react";

async function page() {
  const session = await auth();
  return <div>settings page: {JSON.stringify(session?.user)}</div>;
}

export default page;
