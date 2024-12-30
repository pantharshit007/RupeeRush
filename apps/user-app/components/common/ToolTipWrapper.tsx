"use client";

import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";

function ToolTipWrapper({ children, message }: { children: React.ReactNode; message: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className="ml-auto" onClick={(e) => e.preventDefault()}>
          {children}
        </TooltipTrigger>
        <TooltipContent className="text-white">
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ToolTipWrapper;
