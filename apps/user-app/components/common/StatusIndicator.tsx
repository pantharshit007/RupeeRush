"use client";

import { cn } from "@repo/ui/lib/utils";
import React, { useEffect, useState, useCallback, useRef } from "react";
import ToolTipWrapper from "./ToolTipWrapper";

const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL;
const POLLING_INTERVAL = 5000; // 5 seconds

function StatusIndicator() {
  const [status, setStatus] = useState<"active" | "inactive" | "starting">("inactive");
  const [message, setMessage] = useState<string>("Checking webhook status...");
  const [isChecking, setIsChecking] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearPingInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const ping = useCallback(async () => {
    if (isChecking || !WEBHOOK_URL || status === "active") {
      return;
    }

    try {
      setIsChecking(true);
      setStatus("starting");
      setMessage("Backend is starting up...");

      const response = await fetch(`${WEBHOOK_URL}/ping`, {
        signal: AbortSignal.timeout(15000),
      });

      const data = await response.json();

      if (response.status === 200 || data.msg === "pong") {
        setStatus("active");
        setMessage("Webhook is operational!");
        clearPingInterval(); // Stop polling once we're active
      } else {
        setStatus("inactive");
        setMessage("Webhook is down!");
      }
    } catch (error) {
      console.error("Error pinging webhook:", error);
      setStatus("inactive");
      setMessage("Failed to connect to webhook");
    } finally {
      setIsChecking(false);
    }
  }, [isChecking, status, clearPingInterval]);

  const startPolling = useCallback(() => {
    clearPingInterval(); // Clear any existing interval
    intervalRef.current = setInterval(() => {
      if (status !== "starting" && !isChecking) {
        ping();
      }
    }, POLLING_INTERVAL);
  }, [ping, status, isChecking, clearPingInterval]);

  useEffect(() => {
    ping();

    // Start polling if not active
    if (status !== "active") {
      startPolling();
    }

    return () => clearPingInterval();
  }, []);

  return (
    <ToolTipWrapper message={message}>
      <span
        className={cn("rounded-full w-3 h-3 shadow-md animate-pulse", {
          "bg-green-500 shdaow-green-500/50": status === "active",
          "bg-rose-500 shadow-red-600/50": status === "inactive",
          "bg-amber-600 shadow-yellow-500/50 ": status === "starting",
        })}
        aria-label={`Backend status: ${status}`}
      />
    </ToolTipWrapper>
  );
}

export default StatusIndicator;
