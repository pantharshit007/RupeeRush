"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

export function LandingToast() {
  const pathname = usePathname();

  useEffect(() => {
    // Only show on home route
    if (pathname !== "/") return;

    // Small timeout to ensure it runs after hydration
    const timeoutId = setTimeout(() => {
      toast.info("Make sure indicator turns green", {
        description:
          "Backend service will take few seconds to start running from cold start, wait for the indicator to turn green!",
        position: "top-center",
        duration: 5000,
        style: {
          fontSize: "0.9rem",
        },
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);
}
