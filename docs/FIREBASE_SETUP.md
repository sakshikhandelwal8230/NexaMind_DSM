# Firebase Setup Guide for NexaMind DSM

## Overview
Your project is now configured to work with Firebase. This guide will help you set up your Firebase credentials and use the Firebase services.

## Prerequisites
- A Firebase project created at [https://console.firebase.google.com](https://console.firebase.google.com)
- Firebase Authentication enabled
- Firestore Database created
- Realtime Database (optional)
- Cloud Storage enabled (optional)

## Step 1: Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click on Settings (gear icon) → Project Settings
4. Under "General" tab, scroll down to find your Firebase config
5. Copy your configuration values

## Step 2: Set Environment Variables

1. Create a `.env.local` file in your project root (copy from `.env.local.example`)
2. Fill in your Firebase credentials:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
```

**Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. These are safe to expose as Firebase has security rules.

## Step 3: Available Hooks

### useAuth Hook
Manage user authentication.

```typescript
import { useAuth } from '@/hooks/useAuth';

export function MyComponent() {
  const { user, loading, signUp, signIn, signOut, isAuthenticated } = useAuth();

  const handleSignUp = async () => {
    try {
      await signUp('email@example.com', 'password');
    } catch (error) {
      console.error('Sign up failed:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.email}</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={handleSignUp}>Sign Up</button>
      )}
    </div>
  );
}
```

### useFirestore Hook
Manage Firestore database operations.

```typescript
import { useFirestore } from '@/hooks/useFirestore';

export function MedicineList() {
  const { getDocuments, addDocument, deleteDocument, loading, error } = useFirestore('medicines');

  const handleAddMedicine = async () => {
    try {
      await addDocument({
        name: 'Aspirin',
        dosage: '500mg',
        quantity: 100,
      });
    } catch (error) {
      console.error('Add failed:', error);
    }
  };

  return (
    <div>
      <button onClick={handleAddMedicine}>Add Medicine</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

## Firebase Services Available

### Authentication (auth)
```typescript
import { auth } from '@/lib/firebase';
```

### Firestore Database (db)
```typescript
import { db } from '@/lib/firebase';
```

### Cloud Storage (storage)
```typescript
import { storage } from '@/lib/firebase';
```

### Realtime Database (realtimeDb)
```typescript
import { realtimeDb } from '@/lib/firebase';
```

## Firestore Best Practices

### Collection Structure Example
```
medicines/
  {medicineId}/
    name: "Aspirin"
    dosage: "500mg"
    quantity: 100
    createdAt: timestamp
    updatedAt: timestamp

users/
  {userId}/
    email: "user@example.com"
    profile: {...}
    medicines: [medicineIds]
    createdAt: timestamp
```

### Security Rules Example
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own documents
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Allow authenticated users to read medicines
    match /medicines/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

## Common Operations

### Add Document
```typescript
const { addDocument } = useFirestore('medicines');
await addDocument({
  name: 'Medicine Name',
  dosage: '500mg',
  quantity: 100,
});
```

### Update Document
```typescript
const { updateDocument } = useFirestore('medicines');
await updateDocument('medicineId', {
  quantity: 95,
});
```

### Delete Document
```typescript
const { deleteDocument } = useFirestore('medicines');
await deleteDocument('medicineId');
```

### Query Documents
```typescript
import { where } from 'firebase/firestore';
const { queryDocuments } = useFirestore('medicines');
const results = await queryDocuments([
  where('dosage', '==', '500mg'),
  where('quantity', '>', 50),
]);
```

### Real-time Subscription
```typescript
useEffect(() => {
  const { subscribeToDocuments } = useFirestore('medicines');
  const unsubscribe = subscribeToDocuments((docs) => {
    console.log('Medicines updated:', docs);
  });
  return unsubscribe;
}, []);
```

## Testing Firebase Locally

1. Run the development server:
```bash
npm run dev
```

2. Visit `http://localhost:3000`

3. Firebase should automatically connect using your `.env.local` credentials

## Troubleshooting

### "firebaseConfig is not defined"
- Make sure `.env.local` file exists in the project root
- Verify all environment variables are set correctly
- Restart the development server

### Authentication errors
- Check that Authentication is enabled in Firebase Console
- Ensure Email/Password provider is enabled under Authentication → Sign-in method

### Firestore permission denied
- Review your Firestore security rules
- Make sure the current user has permissions for the collection
- In development, you can use permissive rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase CLI](https://firebase.google.com/docs/cli)

## Next Steps

1. Update your environment variables in `.env.local`
2. Enable Firestore Database in Firebase Console
3. Enable Authentication providers
4. Start using the `useAuth` and `useFirestore` hooks in your components
5. Define your Firestore security rules in Firebase Console
