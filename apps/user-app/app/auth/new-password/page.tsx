import NewPasswordForm from "@/components/auth/NewPasswordForm";
import React, { Suspense } from "react";
import { LuLoader } from "react-icons/lu";

// Loading component for better UX/suppress unwanted behavious: CSR bailout issues
const LoadingState = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <LuLoader className="h-8 w-8 animate-spin text-primary" />
      <span className="sr-only">Loading</span>
    </div>
  );
};

function NewPasswordPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <NewPasswordForm />;
    </Suspense>
  );
}

export default NewPasswordPage;
