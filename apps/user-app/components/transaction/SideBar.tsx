import SideBarItem from "../SideBarItem";
import { HomeIcon, P2PIcon, TransactionsIcon, TransferIcon } from "./Icons";

export default function Sidebar() {
  const size = "w-8 h-8";
  return (
    <div className="w-64 border-r border-slate-300 dark:border-slate-700 h-full pt-28 hidden md:block">
      <SideBarItem link="/dashboard/home" icon={<HomeIcon size={size} />} title="Home" />
      <SideBarItem
        link="/dashboard/transfer"
        icon={<TransferIcon size={size} />}
        title="Transfer"
      />
      <SideBarItem link="/dashboard/p2p" icon={<P2PIcon size={size} />} title="P2P Transfer" />
      <SideBarItem
        link="/dashboard/transactions"
        icon={<TransactionsIcon size={size} />}
        title="Transactions"
      />
    </div>
  );
}
