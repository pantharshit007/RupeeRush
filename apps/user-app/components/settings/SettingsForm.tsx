"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { BsPersonFillGear } from "react-icons/bs";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BeatLoader } from "react-spinners";

import { cn } from "@repo/ui/lib/utils";
import { settingsAction } from "@/actions/settings";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent, CardHeader } from "@repo/ui/components/ui/card";
import { SettingsSchema } from "@repo/schema/authSchema";
import { Input } from "@repo/ui/components/ui/input";
import { Switch } from "@repo/ui/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import FormError from "@/components/common/FormError";
import FormSuccess from "@/components/common/FormSuccess";
import { InfoTooltipComponent } from "@/components/common/InfoTooltip";
import DeleteAccount from "@/components/settings/DeleteAccount";

function SettingsForm({ className }: { className?: string }) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { data: session, update } = useSession();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: session?.user?.name || undefined,
      email: session?.user?.email || undefined,
      oldPassword: undefined,
      newPassword: undefined,
      isTwoFactorEnabled: session?.user?.isTwoFactorEnabled || undefined,
    },
  });

  const submitHandler = async (values: z.infer<typeof SettingsSchema>) => {
    setLoading(true);
    setSuccess("");
    setError("");

    const email1 = process.env.DEMO_EMAIL1 || "alice@example.com";
    const email2 = process.env.DEMO_EMAIL2 || "bob@example.com";

    try {
      if (session?.user?.email === email1 || session?.user?.email === email2) {
        return setError("Demo accounts cannot be updated!");
      }

      startTransition(async () => {
        const data = await settingsAction(values, session?.user?.id!);

        if (data.error) {
          setError(data.error);
        }

        if (data.success && data.success != "Verification email sent!") {
          // trigger session update
          await update({
            trigger: "update", // This will cause the jwt callback to fetch fresh data
            // session object
            user: {
              name: values.name,
              email: values.email,
              isTwoFactorEnabled: values.isTwoFactorEnabled,
            },
          });
          setSuccess(data.success);
        }

        if (data.success === "Verification email sent!") {
          setSuccess(data.success);
        }
      });
    } catch (err: any) {
      console.error("> Error updating settings: " + err?.message);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(className)}>
      <Card className="w-[600px] max-md:w-[400px] max-sm:w-[375px] shadow-sm mx-auto">
        <CardHeader>
          <p className="flex w-full justify-center items-center text-2xl font-semibold gap-x-2">
            <BsPersonFillGear size="27" className="text-blue-500" /> Settings
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            {/* prettier-ignore */}
            <form className="space-y-6 w-full" onSubmit={form.handleSubmit(submitHandler)}>
              <div className="space-y-2">
                {/* NAME */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} type="name" placeholder="John Doe" disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* EMAIL */}
                {!session?.user?.isOAuth && (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <span className="flex items-center">
                          <FormLabel>Email</FormLabel>
                          <InfoTooltipComponent message="Either update email or any other fields." />
                        </span>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            autoComplete="email"
                            placeholder="john.doe@email.com"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* PASSWORD - 2FA */}
                {!session?.user?.isOAuth && (
                  <>
                    <div className="flex gap-x-5">
                      {/* PASSWORD */}
                      <FormField
                        control={form.control}
                        name="oldPassword"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Old Password</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                autoComplete="current-password"
                                placeholder="******"
                                disabled={isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* NEW PASSWORD */}
                      <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                autoComplete="new-password"
                                placeholder="******"
                                disabled={isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* TWO FACTOR AUTHENTICATION */}
                    <FormField
                      control={form.control}
                      name="isTwoFactorEnabled"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Two Factor Authentication</FormLabel>
                            <FormDescription>
                              Enable or disable the two-factor authentication
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isPending}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>

              <div className="flex flex-col gap-y-2">
                {!loading && <FormError message={error || ""} />}
                {!loading && <FormSuccess message={success} />}
                {(loading || isPending) && <BeatLoader color={"#1BA4FF"} style={{ margin: "auto" }} />}
                
                <Button type="submit" disabled={isPending} className="ml-auto text-white">
                  Update Settings
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <DeleteAccount
        setLoading={setLoading}
        loading={loading}
        setSuccess={setSuccess}
        setError={setError}
      />
    </div>
  );
}

export default SettingsForm;
