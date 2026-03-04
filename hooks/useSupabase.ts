import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useSupabase<T extends Record<string, any>>(tableName: string) {
    const [data, setData] = useState<T[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    // Internal fetcher
    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            const { data: result, error } = await supabase
                .from(tableName)
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setData(result as T[])
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [tableName])

    // Auto-subscribe and fetch on mount
    useEffect(() => {
        fetchData()

        const channel: RealtimeChannel = supabase
            .channel(`public:${tableName}:changes`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: tableName },
                () => {
                    fetchData()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [tableName, fetchData])

    // CREATE
    const insert = useCallback(
        async (item: Partial<T>) => {
            try {
                setLoading(true)
                setError(null)
                const { data: result, error } = await supabase
                    .from(tableName)
                    .insert(item)
                    .select()
                    .single()
                if (error) throw error
                return result as T
            } catch (err: any) {
                setError(err.message)
                throw err
            } finally {
                setLoading(false)
            }
        },
        [tableName]
    )

    // READ ALL (manual trigger)
    const getAll = useCallback(async () => {
        await fetchData()
        return data
    }, [fetchData, data])

    // READ ONE
    const getById = useCallback(
        async (id: string) => {
            try {
                setLoading(true)
                setError(null)
                const { data: result, error } = await supabase
                    .from(tableName)
                    .select('*')
                    .eq('id', id)
                    .single()
                if (error) throw error
                return result as T
            } catch (err: any) {
                setError(err.message)
                throw err
            } finally {
                setLoading(false)
            }
        },
        [tableName]
    )

    // UPDATE
    const update = useCallback(
        async (id: string, item: Partial<T>) => {
            try {
                setLoading(true)
                setError(null)
                const { data: result, error } = await supabase
                    .from(tableName)
                    .update(item)
                    .eq('id', id)
                    .select()
                    .single()
                if (error) throw error
                return result as T
            } catch (err: any) {
                setError(err.message)
                throw err
            } finally {
                setLoading(false)
            }
        },
        [tableName]
    )

    // DELETE
    const remove = useCallback(
        async (id: string) => {
            try {
                setLoading(true)
                setError(null)
                const { error } = await supabase
                    .from(tableName)
                    .delete()
                    .eq('id', id)
                if (error) throw error
            } catch (err: any) {
                setError(err.message)
                throw err
            } finally {
                setLoading(false)
            }
        },
        [tableName]
    )

    // QUERY with filters
    const query = useCallback(
        async (filters: { column: string; operator: string; value: any }[]) => {
            try {
                setLoading(true)
                setError(null)
                let queryBuilder = supabase.from(tableName).select('*')
                for (const filter of filters) {
                    queryBuilder = queryBuilder.filter(filter.column, filter.operator, filter.value)
                }
                const { data: result, error } = await queryBuilder
                if (error) throw error
                return result as T[]
            } catch (err: any) {
                setError(err.message)
                throw err
            } finally {
                setLoading(false)
            }
        },
        [tableName]
    )

    // REALTIME SUBSCRIPTION (Legacy support, though internal effect handles most cases now)
    const subscribe = useCallback(
        (callback: (data: T[]) => void): (() => void) => {
            const channel: RealtimeChannel = supabase
                .channel(`${tableName}_custom_sub`)
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: tableName },
                    async () => {
                        const { data: result } = await supabase
                            .from(tableName)
                            .select('*')
                            .order('created_at', { ascending: false })
                        if (result) callback(result as T[])
                    }
                )
                .subscribe()

            return () => {
                supabase.removeChannel(channel)
            }
        },
        [tableName]
    )

    return {
        data,
        loading,
        error,
        insert,
        getAll,
        getById,
        update,
        remove,
        query,
        subscribe,
    }
}
