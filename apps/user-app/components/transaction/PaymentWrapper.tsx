import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";

function PaymentWrapper({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

export default PaymentWrapper;
