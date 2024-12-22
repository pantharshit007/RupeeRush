import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import PaymentPage from "@/components/PaymentPage";
import { apiRequest } from "@/utils/api";
import { env } from "@/utils/env";
import { LoadingState } from "@/components/LoadingSpinner";
import Error from "@/components/Error";

export interface PaymentInfo {
  txnId: string;
  nonce: string;
  amount: number;
  senderEmail: string;
  receiverAccountNumber: string;
  recieverName: string;
}

function Axis() {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const txnId = queryParams.get("txnId");
  const nonce = queryParams.get("nonce");

  // Fetch payment info from the API
  const getPaymentInfo = useCallback(async () => {
    if (!txnId || !nonce) {
      setError("Missing transaction details");
      setLoading(false);
      return;
    }

    try {
      const res = await apiRequest(`${env.BANK_API_URL}/api/v1/paymentDetails`, "POST", {
        txnId,
        nonce,
      });

      if (!res.success) {
        setError(res.message);
        return;
      }

      setPaymentInfo(res.paymentInfo);
    } catch (error) {
      setError("Failed to fetch payment details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [txnId, nonce]);

  useEffect(() => {
    getPaymentInfo();
  }, [getPaymentInfo]);

  if (loading) return <LoadingState />;

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Error message={error} />;
      </div>
    );

  if (!paymentInfo)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        No payment information available
      </div>
    );

  return <PaymentPage {...paymentInfo} />;
}

export default Axis;
