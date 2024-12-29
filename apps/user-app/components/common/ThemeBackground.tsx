"use client";

import { cn } from "@repo/ui/lib/utils";
import { useTheme } from "next-themes";

// theme component for background: using light mode from useTheme
export default function ThemeBackground({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <div className={cn("flex w-full", theme === "light" ? "bg-[#f7f7fa]" : "bg-gray-900")}>
      {children}
    </div>
  );
}

// theme component for navbar: using dark mode from tailwind
export function ThemeBackgroundNavbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center border-b border-slate-300 dark:border-slate-700 px-4 py-3 h-[3.5rem] bg-[#f7f7fa] dark:bg-gray-900">
      {children}
    </div>
  );
}
