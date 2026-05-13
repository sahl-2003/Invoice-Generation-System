import { useEffect, useRef } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import html2pdf from "html2pdf.js"

import { BillerForm } from "./components/invoice/form/BillerForm"
import { ClientForm } from "./components/invoice/form/ClientForm"
import { InvoiceMetaForm } from "./components/invoice/form/InvoiceMetaForm"
import { LineItemsForm } from "./components/invoice/form/LineItemsForm"
import { InvoicePreview } from "./components/invoice/preview/InvoicePreview"
import { InvoiceSchema, type InvoiceData } from "./types/invoice"
import { useInvoiceStorage } from "./hooks/useInvoiceStorage"

import { Button } from "./components/ui/button"
import { Download, Save, Trash } from "lucide-react"

const defaultValues: InvoiceData = {
  billerName: "",
  billerAddress: "",
  billerEmail: "",
  clientName: "",
  clientAddress: "",
  clientEmail: "",
  invoiceNumber: "",
  issueDate: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  items: [{ id: "1", description: "", quantity: 1, unitPrice: 0 }],
  notes: "",
  taxRate: 0,
  discountRate: 0,
}

function MainContent() {
  const { initialData, saveDraft, clearDraft } = useInvoiceStorage(defaultValues)
  
  const methods = useForm<InvoiceData>({
    resolver: zodResolver(InvoiceSchema) as any,
    defaultValues: initialData as any,
  })

  // Watch for changes to update local storage
  const formData = useWatch({ control: methods.control }) as unknown as InvoiceData;
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    methods.reset(initialData)
  }, [initialData, methods])

  const onSubmit = (data: unknown) => {
    saveDraft(data as InvoiceData)
    alert("Draft saved to localStorage!");
  }

  const handleDownloadPDF = () => {
    if (!printRef.current) return
    const element = printRef.current
    const opt: any = {
      margin:       0,
      filename:     `Invoice-${formData.invoiceNumber || 'draft'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    }
    
    // Check if valid before downloading
    methods.trigger().then((isValid) => {
      if (isValid) {
        html2pdf().set(opt).from(element).save()
      } else {
        alert("Please fix form validation errors before exporting.")
      }
    })
  }

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your draft? This cannot be undone.")) {
      clearDraft()
      methods.reset(defaultValues)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 font-sans text-slate-900 pb-20 selection:bg-primary/20">
      <div className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm sticky top-0 z-50 px-4 py-4 md:px-8 transition-all">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Modern Invoice</h1>
            <p className="text-slate-500 text-sm mt-1">Create, preview, and download professional invoices</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="outline" onClick={handleClear} className="w-full sm:w-auto">
              <Trash className="mr-2 h-4 w-4" /> Clear
            </Button>
            <Button type="button" variant="outline" onClick={() => methods.handleSubmit(onSubmit)()} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button type="button" onClick={handleDownloadPDF} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" /> PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-4 md:p-8 mt-4">
        <FormProvider {...methods}>
          <form className="grid grid-cols-1 gap-12 lg:grid-cols-12" onSubmit={methods.handleSubmit(onSubmit)}>
            {/* Left Panel: Form */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
              <div className="rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-md p-6 sm:p-8 shadow-xl shadow-slate-200/40 space-y-8">
                <BillerForm />
                <ClientForm />
                <InvoiceMetaForm />
                <LineItemsForm />
              </div>
            </div>

            {/* Right Panel: Preview */}
            <div className="lg:col-span-7">
              <div className="sticky top-32 rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-2xl shadow-indigo-100/50 overflow-hidden min-h-[842px] max-w-[794px] mx-auto transition-all">
                <InvoicePreview ref={printRef} data={formData || defaultValues} />
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}

function App() {
  return <MainContent />
}

export default App
