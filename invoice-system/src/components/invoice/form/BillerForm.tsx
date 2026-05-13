import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InvoiceData } from "@/types/invoice"

export function BillerForm() {
  const { register, formState: { errors } } = useFormContext<InvoiceData>()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Biller Details</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="billerName">Company / Name</Label>
          <Input id="billerName" placeholder="Your Company LLC" {...register("billerName")} />
          {errors.billerName && <p className="text-sm text-destructive">{errors.billerName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="billerEmail">Email</Label>
          <Input id="billerEmail" type="email" placeholder="contact@company.com" {...register("billerEmail")} />
          {errors.billerEmail && <p className="text-sm text-destructive">{errors.billerEmail.message}</p>}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="billerAddress">Address</Label>
          <Input id="billerAddress" placeholder="123 Business St, City, Country" {...register("billerAddress")} />
          {errors.billerAddress && <p className="text-sm text-destructive">{errors.billerAddress.message}</p>}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="billerPhone">Phone Option (Optional)</Label>
          <Input id="billerPhone" placeholder="+1 234 567 890" {...register("billerPhone")} />
        </div>
      </div>
    </div>
  )
}
