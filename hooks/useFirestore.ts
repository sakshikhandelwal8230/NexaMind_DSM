import { useState, useCallback } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  onSnapshot,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useFirestore(collectionName: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add a new document
  const addDocument = useCallback(
    async (data: Record<string, any>) => {
      try {
        setLoading(true);
        setError(null);
        const ref = collection(db, collectionName);
        const docRef = await addDoc(ref, {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return docRef;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  // Update a document
  const updateDocument = useCallback(
    async (docId: string, data: Record<string, any>) => {
      try {
        setLoading(true);
        setError(null);
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, {
          ...data,
          updatedAt: new Date(),
        });
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  // Delete a document
  const deleteDocument = useCallback(
    async (docId: string) => {
      try {
        setLoading(true);
        setError(null);
        const docRef = doc(db, collectionName, docId);
        await deleteDoc(docRef);
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  // Get all documents
  const getDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const ref = collection(db, collectionName);
      const snapshot = await getDocs(ref);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  // Get a single document
  const getDocument = useCallback(
    async (docId: string) => {
      try {
        setLoading(true);
        setError(null);
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return {
            id: docSnap.id,
            ...docSnap.data(),
          };
        }
        return null;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  // Query documents
  const queryDocuments = useCallback(
    async (constraints: QueryConstraint[]) => {
      try {
        setLoading(true);
        setError(null);
        const ref = collection(db, collectionName);
        const q = query(ref, ...constraints);
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  // Real-time subscription to documents
  const subscribeToDocuments = useCallback(
    (callback: (docs: any[]) => void, constraints: QueryConstraint[] = []) => {
      try {
        setError(null);
        const ref = collection(db, collectionName);
        const q = constraints.length > 0 ? query(ref, ...constraints) : ref;
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const docs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          callback(docs);
        });
        return unsubscribe;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [collectionName]
  );

  return {
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument,
    getDocuments,
    getDocument,
    queryDocuments,
    subscribeToDocuments,
  };
}
