import { useState, useEffect } from "react";
import { type InvoiceData } from "@/types/invoice";

const HISTORY_KEY = "invoice_history";

export interface SavedInvoice extends InvoiceData {
  id: string;
  savedAt: string;
}

export function useInvoiceHistory() {
  const [history, setHistory] = useState<SavedInvoice[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = (invoice: InvoiceData) => {
    const newInvoice: SavedInvoice = {
      ...invoice,
      id: crypto.randomUUID(),
      savedAt: new Date().toISOString(),
    };
    const newHistory = [newInvoice, ...history];
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    return newInvoice.id;
  };

  const deleteFromHistory = (id: string) => {
    const newHistory = history.filter((inv) => inv.id !== id);
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  return { history, saveToHistory, deleteFromHistory };
}
