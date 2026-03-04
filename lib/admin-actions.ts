"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { revalidatePath } from "next/cache"

async function getAdminClient() {
    const cookieStore = await cookies()
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
            },
        }
    )
}

export async function updateUserStatus(userId: string, status: string, isApproved: boolean) {
    const supabase = await getAdminClient()

    // 1. Verify admin role
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

    if (profile?.role !== 'admin') throw new Error("Executive authority required")

    // 2. Execute update
    const { error } = await supabase
        .from("profiles")
        .update({
            account_status: status,
            is_approved: isApproved,
            verification_status: isApproved ? 'Verified' : 'Rejected'
        } as any)
        .eq("id", userId)

    if (error) throw error

    // 3. Log action
    await supabase.rpc('log_admin_action', {
        action_type: 'UPDATE_USER_STATUS',
        target_type: 'PROFILE',
        target_id: userId,
        metadata: { status, isApproved }
    })

    revalidatePath('/admin/users')
    revalidatePath('/admin/approvals')
    return { success: true }
}

export async function promoteUserRole(userId: string, newRole: string) {
    const supabase = await getAdminClient()

    const { error } = await supabase
        .from("profiles")
        .update({ role: newRole } as any)
        .eq("id", userId)

    if (error) throw error

    await supabase.rpc('log_admin_action', {
        action_type: 'PROMOTE_ROLE',
        target_type: 'PROFILE',
        target_id: userId,
        metadata: { newRole }
    })

    revalidatePath('/admin/users')
    return { success: true }
}

export async function softDeleteUser(userId: string) {
    const supabase = await getAdminClient()

    const { error } = await supabase
        .from("profiles")
        .update({ deleted_at: new Date().toISOString() } as any)
        .eq("id", userId)

    if (error) throw error

    await supabase.rpc('log_admin_action', {
        action_type: 'SOFT_DELETE_USER',
        target_type: 'PROFILE',
        target_id: userId,
        metadata: { deletedAt: new Date().toISOString() }
    })

    revalidatePath('/admin/users')
    return { success: true }
}
