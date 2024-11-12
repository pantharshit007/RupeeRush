"use client";

import React, { useCallback, useState } from "react";
import { BeatLoader } from "react-spinners";
import CardWrapper from "@/components/common/CardWrapper";
import { useSearchParams } from "next/navigation";
import { emailVerifyAction } from "@/actions/auth/verifyEmail";
import FormSuccess from "@/components/common/FormSuccess";
import FormError from "@/components/common/FormError";
import { Button } from "@repo/ui/components/ui/button";
import { InfoTooltipComponent } from "@/components/common/InfoTooltip";

/**
 * Verify user's token for email verification
 * @param existingUser whether user is logged in or not
 * @type {boolean}
 */
function TokenVerificationForm() {
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
      const data = await emailVerifyAction(token);

      if (data.error) setError(data.error || "Something went wrong");
      if (data.success) setSuccess(data.success);
    } catch (err: any) {
      console.error("> Error verifying token: " + err?.message);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [token]);

  return (
    <CardWrapper
      header="🔐 Auth"
      headerLabel="Email Verification"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <div className="flex flex-col items-center w-full justify-center relative">
        {/* Show loader only if verifying */}
        {loading && <BeatLoader />}

        {/* Display success or error message */}
        <FormSuccess message={success || ""} />
        <FormError message={error || ""} />

        {/* Show button only if no success or error message */}
        {!loading && !success && !error && <Button onClick={onSubmit}>Confirm your Email</Button>}

        <div className="absolute translate-x-24 -translate-y-6">
          <InfoTooltipComponent message="After updating the email re-login! keep only 1 tab alive!" />
        </div>
      </div>
    </CardWrapper>
  );
}

export default TokenVerificationForm;
