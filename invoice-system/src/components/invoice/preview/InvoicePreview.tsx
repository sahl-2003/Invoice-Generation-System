import { type InvoiceData } from "@/types/invoice"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { forwardRef } from "react"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function InvoiceHeader({ data }: { data: InvoiceData }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between pb-8 border-b border-slate-200">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">INVOICE</h2>
        <p className="text-slate-500 font-medium">#{data.invoiceNumber || "INV-001"}</p>
        <div className="mt-8 space-y-1">
          <p className="text-sm font-semibold text-slate-800">From:</p>
          <p className="text-sm font-medium">{data.billerName || "Your Company Name"}</p>
          {data.billerAddress && <p className="text-sm text-slate-500">{data.billerAddress}</p>}
          {data.billerEmail && <p className="text-sm text-slate-500">{data.billerEmail}</p>}
          {data.billerPhone && <p className="text-sm text-slate-500">{data.billerPhone}</p>}
        </div>
      </div>
      
      <div className="mt-8 sm:mt-0 sm:text-right space-y-1">
        <div className="flex justify-end gap-12 sm:gap-4 mb-8">
          <div className="text-left sm:text-right">
            <p className="text-sm font-semibold text-slate-800">Issue Date:</p>
            <p className="text-sm text-slate-600">
              {data.issueDate ? format(new Date(data.issueDate), "PPP") : "N/A"}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm font-semibold text-slate-800">Due Date:</p>
            <p className="text-sm text-slate-600">
              {data.dueDate ? format(new Date(data.dueDate), "PPP") : "N/A"}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-800">Bill To:</p>
          <p className="text-sm font-medium">{data.clientName || "Client Name"}</p>
          {data.clientAddress && <p className="text-sm text-slate-500">{data.clientAddress}</p>}
          {data.clientEmail && <p className="text-sm text-slate-500">{data.clientEmail}</p>}
        </div>
      </div>
    </div>
  )
}

function InvoiceItems({ data }: { data: InvoiceData }) {
  const items = data.items || []
  
  return (
    <div className="py-8">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead className="w-[50%]">Description</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id ?? index}>
              <TableCell className="font-medium text-slate-800">
                {item.description || "Item Description"}
              </TableCell>
              <TableCell className="text-right text-slate-600">{item.quantity || 0}</TableCell>
              <TableCell className="text-right text-slate-600">{formatCurrency(item.unitPrice || 0)}</TableCell>
              <TableCell className="text-right text-slate-800 font-medium">
                {formatCurrency((item.quantity || 0) * (item.unitPrice || 0))}
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                No items added yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function InvoiceTotals({ data }: { data: InvoiceData }) {
  const items = data.items || []
  const subtotal = items.reduce((acc, item) => acc + (item.quantity || 0) * (item.unitPrice || 0), 0)
  
  const taxRate = data.taxRate || 0
  const discountRate = data.discountRate || 0
  
  const taxAmount = subtotal * (taxRate / 100)
  const subtotalWithTax = subtotal + taxAmount
  const discountAmount = subtotalWithTax * (discountRate / 100)
  const total = subtotalWithTax - discountAmount

  return (
    <div className="flex flex-col sm:flex-row justify-between pt-8 border-t border-slate-200">
      <div className="mb-6 sm:mb-0 w-full sm:w-1/2 pr-4">
        {data.notes && (
          <div>
            <p className="text-sm font-semibold text-slate-800 mb-1">Notes</p>
            <p className="text-sm text-slate-500 whitespace-pre-wrap">{data.notes}</p>
          </div>
        )}
      </div>
      
      <div className="w-full sm:w-1/3 space-y-3 shrink-0">
        <div className="flex justify-between text-sm text-slate-600">
          <p>Subtotal</p>
          <p>{formatCurrency(subtotal)}</p>
        </div>
        
        {taxRate > 0 && (
          <div className="flex justify-between text-sm text-slate-600">
            <p>Tax ({taxRate}%)</p>
            <p>{formatCurrency(taxAmount)}</p>
          </div>
        )}
        
        {discountRate > 0 && (
          <div className="flex justify-between text-sm text-slate-600">
            <p>Discount ({discountRate}%)</p>
            <p>-{formatCurrency(discountAmount)}</p>
          </div>
        )}
        
        <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t">
          <p>Total</p>
          <p>{formatCurrency(total)}</p>
        </div>
      </div>
    </div>
  )
}

export const InvoicePreview = forwardRef<HTMLDivElement, { data: InvoiceData }>(({ data }, ref) => {
  return (
    <div 
      ref={ref} 
      className="bg-white p-8 sm:p-12 w-full mx-auto shadow-sm print:shadow-none print:p-0 font-sans text-slate-800"
    >
      <InvoiceHeader data={data} />
      <InvoiceItems data={data} />
      <InvoiceTotals data={data} />
    </div>
  )
})

InvoicePreview.displayName = "InvoicePreview"
