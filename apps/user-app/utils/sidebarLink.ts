import { Home, Users, UserCircle, Shield, Settings } from "lucide-react";
import { WalletIcon, TransferIcon, B2BTransferIcon } from "@/components/transaction/Icons";
import { SchemaTypes } from "@repo/db/client";

export const mainNavItems = [
  { title: "Home", icon: Home, href: "/dashboard/home" },
  { title: "Wallet Transfer", icon: WalletIcon, href: "/dashboard/wallet-transfer" },
  { title: "P2P Transfer", icon: Users, href: "/dashboard/p2p-transfer" },
  { title: "B2B Transfer", icon: B2BTransferIcon, href: "/dashboard/b2b-transfer" },
  { title: "Transactions", icon: TransferIcon, href: "/dashboard/transactions" },
];

export const profileNavItems = [
  {
    title: "Profile",
    icon: UserCircle,
    href: "/account/profile",
    allowedUserRoles: ["USER"] as SchemaTypes.UserRole[],
  },

  {
    title: "Admin",
    icon: Shield,
    href: "/account/admin",
    allowedUserRoles: ["ADMIN"] as SchemaTypes.UserRole[],
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/account/settings",
    allowedUserRoles: ["USER"] as SchemaTypes.UserRole[],
  },
  {
    title: "Security",
    icon: Shield,
    href: "/account/security",
    allowedUserRoles: ["USER"] as SchemaTypes.UserRole[],
  },
];
