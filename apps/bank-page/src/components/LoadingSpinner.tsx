import { CheckCircle, Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-lg font-semibold">Processing payment...</p>
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="h-screen w-full flex items-center flex-col gap-y-6 justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary text-azureBlue-500" />
      <span className="sr-only">Loading</span>
      <p className="text-lg font-semibold block">Hold tight while we fetch payment info... 🔍</p>
    </div>
  );
}

export function SuccessState() {
  return (
    <div className="h-screen w-full flex items-center flex-col gap-y-6 justify-center">
      <CheckCircle className="h-8 w-8 text-green-500" />
      <span className="sr-only">Success</span>
      <p className="text-lg font-semibold block">Payment successful! 🎉</p>
      <p className="text-md text-gray-500">
        Refresh the page to see the payment details. You can also close this window.
      </p>
    </div>
  );
}

export default LoadingState;
