"use client";

import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import { useCurrentUser } from "@/hooks/UseCurrentUser";
import LogoutButton from "../auth/LogoutButton";
import { LuLogOut } from "react-icons/lu";

function UserDropdown() {
  const [img, setImg] = useState<string>(
    "https://api.dicebear.com/8.x/notionists/svg?seed=jethiya&flip=false"
  );
  const user = useCurrentUser();

  useEffect(() => {
    setImg(`https://api.dicebear.com/8.x/notionists/svg?seed=${user?.name}&flip=false`);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="border-2 border-sky-600">
          <AvatarImage src={user?.image! || img} alt="User Image" className="bg-sky-400" />
          <AvatarFallback>NA</AvatarFallback>
        </Avatar>
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
