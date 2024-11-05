"use client";

import React, { useEffect, useState, useTransition } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BeatLoader } from "react-spinners";

import CardWrapper from "@/components/common/CardWrapper";
import { LoginSchema } from "@repo/schema/authSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import FormError from "@/components/common/FormError";
import FormSuccess from "@/components/common/FormSuccess";
import { loginAction } from "@/actions/auth/login";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(
    searchParams.get("showTwoFactor") === "true"
  );

  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in user with different provider!"
      : searchParams.get("error");

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (showTwoFactor) {
      params.set("showTwoFactor", "true");
    } else {
      params.delete("showTwoFactor");
    }

    const newUrl = `/auth/login${params.size ? `?${params.toString()}` : ""}`;
    router.push(newUrl, { scroll: false });
  }, [showTwoFactor, router, searchParams]);

  function submitHandler(values: z.infer<typeof LoginSchema>) {
    setLoading(true);
    setSuccess("");
    setError("");

    startTransition(async () => {
      try {
        const data = await loginAction(values);

        // TODO: fix this to only show relevant message `action/auth/login.ts` in catch
        if (data?.error) {
          // Extracts only the relevant part of the error message: before "Read more"
          const errorMessage = data?.error.match(/^[^\r\n]+/)?.[0];
          setError(errorMessage || "Something went wrong!");
          form.reset();
        }

        if (data?.success) {
          setSuccess(data?.success);
          form.reset();
        }

        // For 2FA
        if (data?.twoFactorSend) {
          setShowTwoFactor(true);
        }
      } catch (err: any) {
        console.error("> Error Logging user: " + err?.message);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    });
  }

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <>
      <CardWrapper
        header="🔐 Auth"
        headerLabel="Welcome Back"
        backButtonLabel={!showTwoFactor ? "Don't have an account yet?" : ""}
        backButtonHref="/auth/register"
        showSocial={!showTwoFactor ? true : false}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-6">
            <div className="space-y-4">
              {/* two Factor Form */}
              {showTwoFactor && (
                <>
                  <FormField
                    control={form.control}
                    name="twoFactorCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Two Factor </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="123456" type="code" disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Login Form */}
              {!showTwoFactor && (
                <>
                  {/* email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="john.doe@example.com"
                            type="email"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="******"
                            type="password"
                            disabled={isPending}
                          />
                        </FormControl>

                        {/* FORGOT PASSWORD */}
                        <Button
                          size="sm"
                          asChild
                          variant="link"
                          className="w-full font-normal justify-end -py-1 px-0"
                        >
                          <Link href={"/auth/reset"}>Forgot password</Link>
                        </Button>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <div className="flex flex-col items-center w-full justify-center gap-y-2">
              <FormError message={error || urlError || ""} />
              <FormSuccess message={success} />

              {loading && <BeatLoader />}

              {!loading && !success && !error && (
                <Button type={"submit"} className="w-full" disabled={isPending}>
                  {showTwoFactor ? "Submit" : "Login"}
                </Button>
              )}

              {/* 2FA Back button */}
              {showTwoFactor && (
                <Button
                  className="w-full underline"
                  disabled={isPending}
                  variant={"link"}
                  onClick={(prev) => setShowTwoFactor(!prev)}
                >
                  ← Back to Login
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardWrapper>
    </>
  );
}

export default LoginForm;
