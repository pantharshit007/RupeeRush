"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ArrowLeftToLine, ChevronsUpDown, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@repo/ui/components/ui/sidebar";
import { Button } from "@repo/ui/components/ui/button";
import UserAvatar from "@/components/common/UserAvatar";
import { useCurrentUser } from "@/hooks/UseCurrentUser";
import { mainNavItems, profileNavItems } from "@/utils/sidebarLink";
import LogoutButton from "@/components/auth/LogoutButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

export default function AppSidebar() {
  const { open, toggleSidebar, isMobile } = useSidebar();
  const path = usePathname();
  const user = useCurrentUser();

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader>
        <div className="p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className={`${open ? "" : "rotate-180"} transition-transform ease-linear -ml-3`}
            onClick={toggleSidebar}
          >
            <ArrowLeftToLine size="1.5rem" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          {open && (
            <h2 className="text-2xl flex  justify-center text-azureBlue-500 font-bold italic">
              Rupee₹ush
            </h2>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* DASHBOARD */}
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={path === item.href}>
                    <a href={item.href} className="flex items-center">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ACCOUNT */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {profileNavItems.map((item) => {
                // Show the item only if the user's role matches the allowedUserRoles
                if (item.allowedUserRoles.includes("ADMIN") && user?.role !== "ADMIN") {
                  return null;
                }
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={path === item.href}>
                      <a href={item.href} className="flex items-center">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <UserAvatar className="h-8 w-8 rounded-lg border-none" />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <LogOut />
                  <LogoutButton>Log out</LogoutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
