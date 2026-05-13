import { type InvoiceData } from "@/types/invoice";
import { useEffect, useState } from "react";

const STORAGE_KEY = "invoice_draft";

export function useInvoiceStorage(defaultValues: InvoiceData) {
  const [initialData, setInitialData] = useState<InvoiceData>(defaultValues);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setInitialData(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load invoice draft", e);
    }
  }, []);

  const saveDraft = (data: InvoiceData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save invoice draft", e);
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setInitialData(defaultValues);
    } catch (e) {
      console.error("Failed to clear invoice draft", e);
    }
  };

  return { initialData, saveDraft, clearDraft };
}
