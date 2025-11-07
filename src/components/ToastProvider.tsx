// src/components/ToastProvider.tsx
import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-left"
      toastOptions={{
        duration: 5000,
        style: {
          background: "#363636",
          color: "#fff",
          fontFamily: "Vazir, sans-serif",
        },
        success: {
          duration: 3000,
          style: {
            background: "#10b981",
            color: "#fff",
            fontWeight: "bold",
          },
        },
        error: {
          duration: 5000,
          style: {
            background: "#ef4444",
            color: "#fff",
            fontWeight: "bold",
          },
        },
      }}
    />
  );
}
