import LoadingState from "@/components/common/LoadingState";
import OnboardingPage from "@/components/onBoarding/OnBoarding";
import React, { Suspense } from "react";

function page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <OnboardingPage />
    </Suspense>
  );
}

export default page;
