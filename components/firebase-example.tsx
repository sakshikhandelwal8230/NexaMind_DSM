'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFirestore } from '@/hooks/useFirestore';

/**
 * Example component showing how to use Firebase hooks
 * Remove this component after understanding how to use Firebase
 */
export function FirebaseExample() {
  const { user, signIn, signOut, isAuthenticated, loading: authLoading } = useAuth();
  const { addDocument, getDocuments, loading: dbLoading } = useFirestore('medicines');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleAddMedicine = async () => {
    try {
      await addDocument({
        name: 'Sample Medicine',
        dosage: '500mg',
        quantity: 100,
        createdBy: user?.uid,
      });
      alert('Medicine added successfully!');
    } catch (error) {
      console.error('Add medicine error:', error);
    }
  };

  const handleLoadMedicines = async () => {
    try {
      const medicines = await getDocuments();
      console.log('Medicines:', medicines);
      alert('Check console for medicines data');
    } catch (error) {
      console.error('Load medicines error:', error);
    }
  };

  if (authLoading) return <div>Loading auth...</div>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Firebase Example</h2>

      {isAuthenticated ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-sm font-medium text-green-800">
              ✓ Authenticated as: {user?.email}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleAddMedicine}
              disabled={dbLoading}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {dbLoading ? 'Adding...' : 'Add Sample Medicine'}
            </button>

            <button
              onClick={handleLoadMedicines}
              disabled={dbLoading}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {dbLoading ? 'Loading...' : 'Load Medicines'}
            </button>

            <button
              onClick={signOut}
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <button
            onClick={handleSignIn}
            disabled={authLoading}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {authLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-sm text-gray-600">
            Note: Make sure to enable Email/Password authentication in Firebase Console
          </p>
        </div>
      )}
    </div>
  );
}
