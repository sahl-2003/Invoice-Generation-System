import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type InvoiceData } from "@/types/invoice"

export function ClientForm() {
  const { register, formState: { errors } } = useFormContext<InvoiceData>()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-t pt-4">Client Details</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name</Label>
          <Input id="clientName" placeholder="Acme Corp" {...register("clientName")} />
          {errors.clientName && <p className="text-sm text-destructive">{errors.clientName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientEmail">Client Email</Label>
          <Input id="clientEmail" type="email" placeholder="billing@acme.com" {...register("clientEmail")} />
          {errors.clientEmail && <p className="text-sm text-destructive">{errors.clientEmail.message}</p>}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="clientAddress">Client Address</Label>
          <Input id="clientAddress" placeholder="456 Client Ave, City, Country" {...register("clientAddress")} />
          {errors.clientAddress && <p className="text-sm text-destructive">{errors.clientAddress.message}</p>}
        </div>
      </div>
    </div>
  )
}
