import { useFieldArray, useFormContext } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InvoiceData } from "@/types/invoice"

export function LineItemsForm() {
  const { register, control, formState: { errors } } = useFormContext<InvoiceData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-t pt-4">
        <h3 className="text-lg font-medium">Line Items</h3>
        <Button
          type="button"
          onClick={() => append({ id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0 })}
          size="sm"
          variant="outline"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>
      
      {errors.items?.root && (
        <p className="text-sm text-destructive">{errors.items.root.message}</p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-12 sm:col-span-6 space-y-2">
              <Label className={index !== 0 ? "sr-only" : ""}>Description</Label>
              <Input
                placeholder="Web Development"
                {...register(`items.${index}.description` as const)}
              />
              {errors.items?.[index]?.description && (
                <p className="text-sm text-destructive">{errors.items[index]?.description?.message}</p>
              )}
            </div>
            
            <div className="col-span-6 sm:col-span-2 space-y-2">
              <Label className={index !== 0 ? "sr-only" : ""}>Qty</Label>
              <Input
                type="number"
                min="1"
                {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
              />
              {errors.items?.[index]?.quantity && (
                <p className="text-sm text-destructive">{errors.items[index]?.quantity?.message}</p>
              )}
            </div>
            
            <div className="col-span-6 sm:col-span-3 space-y-2">
              <Label className={index !== 0 ? "sr-only" : ""}>Price</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                {...register(`items.${index}.unitPrice` as const, { valueAsNumber: true })}
              />
              {errors.items?.[index]?.unitPrice && (
                <p className="text-sm text-destructive">{errors.items[index]?.unitPrice?.message}</p>
              )}
            </div>
            
            <div className="col-span-12 sm:col-span-1 flex justify-end">
              <div className={index === 0 ? "mt-7" : "mt-0"}>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                   <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 pt-4">
        <div className="space-y-2">
          <Label htmlFor="taxRate">Tax Rate (%)</Label>
          <Input id="taxRate" type="number" min="0" max="100" step="0.1" {...register("taxRate", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discountRate">Discount Rate (%)</Label>
          <Input id="discountRate" type="number" min="0" max="100" step="0.1" {...register("discountRate", { valueAsNumber: true })} />
        </div>
      </div>
    </div>
  )
}
