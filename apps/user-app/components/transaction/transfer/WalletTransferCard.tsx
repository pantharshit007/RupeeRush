"use client";
import React, { useTransition } from "react";
import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BeatLoader } from "react-spinners";

import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { FormSchema } from "@repo/schema/txnSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Button } from "@repo/ui/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@repo/ui/components/ui/input-otp";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@repo/ui/components/ui/form";

import { createOnRampTxnAction } from "@/actions/transaction/wallet/onRampTransaction";
import { useCurrentUser } from "@/hooks/UseCurrentUser";
import { SUPPORTED_BANKS } from "@/utils/constant";
import FormError from "@/components/common/FormError";
import DialogWrapper from "@/components/common/DialogWrapper";
import PaymentWrapper from "@/components/transaction/PaymentWrapper";
import { SchemaTypes } from "@repo/db/client";
import { useBalanceState } from "@repo/store/balance";
import { toast } from "sonner";

function WalletTransferCard({ type }: { type: "deposit" | "withdraw" }) {
  const [isPending, startTransition] = useTransition();
  const [provider, setProvider] = useState<SchemaTypes.Bank>("HDFC");
  const [amount, setAmount] = useState<number | "">("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [_, setBalance] = useBalanceState();

  const user = useCurrentUser();

  // updating the redirectUrl and provider based on bank
  function bankSelection(value: string) {
    const selectedBank = SUPPORTED_BANKS.find((x) => x.name === value);
    setProvider(selectedBank?.name as SchemaTypes.Bank);
  }

  function handleSubmit() {
    if (amount && provider) {
      setIsDialogOpen(true);
    }
  }

  function submitTransaction(values: z.infer<typeof FormSchema>) {
    setLoading(true);
    setError("");

    startTransition(async () => {
      try {
        if (values.pin && amount && provider && user?.id) {
          const data = await createOnRampTxnAction({
            provider,
            amount,
            userId: user.id,
            pin: values.pin,
            type,
          });

          if (data.error) {
            setError(data.error);
            form.reset();
            return;
          }

          if (data.success) {
            setAmount("");
            setBalance(data.res);
            setIsDialogOpen(false);
            toast.success("Transaction Success!");
            form.reset();
          }
        }
      } catch (err: any) {
        setError(err.message);
        form.reset();
      } finally {
        setLoading(false);
      }
    });
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  return (
    <PaymentWrapper title={type === "deposit" ? "Deposit Money" : "Withdraw Money"}>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          placeholder="Enter amount"
          min={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bank">Bank</Label>
        <Select onValueChange={bankSelection} defaultValue={provider}>
          <SelectTrigger id="bank">
            <SelectValue placeholder="Select a bank" />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_BANKS.map((bank) => (
              <SelectItem key={bank.name} value={bank.name}>
                {bank.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleSubmit} className="w-full text-white">
        {type === "deposit" ? "Add Money" : "Withdraw Money"}
      </Button>

      <DialogWrapper
        title="Enter PIN"
        description="Please enter your 6-digit PIN to confirm the transaction."
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitTransaction)} className="w-full space-y-6">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem className="w-fullgrid place-items-center">
                  <FormControl>
                    <InputOTP maxLength={6} {...field} inputMode="numeric">
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col items-center w-full justify-center gap-y-2">
              {!loading && <FormError message={error || ""} />}
              {loading && <BeatLoader color={"#1BA4FF"} />}
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <Button type="submit" variant={"azure"} disabled={isPending}>
                Confirm
              </Button>
            </div>
          </form>
        </Form>
      </DialogWrapper>
    </PaymentWrapper>
  );
}

export default WalletTransferCard;
