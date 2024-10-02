import React from "react";

interface StatusType {
  status: "Success" | "Failure" | "Processing";
}

enum StatusState {
  Success = "Success",
  Failure = "Failure",
  Processing = "Processing",
}

function Status({ status }: StatusType) {
  let bgColor, dotColor, textColor;

  // Determine the colors based on the status
  switch (status) {
    case StatusState.Success:
      bgColor = "bg-green-200";
      dotColor = "bg-green-600";
      textColor = "text-green-600";
      break;

    case StatusState.Failure:
      bgColor = "bg-red-200";
      dotColor = "bg-red-600";
      textColor = "text-red-600";
      break;

    case StatusState.Processing:
      bgColor = "bg-orange-200";
      dotColor = "bg-orange-600";
      textColor = "text-orange-600";
      break;

    default:
      bgColor = "bg-gray-200";
      dotColor = "bg-gray-600";
      textColor = "text-gray-600";
  }

  return (
    <div
      className={`flex items-center gap-x-2 px-2 py-1 rounded-3xl w-fit ${bgColor}`}
    >
      <div className={`h-2 w-2 rounded-full ${dotColor}`}></div>
      <p className={`font-medium ${textColor}`}>{status}</p>
    </div>
  );
}

export default Status;
