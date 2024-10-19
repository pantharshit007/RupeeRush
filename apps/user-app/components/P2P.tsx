"use client";
import { Button } from "@repo/ui/components/button";
import { TextInput } from "@repo/ui/components/textinput";
import React, { useState, useEffect } from "react";
import { p2pTransfer } from "@/actions/p2pTransfer";
import TransactionHistory from "./TxnHistoryCard";
import { useSession } from "next-auth/react";
import { getP2PTransactions } from "@/actions/getP2PTransactions";

function P2P() {
  const [receiverId, setReceiverId] = useState("yourname@sbi");
  const [amount, setAmount] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const { data: session } = useSession();

  // Fetch user's P2P transactions
  useEffect(() => {
    if (session) {
      const fetchTransactions = async () => {
        //@ts-ignore
        const txn = await getP2PTransactions(session?.user?.id);
        setTransactions(txn);
      };
      fetchTransactions();
    }
  }, [session]);

  async function onSubmit() {
    if (!receiverId || !amount) {
      alert("Please provide valid receiver ID and amount.");
      return;
    }

    try {
      await p2pTransfer({ receiverId, amount: amount * 100 });
      setReceiverId("");
      setAmount(0);

      // Fetch updated transactions after successful transfer
      // @ts-ignore
      const txn = await getP2PTransactions(session?.user?.id);
      setTransactions(txn);
    } catch (error) {
      console.error("Error during P2P transfer:", error);
      return;
    }
  }

  return (
    <div className="w-[calc(100%-32px)] mx-1 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* form */}
      <div className="max-md:w-full px-3 py-2 rounded-2xl bg-slate-200">
        <p className=" text-2xl font-semibold">P2P Transfer</p>

        <div>
          <TextInput
            label="UPI or Number"
            placeholder="Enter your UPI or number"
            value={receiverId}
            onChange={(val) => setReceiverId(val)}
          />
          <TextInput
            label="Amount"
            placeholder="₹ 500"
            value={amount}
            type="number"
            onChange={(val) => setAmount(Number(val))}
          />
        </div>

        <div className="pt-4">
          <Button onClick={onSubmit}>Send</Button>
        </div>
      </div>

      {/* Transaction history */}
      <div>
        <TransactionHistory transactions={transactions} />
      </div>
    </div>
  );
}

export default P2P;
