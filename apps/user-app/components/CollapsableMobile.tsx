"use client";
import { SidebarTrigger, useSidebar } from "@repo/ui/components/ui/sidebar";

function CollapsableMobile() {
  const { isMobile } = useSidebar();
  return (
    <>
      {isMobile && (
        <header className="flex h-14 w-14 -mb-5 items-center px-6 bg-red-70">
          <SidebarTrigger className="p-1 " />
        </header>
      )}
    </>
  );
}

export default CollapsableMobile;
