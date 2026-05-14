# Invoify - Modern Invoice Generation System

Invoify is a premium, high-performance web application designed for fast and professional invoice generation. Built with a focus on aesthetics and user experience, it allows businesses to create, manage, and export invoices in seconds.

## Key Features
- **Auto-Incrementing Invoices**: Automatically manages invoice numbering for a seamless workflow.
- **Smart Completion**: One-click completion that saves to history, generates a PDF, and prepares for the next invoice.
- **Live Preview**: Real-time rendering of the invoice layout as you type.
- **Persistent History**: Securely stores invoice data in local storage for easy retrieval.
- **LKR Currency Support**: Optimized for Sri Lankan Rupee (LKR) transactions.
- **Responsive Design**: Fully mobile-responsive interface with a modern Glassmorphism aesthetic.

## Tech Stack
- **Framework**: React 19 + Vite (TypeScript)
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React
- **PDF Generation**: html2pdf.js
- **Date Handling**: date-fns

## User Interface

### 1. Dashboard & Form
<img width="1163" height="861" alt="dashboard" src="https://github.com/user-attachments/assets/36fba119-5a94-4676-a488-5105cddceb88" />


### 2. Invoice History
<img width="1080" height="441" alt="history" src="https://github.com/user-attachments/assets/baaaa4b0-328d-4975-b2f2-af677789a190" />


## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd invoice-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## Future Improvements
- **Cloud Synchronization**: Integrate a backend (e.g., Supabase or Firebase) for cross-device history sync.
- **User Authentication**: Secure individual accounts for multiple users.
- **Custom Branding**: Allow users to upload logos and define custom brand colors.
- **Multiple Templates**: Add a variety of professional invoice templates.

## Known Limitations
- Data is stored in LocalStorage; clearing browser cache will erase the local history.
- PDF generation is client-side, which may vary slightly across different browsers.

---
Built with ❤️ for professional billing.
