import { useInvoiceHistory, type SavedInvoice } from "@/hooks/useInvoiceHistory";
import { Button } from "@/components/ui/button";
import { Trash, PencilLine, FileText } from "lucide-react";

interface HistoryPageProps {
  onLoadInvoice: (invoice: SavedInvoice) => void;
}

export function HistoryPage({ onLoadInvoice }: HistoryPageProps) {
  const { history, deleteFromHistory } = useInvoiceHistory();

  const calculateTotal = (invoice: SavedInvoice) => {
    const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const afterDiscount = subtotal - subtotal * (invoice.discountRate / 100);
    return afterDiscount + afterDiscount * (invoice.taxRate / 100);
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="bg-indigo-50 p-6 rounded-full mb-6">
          <FileText className="h-16 w-16 text-indigo-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No invoices yet</h2>
        <p className="text-slate-500 max-w-md">You haven't saved any invoices to your history. Generate your first invoice to see it here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/40 p-4 md:p-8 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Invoice History</h2>
        <span className="bg-indigo-100 text-indigo-700 font-semibold px-3 py-1 rounded-full text-sm">
          {history.length} Saved
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b-2 border-slate-100 text-slate-500 uppercase text-xs tracking-wider">
              <th className="pb-4 font-semibold px-4">Invoice No</th>
              <th className="pb-4 font-semibold px-4">Client</th>
              <th className="pb-4 font-semibold px-4">Date Saved</th>
              <th className="pb-4 font-semibold text-right px-4">Amount</th>
              <th className="pb-4 font-semibold text-right px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="py-4 px-4 font-medium text-indigo-600">
                  {invoice.invoiceNumber || "Draft"}
                </td>
                <td className="py-4 px-4 text-slate-800 font-medium">
                  {invoice.clientName || "Unknown Client"}
                </td>
                <td className="py-4 px-4 text-slate-500">
                  {new Date(invoice.savedAt).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })}
                </td>
                <td className="py-4 px-4 text-right font-bold text-slate-900">
                  ${calculateTotal(invoice).toFixed(2)}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onLoadInvoice(invoice)}
                      className="h-8 text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <PencilLine className="h-4 w-4 mr-1" /> Load
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (confirm("Delete this invoice from history?")) {
                          deleteFromHistory(invoice.id);
                        }
                      }}
                      className="h-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
