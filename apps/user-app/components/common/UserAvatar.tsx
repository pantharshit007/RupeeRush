"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import { useCurrentUser } from "@/hooks/UseCurrentUser";
import { cn } from "@repo/ui/lib/utils";

function UserAvatar({ className, customName }: { className?: string; customName: string | null }) {
  const [img, setImg] = useState<string>(
    "https://api.dicebear.com/8.x/notionists/svg?seed=jethiya&flip=false"
  );
  const user = useCurrentUser();

  useEffect(() => {
    setImg(
      `https://api.dicebear.com/8.x/notionists/svg?seed=${customName ?? user?.name}&flip=false`
    );
  }, []);
  return (
    <Avatar className={cn("border-2 border-sky-600", className)}>
      <AvatarImage src={user?.image! || img} alt="User Image" className="bg-sky-400" />
      <AvatarFallback>NA</AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
