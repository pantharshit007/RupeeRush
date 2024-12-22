import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import * as z from "zod";

import { PaymentViaCardSchema } from "@repo/schema/txnSchema";
import { Button } from "@repo/ui/components/ui/button";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";

import { PaymentInfo } from "@/page/Hdfc";
import { LoadingSpinner, SuccessState } from "@/components/LoadingSpinner";
import { apiRequest } from "@/utils/api";
import Error from "@/components/Error";
import RR_Bank from "@/assets/RR_Bank.jpg";
import { Link } from "react-router-dom";
import { env } from "@/utils/env";

export default function PaymentPage({
  txnId,
  nonce,
  amount,
  senderEmail,
  receiverAccountNumber,
  recieverName,
}: PaymentInfo) {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof PaymentViaCardSchema>>({
    resolver: zodResolver(PaymentViaCardSchema),
    defaultValues: {
      cardNumber: "",
      expiry: "",
      cvv: "",
      cardholderName: "",
      country: "",
      pin: "",
      saveInfo: false,
    },
  });

  async function onSubmit(values: z.infer<typeof PaymentViaCardSchema>) {
    setLoading(true);
    const payload = { ...values, txnId: txnId, nonce: nonce };

    try {
      const res = await apiRequest(`${env.BANK_API_URL}/api/v1/processPayment`, "POST", payload);
      if (!res || !res.success) {
        setLoading(false);
        setError(res.message);
      }

      if (res.success) {
        setLoading(false);
        setSuccess(true);
      }

      return;
      // eslint-disable-next-line
    } catch (err: any) {
      console.error("> Error on payment: " + err?.message);
      setError(err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  function formatExpiryDate(value: string) {
    const cleanVal = value.replace(/[^\d]/g, "");
    return cleanVal.length > 2 ? cleanVal.slice(0, 2) + "/" + cleanVal.slice(2) : cleanVal;
  }

  const restrictToNumbers = (value: string) => value.replace(/[^\d]/g, "");

  if (loading) {
    return <LoadingSpinner />;
  }

  if (success) {
    return <SuccessState />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Dark */}
      <div className="w-full md:w-1/2 bg-[#0A0B1E] p-4 md:p-8 text-white">
        <div className="max-w-md mx-auto">
          <Link
            to={"/"}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <img
              src={RR_Bank}
              alt="Bank Logo"
              width={48}
              height={48}
              className=" border-2 border-azureBlue-200  rounded-full"
            />
          </Link>

          <h1 className="text-xl md:text-2xl font-medium mb-4">
            Send Money to {capitalize(recieverName)}
          </h1>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-3xl md:text-4xl font-bold">₹ {amount / 100}.00</span>
            <span className="text-gray-400">INR</span>
          </div>

          <div className="text-sm text-gray-400 mb-8">
            You're sending money to {capitalize(recieverName)} ({receiverAccountNumber}). Please
            review the details below before confirming the transfer.
          </div>

          <div className="space-y-4 border-t border-gray-800 pt-4 max-md:hidden">
            <div className="flex justify-between">
              <span>Transfer amount</span>
              <span>₹ {amount / 100}.00</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Transfer fee</span>
              <span>$5.00</span>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-800 font-medium">
              <span>Total amount</span>
              <span>₹ {amount / 100 + 5}.00</span>
            </div>

            <Button
              variant="secondary"
              className="w-full bg-[#1A1B2E] text-white hover:bg-[#2A2B3E]"
            >
              Add a note
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side - Light */}
      <div className="w-full md:w-1/2 bg-white p-4 md:p-8">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl md:text-2xl font-medium mb-8">Pay with card</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <div className="flex items-center h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground  bg-gray-50">
                  {senderEmail}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Card information</label>
                <div className="mt-1 space-y-2">
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type="text"
                              placeholder="1234 1234 1234 1234"
                              maxLength={16}
                              inputMode="numeric"
                              autoComplete="cc-number"
                              pattern="[0-9]{16}"
                              className="bg-gray-50 font-mono"
                              disabled={loading}
                              onChange={(e) => {
                                const numbersOnly = restrictToNumbers(e.target.value);
                                field.onChange(numbersOnly);
                              }}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                              <img
                                src="https://logos-world.net/wp-content/uploads/2020/11/American-Express-Logo.png"
                                alt="Visa"
                                width={32}
                                height={20}
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="expiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="MM / YY"
                              className="bg-gray-50"
                              type="text"
                              inputMode="numeric"
                              autoComplete="cc-exp"
                              maxLength={5}
                              disabled={loading}
                              onChange={(e) => {
                                const formatted = formatExpiryDate(e.target.value);
                                field.onChange(formatted);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="CVV"
                              className="bg-gray-50"
                              type="text"
                              inputMode="numeric"
                              autoComplete="cc-csc"
                              maxLength={3}
                              disabled={loading}
                              onChange={(e) => {
                                const numbersOnly = restrictToNumbers(e.target.value);
                                field.onChange(numbersOnly);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="cardholderName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-1">
                        <label className="text-sm text-gray-600">Cardholder name</label>
                        <Input
                          {...field}
                          placeholder="Full name on card"
                          className="bg-gray-50"
                          autoComplete="cc-name"
                          disabled={loading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Country or region</label>
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-50">
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="in">India</SelectItem>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-1">
                          <label className="text-sm text-gray-600">Card Pin</label>
                          <Input
                            {...field}
                            placeholder="PIN"
                            className="bg-gray-50"
                            type="password"
                            inputMode="numeric"
                            autoComplete="new-password webauthn"
                            maxLength={6}
                            disabled={loading}
                            onChange={(e) => {
                              const numbersOnly = restrictToNumbers(e.target.value);
                              field.onChange(numbersOnly);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="saveInfo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <label className="text-sm font-medium">
                        Securely save my information for 1-click checkout
                      </label>
                      <p className="text-sm text-gray-500">
                        Pay faster on RupeeRush and everywhere Link is accepted.
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <Error message={error || ""} />

              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800"
                disabled={loading}
              >
                {loading ? "Processing..." : `Send ${amount / 100} INR`}
              </Button>

              <p className="text-center text-sm text-gray-500">
                By confirming this transfer, you agree to our terms of service and privacy policy.
                This transaction may be subject to additional fees from your bank.
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

function capitalize(name: string) {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
