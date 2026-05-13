# Modern Invoice Generation System

A dynamic, web-based application that enables users to create, preview, manage, and export professional invoices in real time. It is built using the latest modern web technologies, providing a seamless SaaS-like experience.

## Features

- **Live Invoice Preview**: Instantly see changes as you type in the form.
- **Dynamic Line Items**: Easily add or remove items, with automatic calculation of prices, quantities, subtotal, taxes, and discounts.
- **Local Storage Persistence**: Drafts are automatically saved in local browser storage; you'll never lose work by accidentally refreshing.
- **Form Validation**: Strict validation ensures complete and correct data using Zod schema verification.
- **PDF Export**: Generate A4-optimized, professional-looking PDFs of your invoices directly from the browser.
- **Fully Responsive**: Optimised two-column sticky layout on Desktop that elegantly stacks vertically on mobile devices.

## Tech Stack

- **Frontend Framework:** React + Vite (TypeScript)
- **Styling:** Tailwind CSS
- **Components:** Shadcn/ui elements overlaid with customized minimalist SaaS designs
- **Forms & Validation:** `react-hook-form` and `zod`
- **PDF Export:** `html2pdf.js`
- **Icons:** `lucide-react`
- **Date Formatting:** `date-fns`

## Installation & Setup

1. **Clone or Download** the repository to your local machine.
2. Navigate into the application root directory:
   ```bash
   cd invoice-system
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the application on `http://localhost:5173`.

## File Structure Highlights

- `src/components/invoice/form`: Reusable robust form components handling biller details, client tracking, formatting, and live dynamic tables.
- `src/components/invoice/preview`: Live rendering preview that precisely mimics the final PDF output.
- `src/hooks/useInvoiceStorage.ts`: Small and efficient utility hook that seamlessly handles saving and restoring local form states behind the scenes.
- `src/types/invoice.ts`: Defines exactly the rigorous requirements expected of any invoice submitted through the system.

Enjoy generating modern invoices!
