import Title from "@repo/ui/components/title";
import React from "react";
import P2P from "@/components/P2P";

function page() {
  return (
    <div className="w-full">
      <Title title={"Peer to Peer"} />
      <P2P />
    </div>
  );
}

export default page;
