# 💊 NexaMind System Manifest
### *The Definitive "Under the Hood" Guide*

This document serves as the **Master Blueprint** for the NexaMind Drug Supply Monitor (DSM), detailing every layer of the architecture, from UI hooks to hidden database triggers and RLS security models.

---

## 🏗️ 1. Core Architecture (The Tech Stack)
- **Frontend**: Next.js 16.0.10 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4.1.9, Radix UI, Shadcn/ui (Industrial High-Contrast Theme)
- **Backend & Persistence**: Supabase (PostgreSQL, Realtime, SSR)
- **Intelligence Layer**: NexaMind AI Core (Rule-based synthesis + Dynamic Insight Generator)

---

## 🔐 2. Security & "Hidden" Guards
### 🛡️ Middleware Layer
The system uses a **Bypass-Resistant Middleware** (`middleware.ts` & `lib/supabase/middleware.ts`) that:
- Refreshes auth sessions on every request to prevent cookie expiration.
- Protects all `/dashboard`, `/inventory`, and `/transfers` routes by default.
- Redirects unauthenticated traffic to `/login` without exposing the underlying folder structure.

### 💂 Auth Guards
We use an `<AuthGuard />` component around all high-security views. 
- **Hidden Feature**: It doesn't just check if you are logged in; it validates your `account_status`. If your profile is "pending" or "suspended", you are locked out even with a valid login.

---

## 🗄️ 3. The "Hidden" Data Lifecycle
### ⚡ Profile Sync (PostgreSQL Triggers)
When a user signs up via Supabase Auth, they do not automatically have a "Profile" record in the public database. 
- **The Hidden Mechanism**: A Postgres Trigger (`public.handle_new_user`) in the database automatically intercepts the Auth sign-up and creates a entry in the `public.profiles` table.
- **Why?**: This allows us to store "hidden" fields like `is_approved`, `role`, and `facility_type` that aren't natively in the Auth module.

### 🚨 Row-Level Security (RLS)
The database is restricted at the row-level. Even if someone got your API key, they could only see data their role allows.
- **Profiles**: You can only read your own profile unless you're an `admin`.
- **Medicines**: Everyone can read stock levels (for coordination), but only `verified` facilities can add or delete them.
- **Transfers**: You can only see transfers that involve your facility.

---

## 🤖 4. NexaMind AI Core Logic
The "Al Intelligence" isn't a Blackbox; it's a **situational analysis engine** located in `components/dashboard/ai-chatbot.tsx` and `inventory-ai-assistant.tsx`.

- **Heuristic Engine**: It scans the live `medicines` table and performs multi-stage logic:
    1. **Stock Depletion Check**: If `current_stock` == 0, it flags a "Critical Shortage".
    2. **Threshold Delta**: It calculates the difference between stock and `min_threshold`.
    3. **Expiration Watch**: Scans `expiry_date` strings and flags anything within 30 days.
- **Hidden Action Trigger**: The AI doesn't just talk; it can "prepare" Draft Transfers. It pre-populates the Transfer Dialog based on detected shortages to minimize human error.

---

## 📡 5. Realtime Hydration Strategy
We don't use simple `fetch` requests for lists. We use the **Unified Realtime Hook** (`hooks/useSupabase.ts`).

- **Under the Hood**:
    1. The hook initiates a `SELECT`.
    2. It then opens a `REALTIME_SUBSCRIBE` channel on that table.
    3. **The Magic**: If another hospital in a different city updates a medicine quantity, your screen updates **instantly** without a refresh. 

---

## 🧬 6. Operational Workflow (Step-by-Step)
1. **Onboarding**: User registers -> Trigger creates Profile -> Status: `pending`.
2. **Administration**: Admin sees user in Registry -> Reviews license -> Set `is_approved` = `true`.
3. **Surveillance**: User logs in -> Middleware allows access -> AI core begins scanning their inventory.
4. **Command**: User identifies shortage -> UI uses `insert` to database -> Realtime notifies the Admin/Warehouse.

---

## 📁 7. Critical File Directory
- `supabase/schema.sql`: The entire database structure + "hidden" triggers and RLS.
- `hooks/useSupabase.ts`: The bridge between Supabase Realtime and the UI.
- `app/providers/auth-context.tsx`: The heart of the session management.
- `components/dashboard/action-center.tsx`: The command UI for bulk operational actions.

---

## 🚩 "The Hidden Things" FAQ
- **Where are the demo files?** Removed. Deleted. Scrubbed.
- **Is the AI really AI?** It uses **Rule-Based Synthesis**. This is more reliable for logistics than LLMs as it is deterministic and mathematically accurate for inventory math.
- **Can an unapproved user see stock?** No. RLS policies explicitly block all `SELECT` on `medicines` until `is_approved` is `true` in your profile.

---
**NexaMind DSM System Manifest - v.4.2.0 (Supabase Partition)**
