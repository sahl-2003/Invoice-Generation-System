import { useEffect, useRef, useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import html2pdf from "html2pdf.js"

import { BillerForm } from "./components/invoice/form/BillerForm"
import { ClientForm } from "./components/invoice/form/ClientForm"
import { InvoiceMetaForm } from "./components/invoice/form/InvoiceMetaForm"
import { LineItemsForm } from "./components/invoice/form/LineItemsForm"
import { InvoicePreview } from "./components/invoice/preview/InvoicePreview"
import { HistoryPage } from "./components/history/HistoryPage"
import { InvoiceSchema, type InvoiceData } from "./types/invoice"
import { useInvoiceStorage } from "./hooks/useInvoiceStorage"
import { useInvoiceHistory, type SavedInvoice } from "./hooks/useInvoiceHistory"

import { Button } from "./components/ui/button"
import { Download, Save, Trash, Command, Menu, X, CheckCircle } from "lucide-react"

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

function incrementInvoiceNumber(invoiceNumber: string) {
  if (!invoiceNumber) return "1";
  const match = invoiceNumber.match(/(\d+)$/);
  if (match) {
    const numPart = match[1];
    const incrementedNum = (parseInt(numPart, 10) + 1).toString().padStart(numPart.length, '0');
    return invoiceNumber.slice(0, match.index) + incrementedNum;
  }
  return invoiceNumber + "-1";
}

function MainContent() {
  const [activeView, setActiveView] = useState<'dashboard' | 'history'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { initialData, saveDraft, clearDraft } = useInvoiceStorage(defaultValues)
  const { saveToHistory } = useInvoiceHistory()
  
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
    const verifiedData = data as InvoiceData;
    saveDraft(verifiedData);
    saveToHistory(verifiedData);
    alert("Invoice saved to History securely!");
  }

  const handleLoadFromHistory = (invoice: SavedInvoice) => {
    // Strip metadata
    const { id, savedAt, ...cleanData } = invoice;
    methods.reset(cleanData as InvoiceData);
    saveDraft(cleanData as InvoiceData);
    setActiveView('dashboard');
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

  const handleComplete = async () => {
    const isValid = await methods.trigger()
    if (!isValid) {
      alert("Please fix form validation errors before completing.")
      return
    }

    const currentData = methods.getValues() as InvoiceData

    // 1. Save to History
    saveToHistory(currentData)

    // 2. Download PDF
    if (printRef.current) {
      const element = printRef.current
      const opt: any = {
        margin:       0,
        filename:     `Invoice-${currentData.invoiceNumber || 'completed'}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      }
      html2pdf().set(opt).from(element).save()
    }

    // 3. Prepare next invoice details
    const nextInvoiceNumber = incrementInvoiceNumber(currentData.invoiceNumber)
    const nextInvoiceData: InvoiceData = {
      ...defaultValues,
      billerName: currentData.billerName,
      billerAddress: currentData.billerAddress,
      billerEmail: currentData.billerEmail,
      billerPhone: currentData.billerPhone,
      invoiceNumber: nextInvoiceNumber,
    }

    methods.reset(nextInvoiceData)
    saveDraft(nextInvoiceData)
    
    alert(`Invoice completed! Next invoice set to ${nextInvoiceNumber}`)
  }

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your draft? This cannot be undone.")) {
      clearDraft()
      methods.reset(defaultValues)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500/30 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50 flex-none transition-all">
        <div className="mx-auto max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <Command className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Invoify<span className="text-indigo-600">.</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button onClick={() => setActiveView('dashboard')} className={`transition-colors ${activeView === 'dashboard' ? 'text-indigo-600' : 'hover:text-slate-900'}`}>Dashboard</button>
            <button onClick={() => setActiveView('history')} className={`transition-colors ${activeView === 'history' ? 'text-indigo-600' : 'hover:text-slate-900'}`}>History</button>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6 text-slate-700" /> : <Menu className="h-6 w-6 text-slate-700" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-xl absolute w-full left-0 px-6 py-4 flex flex-col gap-4 shadow-xl z-40">
            <button 
              onClick={() => { setActiveView('dashboard'); setIsMobileMenuOpen(false); }} 
              className={`text-left text-lg font-medium py-2 border-b border-slate-100 ${activeView === 'dashboard' ? 'text-indigo-600' : 'text-slate-700'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => { setActiveView('history'); setIsMobileMenuOpen(false); }} 
              className={`text-left text-lg font-medium py-2 ${activeView === 'history' ? 'text-indigo-600' : 'text-slate-700'}`}
            >
              History
            </button>
          </div>
        )}
      </nav>

      {/* Main Context Area */}
      <main className="flex-grow w-full">
        {activeView === 'dashboard' && (
          <>
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-200/50 px-4 pt-12 pb-8 md:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-white pointer-events-none" />
          <div className="mx-auto max-w-7xl relative flex flex-col sm:flex-row justify-between items-end gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">Create New Invoice</h1>
              <p className="text-slate-500 text-base md:text-lg max-w-xl">Fill out the details below to generate a professional PDF instantly. Edits are auto-saved to your draft.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto pb-1 flex-wrap justify-end">
              <Button variant="outline" onClick={handleClear} className="w-full sm:w-auto rounded-xl">
                <Trash className="mr-2 h-4 w-4" /> Clear Draft
              </Button>
              <Button type="button" variant="outline" onClick={() => methods.handleSubmit(onSubmit)()} className="w-full sm:w-auto rounded-xl">
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
              <Button type="button" onClick={handleDownloadPDF} className="w-full sm:w-auto rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 text-white">
                <Download className="mr-2 h-4 w-4" /> Export PDF
              </Button>
              <Button type="button" onClick={handleComplete} className="w-full sm:w-auto rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 text-white">
                <CheckCircle className="mr-2 h-4 w-4" /> Complete
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="mx-auto max-w-7xl p-4 md:p-8 mt-4 md:mt-8">
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
        </>
        )}

        {activeView === 'history' && (
          <div className="mx-auto max-w-7xl p-4 md:p-8 pt-12">
            <HistoryPage onLoadInvoice={handleLoadFromHistory} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/60 mt-12 py-8 flex-none">
        <div className="mx-auto max-w-7xl px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 font-medium">
          <p>© 2026 Invoify Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return <MainContent />
}

export default App
