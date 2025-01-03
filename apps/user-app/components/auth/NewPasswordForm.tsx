"use client";

import React, { useState, useTransition } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";

import CardWrapper from "@/components/common/CardWrapper";
import { NewPasswordSchema } from "@repo/schema/authSchema";
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
import { updatePasswordAction } from "@/actions/auth/updatePassword";

function NewPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  function submitHandler(values: z.infer<typeof NewPasswordSchema>) {
    setSuccess("");
    setError("");

    startTransition(async () => {
      try {
        const data = await updatePasswordAction(values, token);

        if (data?.error) {
          setError(data.error || "Something went wrong!");
          form.reset();
        }

        if (data?.success) {
          setSuccess(data?.success);
          form.reset();
        }
      } catch (err: any) {
        console.error("> Error updating new-password: " + err?.message);
        setError("Something went wrong");
      }
    });
  }

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: { password: "" },
  });

  return (
    <>
      <CardWrapper
        header="🔐 Auth"
        headerLabel="Forgot your password?"
        backButtonLabel="Back to login"
        backButtonHref="/auth/login"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-6">
            {/* prettier-ignore */}
            <div className="space-y-4">
                {/* email */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="******" 
                          type="password" 
                          disabled={isPending} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
              />    
            </div>

            <FormError message={error || ""} />
            <FormSuccess message={success} />

            <Button type={"submit"} className="w-full" disabled={isPending}>
              Reset Password
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </>
  );
}

export default NewPasswordForm;
