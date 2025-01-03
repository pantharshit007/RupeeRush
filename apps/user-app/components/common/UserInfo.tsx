import React from "react";

import { cn } from "@repo/ui/lib/utils";
import { Card, CardContent, CardHeader } from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";

import { ExtendedUser } from "@/@types/next-auth";

interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
  logo?: JSX.Element;
  accountNo: string;
  className?: string;
}

async function UserInfo({ user, label, logo, accountNo, className }: UserInfoProps) {
  if (!user) {
    return <div>No user data</div>;
  }
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
              <p className="font-mono text-sm px-2 py-1">{user?.id}</p>
            </div>
          )}
          <div className="flex-row-between">
            <p className="text-sm font-medium">Name</p>
            <p className="font-mono text-sm px-2 py-1">{user?.name}</p>
          </div>
          <div className="flex-row-between">
            <p className="text-sm font-medium">Email</p>
            <p className="font-mono text-sm px-2 py-1">{user?.email}</p>
          </div>
          <div className="flex-row-between">
            <p className="text-sm font-medium">Phone Number</p>
            <p className="font-mono text-sm px-2 py-1">{user?.phoneNumber}</p>
          </div>
          <div className="flex-row-between">
            <p className="text-sm font-medium">UPI ID</p>
            <p className="font-mono text-sm px-2 py-1">{user?.upiId}</p>
          </div>
          <div className="flex-row-between">
            <p className="text-sm font-medium">BANK</p>
            <p className="font-mono text-sm px-2 py-1 uppercase">{user?.upiId?.split("@")[1]?.split("bank")[0] || "N/A"}</p>
          </div>
          <div className="flex-row-between">
            <p className="text-sm font-medium">Account Number</p>
            <p className="font-mono text-sm px-2 py-1 uppercase">{accountNo || "N/A"}</p>
          </div>
          <div className="flex-row-between">
            <p className="text-sm font-medium">Role</p>
            <p className="font-mono text-sm px-2 py-1">{user?.role}</p>
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
