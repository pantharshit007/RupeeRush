"use client";

import React, { useState, useTransition } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";

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
import Link from "next/link";

function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in user with different provider!"
      : searchParams.get("error");

  function submitHandler(values: z.infer<typeof LoginSchema>) {
    setSuccess("");
    setError("");

    startTransition(async () => {
      try {
        const data = await loginAction(values);

        if (data?.error) {
          // Extracts only the relevant part of the error message: before "Read more"
          // TODO: fix this to only show relevant message `action/auth/login.ts`
          const errorMessage = data?.error.match(/^[^\r\n]+/)?.[0];
          setError(errorMessage || "Something went wrong!");
          form.reset();
        }

        if (data?.success) {
          setSuccess(data?.success);
          form.reset();
        }
      } catch (err: any) {
        console.error("> Error Logging user: " + err?.message);
        setError("Something went wrong");
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
        backButtonLabel="Don't have an account yet?"
        backButtonHref="/auth/register"
        showSocial
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-6">
            {/* prettier-ignore */}
            <div className="space-y-4">

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
                        <Link href={'/auth/reset'}>
                        Forgot password
                        </Link>
                      </Button>

                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <FormError message={error || urlError || ""} />
            <FormSuccess message={success} />

            <Button type={"submit"} className="w-full" disabled={isPending}>
              Login
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </>
  );
}

export default LoginForm;
