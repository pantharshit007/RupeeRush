"use client";
import { Card, CardFooter, CardHeader, CardContent } from "@repo/ui/components/ui/card";
import React from "react";
import Header from "@components/common/header";
import Provider from "@components/auth/Provider";
import BackButton from "@components/common/BackButton";

interface CardWrapperProps {
  children: React.ReactNode;
  header: string;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

function CardWrapper({
  children,
  header,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header header={header} label={headerLabel} />
      </CardHeader>

      {/* content */}
      <CardContent>{children}</CardContent>

      {showSocial && <CardFooter></CardFooter>}

      {/* Auth providers */}
      <CardFooter>
        <Provider />
      </CardFooter>

      {/* Back to page link */}
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
}

export default CardWrapper;
