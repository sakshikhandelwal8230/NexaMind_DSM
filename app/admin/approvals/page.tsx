"use client"

import { useMemo } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    CheckCircle,
    XCircle,
    UserCheck,
    UserX,
    ShieldAlert,
    Clock,
    Mail,
    Building2,
    AlertTriangle
} from "lucide-react"
import { useSupabase } from "@/hooks/useSupabase"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Profile {
    id: string
    full_name: string
    email: string
    account_status: 'pending' | 'active' | 'suspended' | 'rejected'
    facility_type: string
    zone: string
    is_approved: boolean
    created_at: string
}

export default function AdminApprovalsPage() {
    const { data: profiles, loading, update } = useSupabase<Profile>("profiles")

    const pendingUsers = useMemo(() => {
        return profiles.filter(user => !user.is_approved || user.account_status === 'pending')
    }, [profiles])

    const handleApprove = async (id: string) => {
        try {
            await update(id, {
                is_approved: true,
                account_status: 'active',
                verification_status: 'Verified'
            } as any)
            toast.success("Node authorized.", {
                description: "Access credentials have been activated for the medical grid."
            })
        } catch (e) {
            toast.error("Authorization failed.")
        }
    }

    const handleReject = async (id: string) => {
        try {
            await update(id, {
                is_approved: false,
                account_status: 'rejected',
                verification_status: 'Rejected'
            } as any)
            toast.error("Node rejected.", {
                description: "Access request has been formally denied."
            })
        } catch (e) {
            toast.error("Rejection protocol failed.")
        }
    }

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="h-6 px-3 bg-amber-500/10 text-amber-500 font-black uppercase text-[9px] tracking-widest border-amber-500/20 animate-pulse">Pending Authorization</Badge>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter">Gateway Approvals</h1>
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-primary" />
                        Validating entry requests for the pharmaceutical surveillance network.
                    </p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-40">
                    Queue Depth: {pendingUsers.length} Nodes
                </div>
            </div>

            <div className="rounded-2xl border border-border shadow-2xl bg-card/60 backdrop-blur-3xl overflow-hidden relative">
                <Table>
                    <TableHeader className="bg-slate-950 dark:bg-white/5">
                        <TableRow className="border-border/30 h-16">
                            <TableHead className="font-black h-16 text-[10px] pl-8 uppercase tracking-widest text-white/50">Applicant Profile</TableHead>
                            <TableHead className="font-black h-16 text-[10px] uppercase tracking-widest text-white/50">Requested Access</TableHead>
                            <TableHead className="font-black h-16 text-[10px] uppercase tracking-widest text-white/50">Timestamp</TableHead>
                            <TableHead className="font-black h-16 text-[10px] uppercase tracking-widest text-white/50 text-right pr-8">Decision</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <TableRow key={i} className="animate-pulse h-24 border-border/10">
                                    <TableCell colSpan={4} />
                                </TableRow>
                            ))
                        ) : pendingUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-60 text-center opacity-30 select-none grayscale cursor-default">
                                    <div className="flex flex-col items-center gap-4">
                                        <CheckCircle className="h-10 w-10 text-emerald-500 mb-2 opacity-50" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Gateway Queue Clear.</p>
                                        <p className="text-[10px] font-bold opacity-30 italic">No nodes are currently awaiting authorization.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : pendingUsers.map((user) => (
                            <TableRow key={user.id} className="group border-border/30 hover:bg-white/5 transition-all duration-500 h-28">
                                <TableCell className="pl-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-2xl bg-slate-950 flex items-center justify-center text-primary font-black shadow-lg border border-white/5 bg-gradient-to-br from-slate-900 to-slate-950">
                                            {user.full_name?.[0] || 'U'}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-sm uppercase tracking-tight text-foreground">{user.full_name || 'New Identity'}</span>
                                            <div className="flex items-center gap-2 mt-0.5 opacity-40">
                                                <Mail className="h-3 w-3" />
                                                <span className="text-[9px] font-bold uppercase tracking-widest">{user.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1.5 flex flex-col items-start">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-3 w-3 text-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{user.facility_type}</span>
                                        </div>
                                        <Badge variant="outline" className="text-[8px] font-black tracking-tighter bg-primary/5 text-primary border-primary/20">{user.zone} Sector</Badge>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 opacity-40">
                                        <Clock className="h-3 w-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(user.created_at).toLocaleDateString()}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <div className="flex justify-end gap-3">
                                        <Button
                                            onClick={() => handleReject(user.id)}
                                            variant="outline"
                                            size="sm"
                                            className="h-10 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white font-black uppercase text-[10px] tracking-widest transition-all"
                                        >
                                            <UserX className="h-3 w-3 mr-2" />
                                            Reject
                                        </Button>
                                        <Button
                                            onClick={() => handleApprove(user.id)}
                                            size="sm"
                                            className="h-10 bg-emerald-600 hover:bg-emerald-700 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-600/20"
                                        >
                                            <UserCheck className="h-3 w-3 mr-2" />
                                            Authorize Node
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
