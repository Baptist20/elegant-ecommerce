"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "font-sans",
        duration: 4000,
        style: {
          background: "#141718",
          color: "#fff",
          border: "none",
        },
      }}
    />
  );
}
