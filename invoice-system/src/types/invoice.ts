import * as z from "zod"

export const LineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Price must be positive"),
})

export const InvoiceSchema = z.object({
  billerName: z.string().min(1, "Biller Name is required"),
  billerAddress: z.string().min(1, "Biller Address is required"),
  billerEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
  billerPhone: z.string().optional(),

  clientName: z.string().min(1, "Client Name is required"),
  clientAddress: z.string().min(1, "Client Address is required"),
  clientEmail: z.string().email("Invalid email format").optional().or(z.literal("")),

  invoiceNumber: z.string().min(1, "Invoice number is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),

  items: z.array(LineItemSchema).min(1, "At least one item is required"),
  
  notes: z.string().optional(),
  taxRate: z.number().min(0).max(100).default(0),
  discountRate: z.number().min(0).max(100).default(0),
}).refine(data => {
  const issue = new Date(data.issueDate)
  const due = new Date(data.dueDate)
  return due >= issue
}, {
  message: "Due date must be after or on issue date",
  path: ["dueDate"]
})

export type LineItem = z.infer<typeof LineItemSchema>
export type InvoiceData = z.infer<typeof InvoiceSchema>
