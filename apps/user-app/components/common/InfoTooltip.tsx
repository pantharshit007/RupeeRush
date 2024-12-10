"use client";

import { Button } from "@repo/ui/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { Info } from "lucide-react";

export function InfoTooltipComponent({ message }: { message: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className="ml-auto" onClick={(e) => e.preventDefault()}>
          <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
            <Info className="h-4 w-4" />
            <span className="sr-only">More information</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="text-white">
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
