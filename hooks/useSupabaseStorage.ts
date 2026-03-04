import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useSupabaseStorage(bucketName: string = 'documents') {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [progress, setProgress] = useState(0)
    const supabase = createClient()

    // Upload file
    const uploadFile = useCallback(
        async (filePath: string, file: File) => {
            try {
                setLoading(true)
                setError(null)
                setProgress(0)

                const { data, error } = await supabase.storage
                    .from(bucketName)
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: false,
                    })

                if (error) throw error
                setProgress(100)

                // Get public URL
                const { data: urlData } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(data.path)

                return urlData.publicUrl
            } catch (err: any) {
                setError(err.message)
                throw err
            } finally {
                setLoading(false)
            }
        },
        [bucketName]
    )

    // Get signed URL (for private buckets)
    const getFileUrl = useCallback(
        async (filePath: string, expiresIn: number = 3600) => {
            try {
                setLoading(true)
                setError(null)

                const { data, error } = await supabase.storage
                    .from(bucketName)
                    .createSignedUrl(filePath, expiresIn)

                if (error) throw error
                return data.signedUrl
            } catch (err: any) {
                setError(err.message)
                throw err
            } finally {
                setLoading(false)
            }
        },
        [bucketName]
    )

    // Delete file
    const deleteFile = useCallback(
        async (filePath: string) => {
            try {
                setLoading(true)
                setError(null)

                const { error } = await supabase.storage
                    .from(bucketName)
                    .remove([filePath])

                if (error) throw error
            } catch (err: any) {
                setError(err.message)
                throw err
            } finally {
                setLoading(false)
            }
        },
        [bucketName]
    )

    // List files in a directory
    const listFiles = useCallback(
        async (folderPath: string) => {
            try {
                setLoading(true)
                setError(null)

                const { data, error } = await supabase.storage
                    .from(bucketName)
                    .list(folderPath)

                if (error) throw error
                return data.map((file) => ({
                    name: file.name,
                    fullPath: `${folderPath}/${file.name}`,
                    size: file.metadata?.size,
                    createdAt: file.created_at,
                }))
            } catch (err: any) {
                setError(err.message)
                throw err
            } finally {
                setLoading(false)
            }
        },
        [bucketName]
    )

    return {
        loading,
        error,
        progress,
        uploadFile,
        getFileUrl,
        deleteFile,
        listFiles,
    }
}
