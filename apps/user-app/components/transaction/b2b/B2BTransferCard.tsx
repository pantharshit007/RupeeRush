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
import { useSetB2BTxn } from "@repo/store/b2bTransaction";
import { useSetTrigger } from "@repo/store/trigger";

import { useCurrentUser } from "@/hooks/UseCurrentUser";
import { B2BFormSchema } from "@repo/schema/txnSchema";
import FormError from "@/components/common/FormError";
import PaymentWrapper from "@/components/transaction/PaymentWrapper";
import { createB2BTxnAction } from "@/actions/transaction/B2B/b2b";

const PAGE = process.env.NEXT_PUBLIC_BANK_PAGE_URL;

function B2BTransferCard() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const user = useCurrentUser();
  const setB2bTxnUpdated = useSetB2BTxn();
  const trigger = useSetTrigger();

  const form = useForm<z.infer<typeof B2BFormSchema>>({
    resolver: zodResolver(B2BFormSchema),
    defaultValues: {
      receiverAccountNumber: "",
      amount: 0,
    },
  });

  function onSubmit(values: z.infer<typeof B2BFormSchema>) {
    setLoading(true);
    setError("");
    startTransition(async () => {
      try {
        if (user?.id) {
          // Preemptively open the window (popup blocker workaround)
          let popupWindow: Window | null = null;

          const preemptiveLink = "about:blank"; // Temporary blank page
          popupWindow = window.open(preemptiveLink, "target", "height=600px,width=900px");

          const data = await createB2BTxnAction({
            receiverAccountNumber: values.receiverAccountNumber,
            amount: values.amount * 100,
            senderId: user.id,
          });

          if (data.error) {
            setB2bTxnUpdated({ timestamp: Date.now() });
            setError(data.error);
            toast.error(data.error);

            // Close the popup if an error occurs
            if (popupWindow) {
              popupWindow.close();
            }
            return;
          }

          if (data.success) {
            trigger(new Date().getTime());
            toast.success("Transaction Registered! Pay on Bank Site");

            if (data.paymentToken && popupWindow) {
              // Redirect the preemptive popup to the external link
              popupWindow.location.href = `${PAGE}${data.paymentToken}`;
            } else if (data.paymentToken) {
              // Fallback if popup failed
              window.alert(`${PAGE}${data.paymentToken}`);
              window.open(`${PAGE}${data.paymentToken}`, "target", "height=600px,width=900px");
            }
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        form.reset();
        setLoading(false);
        setError("");
      }
    });
  }

  return (
    <PaymentWrapper title="Send Money to Business" className="h-fit">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="receiverAccountNumber"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="receiverAccountNumber">Receiver Account Number</Label>
                <FormControl>
                  <Input {...field} placeholder="Enter receiver's account number" type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
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

          <div className="flex flex-col items-center w-full justify-center gap-y-2">
            {!loading && <FormError message={error || ""} />}
            {loading && <BeatLoader color={"#1BA4FF"} />}
          </div>

          <Button type="submit" className="w-full text-white" disabled={isPending}>
            Send Money
          </Button>
        </form>
      </Form>
    </PaymentWrapper>
  );
}

export default B2BTransferCard;
