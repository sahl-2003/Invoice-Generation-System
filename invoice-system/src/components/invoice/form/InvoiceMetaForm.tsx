import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InvoiceData } from "@/types/invoice"

export function InvoiceMetaForm() {
  const { register, formState: { errors } } = useFormContext<InvoiceData>()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-t pt-4">Invoice Details</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <Input id="invoiceNumber" placeholder="INV-001" {...register("invoiceNumber")} />
          {errors.invoiceNumber && <p className="text-sm text-destructive">{errors.invoiceNumber.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input id="issueDate" type="date" {...register("issueDate")} />
          {errors.issueDate && <p className="text-sm text-destructive">{errors.issueDate.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input id="dueDate" type="date" {...register("dueDate")} />
          {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate.message}</p>}
        </div>
      </div>
    </div>
  )
}
