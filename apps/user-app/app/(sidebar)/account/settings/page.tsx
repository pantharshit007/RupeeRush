import { Suspense } from "react";

import LoadingState from "@/components/common/LoadingState";
import SettingsForm from "@/components/settings/SettingsForm";

// Loading component for better UX/suppress unwanted behavious: CSR bailout issues
function page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SettingsForm />
    </Suspense>
  );
}

export default page;
