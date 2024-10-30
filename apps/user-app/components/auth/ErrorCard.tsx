import React from "react";

import CardWrapper from "@/components/common/CardWrapper";
import FormError from "@/components/common/FormError";
import { useSearchParams } from "next/navigation";

function ErrorCard() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  return (
    <CardWrapper
      header="🔐 Auth"
      headerLabel="Oops, something went wrong"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <FormError message={urlError ?? "Something went wrong"} />
    </CardWrapper>
  );
}

export default ErrorCard;
