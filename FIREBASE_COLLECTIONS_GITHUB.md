# 🔄 Firebase Collections Management - GitHub Integration

## How to Create & Change Firebase Collections from Your GitHub Project

---

## 📌 OVERVIEW

You can manage your Firebase collections in multiple ways:

1. **Manual:** Create collections directly in Firebase Console (easiest, no code)
2. **Automatic:** Create collections from your code using initialization scripts
3. **Hybrid:** Store schema definition in GitHub, initialize from code

**Best Practice:** Store your collection schema in GitHub, initialize from code → syncs automatically

---

## 🎯 SOLUTION 1: Manual Collections (Simplest)

### How to Create Collections in Firebase Console:

1. Go to: https://console.firebase.google.com
2. Click: NexaMind_DSM project
3. Click: **Firestore Database** (left sidebar)
4. Click: **+ Start collection**
5. Name: `medicines`
6. Add first document (optional)
7. Add fields
8. Repeat for other collections

### Collections You Need:

```
medicines/
├─ name (text)
├─ dosage (text)
├─ quantity (number)
├─ expiryDate (date)
└─ createdAt (timestamp)

users/
├─ email (text)
├─ name (text)
├─ role (text)
├─ createdAt (timestamp)
└─ lastLogin (timestamp)

alerts/
├─ title (text)
├─ message (text)
├─ severity (text)
├─ read (boolean)
└─ createdAt (timestamp)
```

**Problem:** Changes not tracked in GitHub

---

## 🔥 SOLUTION 2: Create Collections from Code (RECOMMENDED)

### Step 1: Create Initialization Script

Create a new file: `lib/firebaseInit.ts`

```typescript
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

// Initialize collections with default data
export async function initializeCollections() {
  try {
    console.log('Initializing Firebase collections...');
    
    // Initialize medicines collection
    await initializeMedicines();
    
    // Initialize users collection
    await initializeUsers();
    
    // Initialize alerts collection
    await initializeAlerts();
    
    console.log('✅ Collections initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing collections:', error);
  }
}

// Initialize medicines collection
async function initializeMedicines() {
  const medicinesRef = collection(db, 'medicines');
  const snapshot = await getDocs(medicinesRef);
  
  // Only initialize if collection is empty
  if (snapshot.empty) {
    console.log('Creating medicines collection...');
    
    const defaultMedicines = [
      {
        name: 'Aspirin',
        dosage: '500mg',
        quantity: 100,
        expiryDate: new Date('2025-12-31'),
        createdAt: new Date(),
        manufacturer: 'Bayer',
        batchNumber: 'BATCH001'
      },
      {
        name: 'Ibuprofen',
        dosage: '400mg',
        quantity: 50,
        expiryDate: new Date('2025-11-30'),
        createdAt: new Date(),
        manufacturer: 'Pfizer',
        batchNumber: 'BATCH002'
      },
      {
        name: 'Paracetamol',
        dosage: '500mg',
        quantity: 200,
        expiryDate: new Date('2026-01-31'),
        createdAt: new Date(),
        manufacturer: 'GSK',
        batchNumber: 'BATCH003'
      }
    ];
    
    for (const medicine of defaultMedicines) {
      await setDoc(doc(medicinesRef), medicine);
    }
    
    console.log('✅ Medicines collection created with default data');
  }
}

// Initialize users collection
async function initializeUsers() {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  
  if (snapshot.empty) {
    console.log('Creating users collection...');
    
    const defaultUsers = [
      {
        email: 'admin@nexamind.com',
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date(),
        lastLogin: new Date()
      },
      {
        email: 'pharmacist@nexamind.com',
        name: 'Pharmacist User',
        role: 'pharmacist',
        createdAt: new Date(),
        lastLogin: new Date()
      }
    ];
    
    for (const user of defaultUsers) {
      await setDoc(doc(usersRef), user);
    }
    
    console.log('✅ Users collection created with default data');
  }
}

// Initialize alerts collection
async function initializeAlerts() {
  const alertsRef = collection(db, 'alerts');
  const snapshot = await getDocs(alertsRef);
  
  if (snapshot.empty) {
    console.log('Creating alerts collection...');
    
    const defaultAlerts = [
      {
        title: 'Low Stock Warning',
        message: 'Aspirin stock is running low (100 units left)',
        severity: 'warning',
        read: false,
        createdAt: new Date()
      },
      {
        title: 'Expiry Alert',
        message: 'Paracetamol batch BATCH003 will expire soon',
        severity: 'info',
        read: false,
        createdAt: new Date()
      }
    ];
    
    for (const alert of defaultAlerts) {
      await setDoc(doc(alertsRef), alert);
    }
    
    console.log('✅ Alerts collection created with default data');
  }
}
```

### Step 2: Call Initialization When App Starts

Edit: `app/providers.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { initializeCollections } from '@/lib/firebaseInit';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Firebase collections on app startup
    initializeCollections();
  }, []);

  return <>{children}</>;
}
```

### Step 3: Collections are Now Version-Controlled in GitHub! ✅

```
Your GitHub Project:
├── lib/
│   ├── firebase.ts (Firebase config)
│   └── firebaseInit.ts (Collection definitions) ← HERE!
├── app/
│   └── providers.tsx (Calls initialization)
└── .gitignore (includes .env.local)
```

---

## 📝 SOLUTION 3: Store Schema Definition in GitHub

### Step 1: Create Schema File

Create: `lib/firebaseSchema.ts`

```typescript
// Define your collection schema
export const FIRESTORE_SCHEMA = {
  collections: {
    medicines: {
      name: 'medicines',
      description: 'Medicine inventory',
      fields: {
        name: 'string',
        dosage: 'string',
        quantity: 'number',
        expiryDate: 'timestamp',
        manufacturer: 'string',
        batchNumber: 'string',
        createdAt: 'timestamp',
        updatedAt: 'timestamp'
      }
    },
    users: {
      name: 'users',
      description: 'User accounts',
      fields: {
        email: 'string',
        name: 'string',
        role: 'string', // admin, pharmacist, user
        phone: 'string',
        active: 'boolean',
        createdAt: 'timestamp',
        lastLogin: 'timestamp'
      }
    },
    alerts: {
      name: 'alerts',
      description: 'System alerts and notifications',
      fields: {
        title: 'string',
        message: 'string',
        severity: 'string', // info, warning, error, critical
        read: 'boolean',
        userId: 'string',
        createdAt: 'timestamp',
        resolvedAt: 'timestamp'
      }
    }
  }
};

// Export for reference in code
export type FirebaseSchema = typeof FIRESTORE_SCHEMA;
```

### Step 2: Use Schema in Your Code

Now your schema is version-controlled in GitHub! ✅

```typescript
import { FIRESTORE_SCHEMA } from '@/lib/firebaseSchema';

// Use the schema to validate data
const medicineSchema = FIRESTORE_SCHEMA.collections.medicines;
console.log('Medicine fields:', medicineSchema.fields);
```

---

## 🔄 SOLUTION 4: Complete GitHub Integration Workflow

### Step 1: Store Everything in GitHub

```
Your GitHub Repo:
├── lib/
│   ├── firebase.ts (Config)
│   ├── firebaseInit.ts (Collection initialization)
│   ├── firebaseSchema.ts (Schema definition)
│   └── firestoreRules.ts (Security rules)
├── scripts/
│   └── initializeFirebase.js (Manual setup script)
├── docs/
│   └── FIREBASE_COLLECTIONS.md (Documentation)
└── .env.local.example (Environment template)
```

### Step 2: Create Manual Setup Script

Create: `scripts/initializeFirebase.js`

```javascript
// Run this manually if needed: node scripts/initializeFirebase.js
// This initializes collections in Firebase without starting the app

const admin = require('firebase-admin');

// Initialize Firebase Admin (requires credentials)
const serviceAccount = require('../firebaseServiceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initializeCollections() {
  try {
    console.log('🚀 Starting Firebase collection initialization...\n');

    // Initialize medicines
    await initializeMedicines();
    
    // Initialize users
    await initializeUsers();
    
    // Initialize alerts
    await initializeAlerts();

    console.log('\n✅ All collections initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

async function initializeMedicines() {
  console.log('📦 Creating medicines collection...');
  
  const medicines = [
    { name: 'Aspirin', dosage: '500mg', quantity: 100 },
    { name: 'Ibuprofen', dosage: '400mg', quantity: 50 },
    { name: 'Paracetamol', dosage: '500mg', quantity: 200 }
  ];

  for (const medicine of medicines) {
    await db.collection('medicines').add(medicine);
  }
  
  console.log('✅ Medicines collection ready');
}

async function initializeUsers() {
  console.log('👥 Creating users collection...');
  
  const users = [
    { email: 'admin@nexamind.com', name: 'Admin', role: 'admin' }
  ];

  for (const user of users) {
    await db.collection('users').add(user);
  }
  
  console.log('✅ Users collection ready');
}

async function initializeAlerts() {
  console.log('🔔 Creating alerts collection...');
  
  const alerts = [
    { title: 'System Ready', message: 'System initialized', severity: 'info' }
  ];

  for (const alert of alerts) {
    await db.collection('alerts').add(alert);
  }
  
  console.log('✅ Alerts collection ready');
}

initializeCollections();
```

### Step 3: Document Collections in GitHub

Create: `docs/FIREBASE_COLLECTIONS.md`

```markdown
# Firebase Collections

## medicines
- Purpose: Store medicine inventory
- Fields: name, dosage, quantity, expiryDate, manufacturer

## users
- Purpose: Store user accounts
- Fields: email, name, role, phone, active

## alerts
- Purpose: Store system alerts
- Fields: title, message, severity, read, userId
```

---

## ✅ WORKFLOW: Making Changes to Collections

### When you want to change a collection:

1. **Edit the schema file** in GitHub:
   ```
   lib/firebaseSchema.ts ← Update this
   ```

2. **Update initialization logic**:
   ```
   lib/firebaseInit.ts ← Update this
   ```

3. **Push to GitHub**:
   ```
   git add .
   git commit -m "Updated medicines collection schema"
   git push origin main
   ```

4. **Changes apply automatically** when:
   - You restart your dev server
   - You deploy to production
   - Team members pull the changes

### Example: Adding a New Field

**Before:**
```typescript
// firebaseSchema.ts
medicines: {
  name: 'string',
  dosage: 'string',
  quantity: 'number'
}
```

**After:**
```typescript
// firebaseSchema.ts
medicines: {
  name: 'string',
  dosage: 'string',
  quantity: 'number',
  price: 'number'  // ← NEW FIELD
}
```

**Push to GitHub:**
```
git add lib/firebaseSchema.ts
git commit -m "Added price field to medicines collection"
git push
```

**Automatic:** When anyone pulls from GitHub and restarts, the new field is there! ✅

---

## 📊 Comparison: All Solutions

| Solution | Effort | GitHub Tracked | Automatic | Best For |
|----------|--------|----------------|-----------|----------|
| **Manual (Console)** | Very Low | ❌ No | ❌ No | Quick testing |
| **Code Init** | Medium | ✅ Yes | ✅ Yes | Production |
| **Schema File** | Medium | ✅ Yes | ✅ Yes | Documentation |
| **Complete Setup** | High | ✅ Yes | ✅ Yes | Professional |

---

## 🎯 RECOMMENDED: Step-by-Step Setup

### 1. Create Schema File (5 minutes)
```
Create: lib/firebaseSchema.ts
Define all collections and fields
```

### 2. Create Initialization Script (10 minutes)
```
Create: lib/firebaseInit.ts
Add initialization logic
```

### 3. Call on App Start (2 minutes)
```
Edit: app/providers.tsx
Add initializeCollections() call
```

### 4. Push to GitHub (2 minutes)
```
git add lib/firebaseInit.ts lib/firebaseSchema.ts
git commit -m "Add Firebase collections initialization"
git push origin main
```

### 5. Verify in Firebase Console (2 minutes)
```
Open: console.firebase.google.com
Check: Collections appear automatically ✅
```

**Total Time: ~20 minutes** ✅

---

## 🔐 Security: Protect Your Data

### Add to .env.local:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
# DON'T put sensitive data here
```

### Add to .gitignore:
```
.env.local
firebaseServiceAccountKey.json
```

### These stay private, not in GitHub ✅

---

## 🚀 When You Deploy

1. **Push your code to GitHub** (with schema + init)
2. **Deploy to hosting** (Vercel, Firebase Hosting, etc.)
3. **Collections auto-initialize** on first app load ✅
4. **Your database is live** with exactly the structure you defined

---

## 💡 Pro Tips

### Tip 1: Use Environment Variables for Init
```typescript
if (process.env.NODE_ENV === 'development') {
  // Only initialize in development
  await initializeCollections();
}
```

### Tip 2: Make Initialization Idempotent
```typescript
// Check if data already exists before creating
if (snapshot.empty) {
  // Only initialize once
  await setDoc(doc(medicinesRef), medicine);
}
```

### Tip 3: Use Version Numbers
```typescript
export const COLLECTIONS_VERSION = '1.0.0';

// In your code
console.log('Using Firebase schema v' + COLLECTIONS_VERSION);
```

### Tip 4: Document Everything
```
Each collection should have:
- Purpose
- Fields (name, type, required/optional)
- Example document
- Access rules
```

---

## ✅ SUMMARY

### How to Make Collections That Sync with GitHub:

1. **Define schema in code** (`firebaseSchema.ts`)
2. **Create initialization script** (`firebaseInit.ts`)
3. **Call on app startup** (`providers.tsx`)
4. **Push to GitHub** (all tracked!)
5. **Collections auto-create** when app runs ✅

**Everything is version-controlled, traceable, and repeatable!** 🎉

---

## 🎓 Next: Manage Collections Like a Pro

- [Version control your collections](./FIREBASE_COLLECTIONS.md)
- [Security rules for production](./FIREBASE_RULES.md)
- [Backup and restore collections](./FIREBASE_BACKUP.md)
- [Migrate data between environments](./FIREBASE_MIGRATION.md)

**You're all set! Collections + GitHub = Perfect workflow! 🚀**
