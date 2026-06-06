"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[CoreHR SW] Registered:", reg.scope);
        })
        .catch((err) => {
          console.error("[CoreHR SW] Registration failed:", err);
        });
    }
  }, []);

  return null;
}
