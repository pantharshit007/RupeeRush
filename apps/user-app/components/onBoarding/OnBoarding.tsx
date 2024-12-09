"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Phone, Lock, ArrowRight } from "lucide-react";

import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { onBoardingSchema } from "@repo/schema/txnSchema";

import CardWrapper from "@/components/common/CardWrapper";
import FormError from "@/components/common/FormError";
import { useCurrentUser } from "@/hooks/UseCurrentUser";
import { CreditCard, onBoardingAction } from "@/actions/onBoarding";
import { useSession } from "next-auth/react";
import LoadingState from "../common/LoadingState";

export default function OnboardingPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { data: session, update } = useSession();
  const user = session?.user;

  const onBoardingForm = useForm<z.infer<typeof onBoardingSchema>>({
    resolver: zodResolver(onBoardingSchema),
    defaultValues: {
      phoneNumber: "",
      pin: "",
      confirmPin: "",
    },
  });

  const onSubmit = (values: z.infer<typeof onBoardingSchema>) => {
    setError(null);
    setLoading(false);

    // Validate PIN match before proceeding
    if (values.pin !== values.confirmPin) {
      setError("PINs do not match");
      return;
    }

    // Proceed with form submission
    startTransition(async () => {
      try {
        if (!user) {
          setError("User not available, try refreshing");
          return;
        }

        // fetch new card details
        const response = await fetch("/api/generate-cc");
        const res: { success: boolean; message: string; data: CreditCard[] } =
          await response.json();

        if (!res.success) {
          setError(res.message);
          return;
        }

        const data = await onBoardingAction(values, res.data, user?.id);

        if (data.error) {
          setError(data.error);
          toast.error(data.error);
          return;
        }

        if (data.success) {
          await update({
            trigger: "update", // This will cause the jwt callback to fetch fresh data
            user: {
              phoneNumber: values.phoneNumber,
            },
          });
          setLoading(true);
          toast.success(data.success);

          router.push("/account/security");
        }
      } catch (err: any) {
        console.error("> Error onboarding user: " + err?.message);
        setError(err.message || "An unexpected error occurred");
      }
    });
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="h-full bg-gradient-to-b from-azureBlue-400/10 to-azureBlue-500/10 flex items-center justify-center p-4">
      <CardWrapper
        header="Welcome!"
        headerLabel="Let's set up your account"
        backButtonLabel="Back to home"
        backButtonHref="/"
      >
        <form onSubmit={onBoardingForm.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Phone className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
              <Input
                type="tel"
                placeholder="Phone Number"
                {...onBoardingForm.register("phoneNumber")}
                autoComplete="tel"
                min={1000000000}
                max={9999999999}
                className="pl-10 border-azureBlue-400/50 focus:border-azureBlue-500"
                disabled={isPending}
                maxLength={10}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="Wallet PIN (6 digits)"
                {...onBoardingForm.register("pin")}
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="new-password"
                className="pl-10 border-azureBlue-400/50 focus:border-azureBlue-500"
                disabled={isPending}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="Confirm Wallet PIN"
                {...onBoardingForm.register("confirmPin")}
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="new-password"
                className="pl-10 border-azureBlue-400/50 focus:border-azureBlue-500"
                disabled={isPending}
              />
            </div>
          </div>

          <FormError message={error || ""} />

          <Button
            type="submit"
            className="w-full bg-azureBlue-500 hover:bg-azureBlue-600 text-white"
            disabled={isPending}
          >
            {isPending ? (
              "Setting up your account..."
            ) : (
              <span className="flex items-center justify-center gap-2">
                Continue <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      </CardWrapper>
    </div>
  );
}
