# LendSwift — Multi-Step Loan Application Form

> **AI-Accelerated Innovation Project** | Front-End Engineering | 15-Day Sprint

A production-grade, 8-step multi-step loan application form built with **React 18**, **Zod**, **React Hook Form**, and **Zustand**. Designed to meet RBI-compliant standards for Indian digital lending.

---

## 🚀 Live Demo

> **[Click here to view the deployed app →](https://your-deploy-link.vercel.app)**  
> *(Replace with your Vercel/Netlify URL after deploying)*

---

## ✨ Features

| Feature | Status |
|---|---|
| 8-Step Wizard with progress tracking | ✅ |
| Loan types: Personal, Home, Business | ✅ |
| Zod schema validation with cross-step dependencies | ✅ |
| PAN & Aadhaar verification simulation (1.5s API delay) | ✅ |
| Verhoeff algorithm Aadhaar checksum validation | ✅ |
| PIN code auto-fill (city, state, post office) | ✅ |
| Dynamic employment forms (Salaried / Self-Employed / Business) | ✅ |
| Conditional co-applicant step based on loan type/amount | ✅ |
| Drag-and-drop document upload with client-side image compression | ✅ |
| E-Signature capture (canvas-based) | ✅ |
| Auto-save draft to LocalStorage (AES-256 encrypted via Web Crypto API) | ✅ |
| Draft resume modal on page refresh | ✅ |
| Pre-approval summary with live EMI calculator | ✅ |
| WCAG 2.1 AA accessibility (ARIA, `forwardRef`, semantic HTML) | ✅ |
| Responsive design (mobile-first) | ✅ |

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite 8
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form v7
- **Validation**: Zod v4 (discriminated unions, cross-field `superRefine`)
- **State Management**: Zustand v5 (persistent wizard state)
- **Security**: Web Crypto API (AES-256-GCM) for LocalStorage encryption
- **UI Primitives**: Lucide React icons, `react-dropzone`, `react-signature-canvas`

---

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable: Input, Select, RadioGroup, FileUpload, SignatureCanvas
│   ├── wizard/          # ProgressBar, StepNavigation, Wizard orchestrator
│   └── steps/           # Step1–Step8 components
├── hooks/               # useVerification, usePinCodeLookup, useAutoSave
├── store/               # Zustand store (useFormStore)
└── utils/
    ├── schemas/         # Zod schemas for each step
    ├── validators.js    # PAN format + Aadhaar Verhoeff checksum
    ├── encryption.js    # AES-256-GCM Web Crypto API
    ├── emiCalculator.js # EMI, processing fee, total cost
    └── imageCompression.js  # Canvas API image compression
```

---

## 🏃 Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/lendswift-loan-application.git
cd lendswift-loan-application

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start dev server
npm run dev
```
Open **http://localhost:5173** in your browser.

---

## 🧪 Validation Rules

| Field | Rule |
|---|---|
| PAN | Regex `[A-Z]{5}[0-9]{4}[A-Z]`, entity-type char validates against loan type |
| Aadhaar | 12 digits + Verhoeff checksum algorithm |
| Age | 21–65 years (calculated from DOB) |
| Mobile | 10 digits starting with 6–9 |
| GST | Full 15-character GSTIN regex |
| Personal Loan Amount | ₹50,000 – ₹10,00,000 |
| Home Loan Amount | ₹5,00,000 – ₹5,00,00,000 |
| Business Loan Amount | ₹1,00,000 – ₹2,00,00,000 |

---

## 📋 8-Step Application Flow

1. **Loan Type Selection** — Loan type, amount, tenure, purpose
2. **Personal Information** — Name, DOB, gender, contact
3. **KYC Verification** — PAN + Aadhaar with simulated API verification
4. **Address Details** — Current/permanent address with PIN auto-fill
5. **Employment & Income** — Dynamic fields based on employment type
6. **Co-Applicant** — Conditional step (required for Home Loans & high-value loans)
7. **Document Upload** — Drag-and-drop with auto-compression, E-Signature
8. **Review & Pre-Approval** — EMI summary, declarations, final submission

---

## 🔒 Security Implementation

- Sensitive draft data (PAN, Aadhaar) is encrypted using **AES-256-GCM** (Web Crypto API) before being saved to LocalStorage.
- File objects (documents) are excluded from the persisted draft to avoid LocalStorage quota limits.

---

## 📄 License

MIT — For academic and demonstration purposes.
