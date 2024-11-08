"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@repo/ui/components/ui/card";
import { RiAdminFill } from "react-icons/ri";
import RoleGate from "@/components/auth/RoleGate";
import FormSuccess from "@/components/common/FormSuccess";

function AdminPage() {
  return (
    <Card className="w-[600px] shadow-md">
      <CardHeader>
        <p className="flex w-full justify-center items-center text-2xl font-semibold gap-x-2">
          <RiAdminFill size="30" className="text-blue-500" /> Admin
        </p>
      </CardHeader>

      <CardContent>
        <RoleGate allowedRole={"ADMIN"}>
          <FormSuccess message="You are allowed to see content!" />
        </RoleGate>
      </CardContent>
    </Card>
  );
}

export default AdminPage;
