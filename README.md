<p align="center">
  <img src="public/logo.png" alt="NexaMind Logo" width="120" height="120" />
</p>

<h1 align="center">💊 NexaMind - Drug Monitor System</h1>

<p align="center">
  <strong>Real-time healthcare inventory management powered by AI</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#documentation">Docs</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.0.10-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Firebase-12.8.0-FFCA28?logo=firebase" alt="Firebase" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.1.9-06B6D4?logo=tailwindcss" alt="Tailwind" />
</p>

---

## 📋 Overview

**NexaMind DMS** is a comprehensive drug monitoring and inventory management system designed for healthcare facilities. It provides real-time tracking, AI-powered insights, automated alerts, and emergency protocols to ensure efficient drug management and patient safety.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 **Real-Time Dashboard** | Live inventory monitoring with KPI cards, heatmaps, and health graphs |
| 💊 **Inventory Management** | Track, manage, and sync drug stock levels with AI assistance |
| 🔔 **Smart Alerts** | Automated notifications for low stock, expiry dates, and security |
| 🚨 **Emergency Protocols** | One-click access to emergency procedures |
| 👥 **Role-Based Access** | Admin, User, and Facility roles with custom permissions |
| 🔄 **Medicine Transfers** | Track transfers between facilities in real-time |
| 🤖 **AI Chatbot** | Intelligent assistant for inventory queries |
| 🔐 **Secure Auth** | Firebase authentication with password recovery |
| 🌓 **Theme Support** | Dark/Light mode with persistent preferences |
| ☁️ **Cloud Sync** | Real-time data synchronization via Firebase |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.10 | React Framework (App Router) |
| React | 19.2.0 | UI Library |
| TypeScript | 5.0 | Type Safety |
| Tailwind CSS | 4.1.9 | Styling |
| Radix UI | Latest | Accessible Components |
| Recharts | 2.15.4 | Data Visualization |
| React Hook Form | 7.60.0 | Form Management |
| Zod | 3.25.76 | Validation |

### Backend & Database
| Technology | Purpose |
|------------|---------|
| Firebase Firestore | Real-time NoSQL Database |
| Firebase Auth | Authentication |
| Firebase Storage | File Storage |
| Node.js + Express | Backend API |

### Dev Tools
| Tool | Purpose |
|------|---------|
| ESLint | Code Quality |
| Vercel Analytics | Performance Monitoring |
| date-fns | Date Utilities |
| xlsx | Excel Export |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0+
- **npm** (recommended) or pnpm
- **Firebase** account

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/NexaMind_DSM.git
cd NexaMind_DSM

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Firebase credentials

# 4. Start development server
npm run dev
```

### Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 📁 Project Structure

```
NexaMind_DSM/
│
├── 📂 app/                          # Next.js App Router
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Landing page
│   ├── globals.css                  # Global styles
│   │
│   ├── 📂 dashboard/                # Dashboard Module
│   │   ├── page.tsx                 # Main dashboard
│   │   ├── layout.tsx               # Dashboard layout
│   │   ├── admin/                   # Admin views
│   │   ├── user/                    # User views
│   │   ├── profile/                 # Profile management
│   │   └── settings/                # App settings
│   │
│   ├── 📂 inventory/                # Inventory Module
│   │   ├── page.tsx                 # Inventory management
│   │   └── firebase-sync-page.tsx   # Real-time sync
│   │
│   ├── 📂 alerts/                   # Alert System
│   ├── 📂 transfers/                # Medicine Transfers
│   ├── 📂 providers/                # Context Providers
│   ├── 📂 api/                      # API Routes
│   │
│   └── 📂 (auth)/                   # Auth Pages
│       ├── login/
│       ├── signup/
│       ├── forgot-password/
│       └── security/
│
├── 📂 components/                   # React Components
│   ├── 📂 auth/                     # Auth Components
│   │   ├── auth-guard.tsx
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx
│   │   └── forgot-password-form.tsx
│   │
│   ├── 📂 dashboard/                # Dashboard Widgets (25+)
│   │   ├── sidebar.tsx
│   │   ├── kpi-cards.tsx
│   │   ├── inventory-table.tsx
│   │   ├── alerts-panel.tsx
│   │   ├── ai-chatbot.tsx
│   │   └── ...
│   │
│   ├── 📂 landing/                  # Landing Page
│   │   ├── hero-section.tsx
│   │   ├── features-section.tsx
│   │   └── ...
│   │
│   ├── 📂 layout/                   # Layout Components
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   │
│   ├── 📂 providers/                # Theme & Context
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   │
│   ├── 📂 shared/                   # Shared Components
│   │
│   └── 📂 ui/                       # UI Library (55+)
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ...
│
├── 📂 hooks/                        # Custom Hooks
│   ├── useAuth.ts                   # Authentication
│   ├── useFirestore.ts              # Database CRUD
│   ├── useFirebaseStorage.ts        # File Storage
│   ├── use-toast.ts                 # Notifications
│   └── use-mobile.ts                # Responsive
│
├── 📂 lib/                          # Utilities
│   ├── firebase.ts                  # Firebase Config
│   ├── firebaseSchema.ts            # DB Schema
│   ├── types.ts                     # TypeScript Types
│   └── utils.ts                     # Helpers
│
├── 📂 backend/                      # Backend Server
│   ├── index.js                     # Express Entry
│   └── package.json
│
├── 📂 docs/                         # Documentation
│   ├── README_FIREBASE.md
│   ├── FIREBASE_SETUP.md
│   └── ... (20+ guides)
│
├── 📂 public/                       # Static Assets
├── 📂 styles/                       # Additional Styles
│
└── ⚙️ Config Files
    ├── .env.local                   # Environment (private)
    ├── .env.local.example           # Environment template
    ├── package.json                 # Dependencies
    ├── tsconfig.json                # TypeScript
    ├── next.config.mjs              # Next.js
    ├── postcss.config.mjs           # PostCSS
    └── components.json              # shadcn/ui
```

---

## 🔥 Firebase Integration

### Custom Hooks

```typescript
// Database Operations
import { useFirestore } from '@/hooks/useFirestore';
const { documents, addDocument, updateDocument, deleteDocument } = useFirestore('medicines');

// Authentication
import { useAuth } from '@/hooks/useAuth';
const { user, login, logout, signup } = useAuth();

// File Storage
import { useFirebaseStorage } from '@/hooks/useFirebaseStorage';
const { uploadFile, deleteFile } = useFirebaseStorage();
```

### Real-Time Features
- ✅ Instant data sync across all devices
- ✅ Offline support with automatic reconnection
- ✅ Automatic timestamps (createdAt, updatedAt)
- ✅ Role-based security rules

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full access: users, inventory, settings, emergency |
| **User** | Dashboard, assigned inventory, alerts |
| **Facility** | Facility-specific access, transfer management |

---

## 📖 Documentation

Detailed documentation is available in the `/docs` folder:

| Document | Description |
|----------|-------------|
| [README_FIREBASE.md](docs/README_FIREBASE.md) | Firebase setup guide |
| [FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md) | Step-by-step setup |
| [FIREBASE_DATA_FLOW.md](docs/FIREBASE_DATA_FLOW.md) | Data flow diagrams |
| [REAL_TIME_SYNC_GUIDE.md](docs/REAL_TIME_SYNC_GUIDE.md) | Sync implementation |

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

Proprietary - Developed for **Drug Monitor System Hackathon**

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Firebase](https://firebase.google.com/) - Backend Services
- [Radix UI](https://www.radix-ui.com/) - Accessible Components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Lucide](https://lucide.dev/) - Icons
- [Recharts](https://recharts.org/) - Charts

---

<p align="center">
  <strong>NexaMind DMS</strong> - Empowering Healthcare with Smart Drug Management
  <br />
  <sub>Version 0.1.0 • February 2026</sub>
</p>
