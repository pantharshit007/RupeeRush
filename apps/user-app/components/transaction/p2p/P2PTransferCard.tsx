"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";

import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@repo/ui/components/ui/form";
import { useSetP2PTxn } from "@repo/store/p2pTransaction";
import { useSetBalance } from "@repo/store/balance";
import { useSetTrigger } from "@repo/store/trigger";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@repo/ui/components/ui/input-otp";

import { useCurrentUser } from "@/hooks/UseCurrentUser";
import { FormSchema, P2PFormSchema } from "@repo/schema/txnSchema";
import FormError from "@/components/common/FormError";
import DialogWrapper from "@/components/common/DialogWrapper";
import PaymentWrapper from "@/components/transaction/PaymentWrapper";
import { createP2PTxnAction } from "@/actions/transaction/P2P/p2p";

function P2PTransferCard({ type }: { type: "phone" | "upi" }) {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [payDetail, setPayDetail] = useState<any>({ recipient: "", amount: 0 });

  const user = useCurrentUser();
  const setBalance = useSetBalance();
  const setp2pTxnUpdated = useSetP2PTxn();
  const trigger = useSetTrigger();

  const paymentForm = useForm<z.infer<typeof P2PFormSchema>>({
    resolver: zodResolver(P2PFormSchema),
    defaultValues: {
      recipient: "",
      amount: 0,
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  function onSubmit(values: z.infer<typeof P2PFormSchema>) {
    if (!values.amount || !values.recipient) {
      toast.error("Please fill all fields.");
      return;
    }
    setPayDetail(values);
    setIsDialogOpen(true);
  }

  // fetch user's userAgent and ipAddress
  async function getUserAgentAndIP() {
    const userAgent = navigator.userAgent;

    const response = await fetch("https://api.ipify.org/");
    const userIp = await response.text();

    return { userAgent, userIp };
  }

  function submitTransaction(values: z.infer<typeof FormSchema>) {
    setLoading(true);
    setError("");
    let value: { [key: string]: any } = {};
    startTransition(async () => {
      value = { ...payDetail, ...values };

      try {
        if (user?.id) {
          const { userAgent, userIp } = await getUserAgentAndIP();

          const data = await createP2PTxnAction({
            receiverIdentifier: value.recipient,
            amount: value.amount * 100,
            userId: user.id,
            pin: value.pin,
            transferMethod: type === "phone" ? "PHONE" : "UPI",
            userAgent,
            ipAddress: userIp,
          });

          if (data.error) {
            setp2pTxnUpdated({ timestamp: Date.now() });
            setError(data.error);
            toast.error(data.error);
            return;
          }

          if (data.success) {
            trigger(new Date().getTime());
            setBalance((prevState) => ({ ...prevState, walletBalance: data?.res?.balance }));
            toast.success("Transaction Success!");
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsDialogOpen(false);
        form.reset();
        paymentForm.reset();
        setLoading(false);
        setError("");
      }
    });
  }

  return (
    <PaymentWrapper title={`Send Money via ${type === "phone" ? "Phone Number" : "UPI ID"}`}>
      <Form {...paymentForm}>
        <form onSubmit={paymentForm.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={paymentForm.control}
            name="recipient"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="recipient">{type === "phone" ? "Phone Number" : "UPI ID"}</Label>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={`Enter ${type === "phone" ? "phone number" : "UPI ID"}`}
                    type={type === "phone" ? "tel" : "text"}
                    autoComplete={type === "phone" ? "tel" : "off"}
                    minLength={type === "phone" ? 10 : undefined}
                    maxLength={type === "phone" ? 12 : undefined}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={paymentForm.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="amount">Amount</Label>
                <FormControl>
                  <Input
                    {...field}
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    min={1}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full text-white">
            Send Money
          </Button>
        </form>
      </Form>

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
                <FormItem className="w-full grid place-items-center">
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

export default P2PTransferCard;
