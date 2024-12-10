import LoadingState from "@/components/common/LoadingState";
import Security from "@/components/security/Security";
import React, { Suspense } from "react";

function page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Security />
    </Suspense>
  );
}

export default page;
