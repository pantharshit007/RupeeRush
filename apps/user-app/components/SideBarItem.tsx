"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface SideBar {
  link: string;
  icon: React.ReactNode;
  title: string;
}

function SideBarItem({ link, icon, title }: SideBar): React.ReactNode {
  const router = useRouter();
  const path = usePathname();
  const currentUrl = path === link;
  return (
    <div
      onClick={() => router.push(link)}
      className={`flex items-center ${currentUrl ? "text-azureBlue-600 " : "text-slate-500"} cursor-pointer p-2 pl-8 hover:text-slate-600`}
    >
      <div className="pr-2 ">{icon}</div>
      <div className="font-bold text-xl pl-1">{title}</div>
    </div>
  );
}

export default SideBarItem;
