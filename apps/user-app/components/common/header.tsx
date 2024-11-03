import { font } from "@/utils/fonts";
import { cn } from "@repo/ui/lib/utils";
import React from "react";

interface HeaderProps {
  header: string;
  label: string;
}

function Header({ header, label }: HeaderProps) {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className={cn("text-2xl font-semibold", font.className)}>{header}</h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}

export default Header;
