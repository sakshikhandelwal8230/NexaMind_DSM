"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSupabase } from "@/hooks/useSupabase"
import { CheckCircle2, XCircle, Clock, ShieldCheck, Mail, Building2 } from "lucide-react"
import { toast } from "sonner"
import type { Profile } from "@/app/providers/auth-context"

export function ApprovalCenter() {
    const { query, update } = useSupabase<Profile>("profiles")
    const [pendingUsers, setPendingUsers] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)

    const fetchPending = async () => {
        try {
            setLoading(true)
            // Query for users who are NOT approved
            const data = await query([{ column: 'is_approved', operator: 'eq', value: false }])
            setPendingUsers(data)
        } catch (err) {
            console.error("Failed to fetch pending users:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPending()
    }, [])

    const handleApprove = async (user: Profile) => {
        try {
            await update(user.id, {
                is_approved: true,
                account_status: "active"
            })
            toast.success(`Access granted to ${user.full_name}`)
            // Refresh list
            setPendingUsers(prev => prev.filter(u => u.id !== user.id))
        } catch (err: any) {
            toast.error(err.message || "Failed to approve user")
        }
    }

    const handleReject = async (user: Profile) => {
        try {
            await update(user.id, { account_status: "suspended" })
            toast.error(`Registration for ${user.full_name} has been rejected`)
            setPendingUsers(prev => prev.filter(u => u.id !== user.id))
        } catch (err: any) {
            toast.error("Failed to reject user")
        }
    }

    if (loading) return <div>Loading requests...</div>

    return (
        <Card className="border-amber-200/50 bg-amber-50/10 dark:bg-amber-900/5">
            <CardHeader className="pb-3 text-card-foreground">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="h-5 w-5 text-amber-500" />
                            Pending Approvals
                        </CardTitle>
                        <CardDescription>Review and grant access to new facilities</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        {pendingUsers.length} Requests
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {pendingUsers.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground italic text-sm">
                            No pending registration requests.
                        </div>
                    ) : (
                        pendingUsers.map((user) => (
                            <div
                                key={user.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-card border border-border gap-4"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-foreground">{user.organization_name}</span>
                                        <Badge variant="secondary" className="text-[10px] uppercase px-1">{user.role}</Badge>
                                    </div>
                                    <div className="flex flex-col text-xs text-muted-foreground gap-1">
                                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {user.email}</span>
                                        <span className="flex items-center gap-1 font-mono">License: {user.license_number}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => handleReject(user)}
                                    >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Reject
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleApprove(user)}
                                    >
                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                        Give Permission
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
