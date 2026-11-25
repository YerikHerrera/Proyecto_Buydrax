import { useState, useCallback } from "react";

type ToastType = "error" | "success" | "info";

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "error") => {
    setToast({ message, type });
  }, []);

  const closeToast = useCallback(() => setToast(null), []);

  return { toast, showToast, closeToast };
}