import React from "react";

import CardWrapper from "@/components/common/CardWrapper";
import FormError from "@/components/common/FormError";

function ErrorCard() {
  // TODO: add toast to notify based on searchParams
  return (
    <CardWrapper
      header="🔐 Auth"
      headerLabel="Oops, something went wrong"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <FormError message={"Something went wrong"} />
    </CardWrapper>
  );
}

export default ErrorCard;
