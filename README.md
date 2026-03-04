<p align="center">
  <img src="public/logo.png" alt="NexaMind Logo" width="120" height="120" />
</p>

<h1 align="center">💊 NexaMind - Drug Monitor System</h1>

<p align="center">
  <strong>Real-time pharmaceutical surveillance powered by NexaMind AI</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Architecture</a> •
  <a href="#documentation">System Manifest</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.0.10-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Supabase-Realtime-3FCF8E?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.1.9-06B6D4?logo=tailwindcss" alt="Tailwind" />
</p>

---

## 📋 Project State: PRODUCTION READY (Supabase Migrated)

**NexaMind DSM** is a professional drug monitoring and inventory management system. It has been fully migrated from Firebase to **Supabase** to leverage the power of **PostgreSQL**, **Realtime WebSockets**, and **Row Level Security (RLS)**.

> [!IMPORTANT]
> All mock data has been removed. The system now operates exclusively on live pharmaceutical ledgers stored in Supabase.

---

## ✨ Features (Data-Driven)

| Feature | Protocol |
|---------|----------|
| 📊 **High-Fidelity Dashboard** | Live telemetry for KPI cards, inventory health, and stock graphs |
| 💊 **Global Inventory Ledger** | Real-time tracking of 1,000+ medical assets with batch ID surveillance |
| 🚨 **NexaMind AI Core** | Rule-based situational analysis for shortages, expiry, and redistribution |
| 🔄 **Transfer Protocols** | Sub-second inter-facility medicine requests and tracking |
| 🛡️ **Registry Management** | Administrative verification of hospitals, clinics, and pharmacies |
| 🔐 **RLS Security** | Row Level Security ensures data is partitioned by node and role |
| 🌓 **Industrial UI** | Sleek, high-contrast dark-mode theme for operational command |

---

## 🛠️ Tech Stack

### High-Fidelity Frontend
- **Next.js 16.0.10**: App Router architecture with server-side rendering.
- **React 19**: Utilizing the latest concurrent features for smooth transitions.
- **Tailwind CSS 4.1.9**: Modern styling with an industrial high-contrast design system.
- **Recharts**: Advanced data visualization for supply chain health.

### Realtime Backend (Supabase)
- **PostgreSQL**: Robust relational data storage.
- **Database Triggers**: Automated Auth-to-Profile synchronization.
- **Realtime (WebSockets)**: Instant data hydration across all facilities.
- **Auth (SSR)**: Secure cookie-based session management.

---

## 🚀 Getting Started

### 1. Unified Ledger Setup
Ensure you have your Supabase environment variables configured in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 2. Operational Boot
```bash
# Install supply chain modules
npm install

# Initialize development hub
npm run dev
```

---

## 📁 Architecture (The "NexaView" Map)

```
NexaMind_DSM/
│
├── 📂 app/                          # Next.js Command Center
│   ├── layout.tsx                   # System-wide layout
│   ├── page.tsx                     # Landing protocol
│   ├── 📂 dashboard/                # Operational Hub (Auth Guarded)
│   ├── 📂 inventory/                # Supply surveillance
│   ├── 📂 transfers/                # Logistics tracking
│   └── 📂 subscription/             # Licensing HQ
│
├── 📂 components/                   # Intelligence Modules
│   ├── 📂 dashboard/                # Command UI (KPIs, AI Chatbot, Table)
│   ├── 📂 auth/                     # Security guards
│   └── 📂 ui/                       # High-fidelity UI library
│
├── 📂 hooks/                        # Reactive Data Access
│   └── useSupabase.ts               # Core Realtime Hydration Engine
│
├── 📂 lib/                          # System Tools
│   ├── supabase/                    # Client/Server protocols
│   └── utils.ts                     # Utility synthesis
│
└── 📂 supabase/                     
    └── schema.sql                   # Master ledger definition (Hidden logic)
```

---

## 📖 System Manifest (Hidden Things)

For a deep-dive into the "hidden things," including RLS logic, database triggers, and AI reasoning models, please refer to the:
👉 **[SYSTEM_MANIFEST.md](./SYSTEM_MANIFEST.md)**

---

## 👥 Operational Roles

| Rank | Access Level |
|------|-------------|
| **Admin** | Global Registry, Node Verification, Fleet Management |
| **Facility User** | Local Inventory, Transfer Initiation, AI Insights |
| **Warehouse** | Mass Provisioning, Global Stock Surveillance |

---

## 📄 License
Proprietary - Developed for the **NexaMind Pharmaceutical Monitor Initiative**.

---

<p align="center">
  <strong>NexaMind DSM</strong> - Precision Digital Surveillance for Modern Healthcare
  <br />
  <sub>Version 4.2.0 • March 2026</sub>
</p>
