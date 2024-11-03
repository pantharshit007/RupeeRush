"use client";

import React, { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import CardWrapper from "@/components/common/CardWrapper";
import { useSearchParams } from "next/navigation";
import { emailVerifyAction } from "@/actions/auth/verifyEmail";
import FormSuccess from "@/components/common/FormSuccess";
import FormError from "@/components/common/FormError";
import { Button } from "@repo/ui/components/ui/button";

interface TokenVerifyProps {
  existingUser: boolean;
}

/**
 * Verify user's token for email verification
 * @param existingUser whether user is logged in or not
 * @type {boolean}
 */
function TokenVerificationForm({ existingUser }: TokenVerifyProps) {
  const [error, setError] = useState<string | null>();
  const [success, setSuccess] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  /**
   * This function will check whether the user token has expired: create/update user
   *
   * useCallback to prevent func re-rendering
   */
  const onSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Token Missing!");
      return;
    }

    try {
      const data = await emailVerifyAction(token, existingUser);

      if (data.error) setError(data.error || "Something went wrong");
      if (data.success) setSuccess(data.success);
    } catch (err: any) {
      console.error("> Error Logging user: " + err?.message);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [token, existingUser]);

  return (
    <CardWrapper
      header="🔐 Auth | Email Verification"
      headerLabel="Confirm your email"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <div className="flex flex-col items-center w-full justify-center">
        {/* Show loader only if verifying */}
        {loading && <BeatLoader />}

        {/* Display success or error message */}
        <FormSuccess message={success || ""} />
        <FormError message={error || ""} />

        {/* Show button only if no success or error message */}
        {!loading && !success && !error && <Button onClick={onSubmit}>Confirm your Email</Button>}
      </div>
    </CardWrapper>
  );
}

export default TokenVerificationForm;
