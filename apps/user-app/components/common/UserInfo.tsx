import React from "react";
import { ExtendedUser } from "@/@types/next-auth";
import { Card, CardContent, CardHeader } from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { IconType } from "react-icons/lib";

interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
  logo?: JSX.Element;
}

function UserInfo({ user, label, logo }: UserInfoProps) {
  return (
    <Card className="w-[600px] shadow-md">
      <CardHeader>
        <span className="flex w-full justify-center items-center text-2xl font-semibold gap-x-2">
          {logo} {label}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ADMIN ONLY */}
        {user?.role === "USER" && (
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

        <div className="flex-row-between">
          <p className="text-sm font-medium">Two Factor Authentication</p>
          <Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"}>
            {user?.isTwoFactorEnabled ? "ON" : "OFF"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default UserInfo;
