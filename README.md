# BuildEase — Transparent Construction Workforce Platform

[![React 19](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4.0-38BDF8.svg)](https://tailwindcss.com/)
[![ONNX Runtime Web](https://img.shields.io/badge/ONNX_Runtime-WebAssembly-005CED.svg)](https://onnxruntime.ai/)

> **A human-centered workforce management and dispute-free payroll platform engineered specifically for harsh construction environments.**

---

## 🏛️ Academic Affiliation
- **Institution:** Kongu Engineering College (Autonomous), Perundurai, Erode – 638 060
- **Department:** Information Technology
- **Course:** 24ITL32 – Design Thinking Laboratory (Nov 2026)
- **Faculty Guide:** Ms. T. S. Vishnu Priya M.E. (Assistant Professor, Dept of IT)
- **Project Team:**
  - **VIKNESHWARAN N** (Reg No: 25ITR173)
  - **SUSHMITHA T** (Reg No: 25ITR150)
  - **SASTITHARAN C** (Reg No: 25ITR132)
  - **SURIYA K** (Reg No: 25ITR147)

---

## ⚡ Core Problem & Solution

### The Challenge
- **84.2% Fingerprint Scanner Failure:** Caused by abrasive Portland cement, hydrated lime, coarse sand, and physical handling eroding epidermal ridges.
- **71.8% 2G Feature Phone Dominance:** Construction laborers carry basic keypad phones without mobile internet, making smartphone-only apps exclusionary.
- **68% Weekly Wage Disputes:** Reliance on handwritten paper muster rolls leads to lost tea advances, arbitrary hour cuts, and ₹1,150+ monthly losses per worker.
- **10–14% Contractor Payroll Leakage:** Caused by ghost workers and fabricated rosters.

### The BuildEase Innovation
1. **Edge AI Biometric Verification:** Client-side 3-second contactless face scan using **YuNet** (face detection) and **SFace** (128D embeddings) running locally via WebAssembly/ONNX Runtime Web.
2. **Inclusive 2G GSM IVR Gateway:** Dedicated toll-free 1800 number with daily rotating chalkboard gate PINs and 5-language voice feedback (Tamil, Hindi, Marathi, Bengali, Assamese).
3. **Offline-First Resilience:** Client-side **IndexedDB** queue with optimistic background sync for continuous uptime in basement excavations and remote sites.
4. **Transparent Mathematical Payroll Engine:** Statutory formula `Wage = (Rate × Verified Shifts) - Advances`, instant multi-lingual SMS wage slips, and 1-click NEFT batch export.
5. **Human-Centric Fail-Safe:** Ambiguous scans or camera dust glare preserve shifts in supervisor "Pending Review" queue rather than docking wages.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 19, TypeScript 5.5, Vite 6.0, Motion (Framer Motion), Lucide Icons
- **Design System:** Custom Architectural Palette (Deep Charcoal `#252521`, Warm Stone `#D8CCB9`, Antique Bronze `#A77B50`, Soft Ivory `#F4F0E8`)
- **Computer Vision:** ONNX Runtime Web, OpenCV YuNet & SFace models
- **Backend & Storage:** Node.js 22 LTS, Express.js REST APIs, IndexedDB, LocalStorage
- **Telephony & Messaging:** Cloud IVR Webhook Simulator, GSM SMS Template Engine

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Node.js 20 or 22 LTS recommended)
- npm or pnpm

### Installation
```bash
git clone https://github.com/VikneshwaranNv/BuildEase_Project.git
cd BuildEase_Project
npm install
```

### Local Development
```bash
npm run dev
```
Open [http://localhost:5000](http://localhost:5000) or [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
```

---

## 📑 Full Design Thinking Documentation
- **Complete A4 Print-Ready Thesis:** [`BuildEase_Design_Thinking_Report.html`](./BuildEase_Design_Thinking_Report.html) (Exact 1:1 format of the 7-chapter KEC Autonomous report with all 20 embedded design thinking diagrams).
- **Presentation Decks:** Included under root (`.pptx` exercise decks for Customer Interview, User Personas, Low-Fidelity Prototype, and SCAMPER).

---

## 🌍 UN Sustainable Development Goals (SDG) Alignment
- **SDG 8 (Decent Work & Economic Growth):** Eliminates wage theft and ensures full statutory entitlements.
- **SDG 9 (Industry, Innovation & Infrastructure):** Edge AI and offline-first resilient digital infrastructure.
- **SDG 10 (Reduced Inequalities):** 2G feature phone and multi-lingual inclusion for unorganized daily laborers.
