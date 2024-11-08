import { useCurrentRole } from "@/hooks/UseCurrentUser";
import { SchemaTypes } from "@repo/db/client";
import React from "react";
import FormError from "@/components/common/FormError";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: SchemaTypes.UserRole;
}

function RoleGate({ children, allowedRole }: RoleGateProps) {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return <FormError message="You are not allowed!" />;
  }
  return <>{children}</>;
}

export default RoleGate;
