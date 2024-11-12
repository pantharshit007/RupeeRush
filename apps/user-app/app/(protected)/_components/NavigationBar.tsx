"use client";

import React from "react";
import { usePathname } from "next/navigation";

import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";
import UserDropdown from "@/components/common/UserDropdown";

function NavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm">
      <div className="flex gap-x-2">
        <Button asChild variant={pathname === "/profile" ? "default" : "outline"}>
          <Link href="/profile">Profile</Link>
        </Button>
        <Button asChild variant={pathname === "/admin" ? "default" : "outline"}>
          <Link href="/admin">Admin</Link>
        </Button>
        <Button asChild variant={pathname === "/settings" ? "default" : "outline"}>
          <Link href="/settings">Settings</Link>
        </Button>
      </div>

      <UserDropdown />
    </nav>
  );
}

export default NavigationBar;
