"use client";
import React from "react";
import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BeatLoader } from "react-spinners";

import { SUPPORTED_BANKS } from "@/utils/constant";
import { createOnRampTransaction } from "@/actions/transaction/createOnRampTxn";
import { useCurrentUser } from "@/hooks/UseCurrentUser";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { FormSchema } from "@repo/schema/authSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@repo/ui/components/ui/input-otp";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@repo/ui/components/ui/form";

import FormError from "@/components/common/FormError";

function DepositWithdrawCard({ type }: { type: "deposit" | "withdraw" }) {
  const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
  const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name);
  const [amount, setAmount] = useState<number | "">("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const user = useCurrentUser();

  // updating the redirectUrl and provider based on bank
  function bankSelection(value: string) {
    const selectedBank = SUPPORTED_BANKS.find((x) => x.name === value);
    setRedirectUrl(selectedBank?.redirectUrl || "");
    setProvider(selectedBank?.name);
  }
  function handleSubmit() {
    if (amount && provider) {
      setIsDialogOpen(true);
    }
  }

  async function confirmTransaction(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    setError("");

    if (data.pin && amount && provider && user?.id) {
      const res = await createOnRampTransaction(provider, amount, user.id, data.pin);
      if (res.error) {
        console.log("> inside");
        setLoading(false);
        setError(res.error);
        form.reset();
        return;
      }

      if (res.success) {
        setAmount("");
        setLoading(false);
        setIsDialogOpen(false);
        form.reset();
        // window.location.reload();
      }
    }
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>{type === "deposit" ? "Deposit" : "Withdraw"}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
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

        <Button onClick={handleSubmit} className="w-full bg-sky-500 hover:bg-sky-600">
          Add Money
        </Button>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter PIN</DialogTitle>
            <DialogDescription>
              Please enter your 6-digit PIN to confirm the transaction.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(confirmTransaction)} className="w-full space-y-6">
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
                {loading && <BeatLoader />}
              </div>

              <DialogFooter>
                {/* <Button onClick={() => setIsDialogOpen(false)} variant="outline">
                  Cancel
                </Button> */}
                <Button type="submit" variant={"azure"}>
                  Confirm
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default DepositWithdrawCard;
