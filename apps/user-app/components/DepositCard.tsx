"use client";
import React from "react";
import { useState } from "react";

import ButtonPrimary from "@repo/ui/components/custom/ButtonPrimary";
import Select from "@repo/ui/components/custom/Select";
import TextInput from "@repo/ui/components/custom/TextInput";
import { SUPPORTED_BANKS } from "../utils/constant";
import { createOnRampTransaction } from "@/actions/transaction/createOnRampTxn";
import { useCurrentUser } from "@/hooks/UseCurrentUser";

function DepositCard() {
  const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
  const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name);
  const [value, setValue] = useState(0);
  const user = useCurrentUser();

  // updating the redirectUrl and provider based on bank
  function bankSelection(value: string) {
    setRedirectUrl(SUPPORTED_BANKS.find((x) => x.name === value)?.redirectUrl || "");
    setProvider(SUPPORTED_BANKS.find((x) => x.name === value)?.name);
  }

  // Money Deposit in wallet submission
  async function onSubmit() {
    await createOnRampTransaction(provider!, value, user?.id!);
    setValue(0);
    window.location.href = redirectUrl || "";
  }

  return (
    <div className="max-md:w-full px-3 py-2 rounded-2xl bg-slate-200">
      <p className=" text-2xl font-semibold">Deposit</p>
      <div className="">
        <TextInput
          label={"Amount"}
          placeholder={"Amount"}
          value={value || 0}
          type="number"
          onChange={(val) => setValue(Number(val))}
        />

        <div className="py-4 text-left">Bank</div>

        <Select
          onSelect={(value) => bankSelection(value)}
          options={SUPPORTED_BANKS.map((x) => ({
            key: x.name,
            value: x.name,
          }))}
        />

        <div className="pt-4">
          <ButtonPrimary onClick={onSubmit}>Add Money</ButtonPrimary>
        </div>
      </div>
    </div>
  );
}

export default DepositCard;
