import { Suspense } from "react";

import LoadingState from "@/components/common/LoadingState";
import SettingsForm from "@/components/settings/SettingsForm";

// Loading component for better UX/suppress unwanted behavious: CSR bailout issues
function page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SettingsForm className=" h-[100dvh] flex flex-col justify-center items-center md:-mt-6 -mt-10 max-sm:-mt-16 " />
    </Suspense>
  );
}

export default page;
