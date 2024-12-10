"use client";

import React from "react";
import { cn } from "@repo/ui/lib/utils";
import { ExtendedUser } from "@/@types/next-auth";
import { Card, CardContent, CardHeader } from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";

interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
  logo?: JSX.Element;
  className?: string;
}

function UserInfo({ user, label, logo, className }: UserInfoProps) {
  return (
    <div className={cn(className)}>
      <Card className="w-[600px] max-md:w-[400px] max-sm:w-[375px] shadow-md mx-auto overflow-auto">
        <CardHeader>
          <span className="flex w-full justify-center items-center text-2xl font-semibold gap-x-2">
            {logo} {label}
          </span>
        </CardHeader>
        {/* prettier-ignore */}
        <CardContent className="space-y-4">
          {/* ADMIN ONLY */}
          {user?.role === "ADMIN" && (
            <div className="flex-row-between">
              <p className="text-sm font-medium">ID</p>
              <p className="code-block">{user?.id}</p>
            </div>
          )}
          <div className="flex-row-between">
            <p className="text-sm font-medium">Name</p>
            <p className="code-block">{user?.name}</p>
          </div>
          <div className="flex-row-between">
            <p className="text-sm font-medium">Email</p>
            <p className="code-block">{user?.email}</p>
          </div>
          <div className="flex-row-between">
            <p className="text-sm font-medium">Role</p>
            <p className="code-block">{user?.role}</p>
          </div>
      
          {!user?.isOAuth && (
            <div className="flex-row-between">
              <p className="text-sm font-medium">Two Factor Authentication</p>
              <Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"}>
                {user?.isTwoFactorEnabled ? "ON" : "OFF"}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default UserInfo;
