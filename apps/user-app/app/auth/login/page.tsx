import React, { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import LoadingState from "@/components/common/LoadingState";

// Loading component for better UX/suppress unwanted behavious: CSR bailout issues
function LoginPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <LoginForm />
    </Suspense>
  );
}

export default LoginPage;
