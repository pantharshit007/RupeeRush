"use client";
import React from "react";
import { useState } from "react";

import { Button } from "@repo/ui/button";
import { Select } from "@repo/ui/select";
import { TextInput } from "@repo/ui/textinput";
import { SUPPORTED_BANKS } from "../utils/constant";
import { createOnRampTransaction } from "../app/lib/actions/createOnRampTxn";

function DepositCard() {
  const [redirectUrl, setRedirectUrl] = useState(
    SUPPORTED_BANKS[0]?.redirectUrl
  );
  const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
  const [value, setValue] = useState(0);

  // updating the redirectUrl and provider based on bank
  function bankSelection(value: string) {
    setRedirectUrl(
      SUPPORTED_BANKS.find((x) => x.name === value)?.redirectUrl || ""
    );
    setProvider(SUPPORTED_BANKS.find((x) => x.name === value)?.name || "");
  }

  // Money Deposit in wallet submission
  async function onSubmit() {
    await createOnRampTransaction(provider, value);
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
          <Button onClick={onSubmit}>Add Money</Button>
        </div>
      </div>
    </div>
  );
}

export default DepositCard;
