"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

import LogoutButton from "@/components/auth/LogoutButton";
import { LuLogOut } from "react-icons/lu";
import UserAvatar from "@/components/common/UserAvatar";

function UserDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <UserAvatar />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-20" align="end">
        <LogoutButton>
          <DropdownMenuItem>
            <LuLogOut />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
