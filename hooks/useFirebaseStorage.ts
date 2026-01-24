import { useState, useCallback } from 'react';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { storage } from '@/lib/firebase';

export function useFirebaseStorage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Upload file to storage
  const uploadFile = useCallback(
    async (filePath: string, file: File) => {
      try {
        setLoading(true);
        setError(null);
        setProgress(0);

        const storageRef = ref(storage, filePath);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(snapshot.ref);

        setProgress(100);
        return downloadUrl;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Get download URL of a file
  const getFileUrl = useCallback(async (filePath: string) => {
    try {
      setLoading(true);
      setError(null);
      const storageRef = ref(storage, filePath);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a file
  const deleteFile = useCallback(async (filePath: string) => {
    try {
      setLoading(true);
      setError(null);
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // List files in a directory
  const listFiles = useCallback(async (dirPath: string) => {
    try {
      setLoading(true);
      setError(null);
      const dirRef = ref(storage, dirPath);
      const result = await listAll(dirRef);

      const files = await Promise.all(
        result.items.map(async (item) => ({
          name: item.name,
          fullPath: item.fullPath,
          url: await getDownloadURL(item),
        }))
      );

      return files;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    progress,
    uploadFile,
    getFileUrl,
    deleteFile,
    listFiles,
  };
}
