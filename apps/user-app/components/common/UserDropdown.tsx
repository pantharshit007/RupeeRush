"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

import LogoutButton from "@/components/auth/LogoutButton";
import UserAvatar from "@/components/common/UserAvatar";
import { LogOutIcon, Settings, UserCircle } from "lucide-react";

function UserDropdown() {
  const router = useRouter();

  const handleSettings = () => {
    router.push("/account/settings");
  };

  const handleProfile = () => {
    router.push("/account/profile");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <UserAvatar />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-16" align="end">
        <DropdownMenuItem onClick={handleProfile}>
          <UserCircle /> Profile
          <span className="sr-only">Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleSettings}>
          <Settings /> Settings
          <span className="sr-only">Settings</span>
        </DropdownMenuItem>

        <LogoutButton>
          <DropdownMenuItem>
            <LogOutIcon className="h-4 w-4" /> Logout
            <span className="sr-only">Logout</span>
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
