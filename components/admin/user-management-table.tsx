"use client"

import { useState, useMemo } from "react"
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    MoreVertical,
    ShieldCheck,
    ShieldX,
    UserCheck,
    UserMinus,
    UserPlus,
    Search,
    Mail,
    Building2,
    MapPin,
    Clock,
    Loader2,
    ArrowUpCircle,
    AlertTriangle
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSupabase } from "@/hooks/useSupabase"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { updateUserStatus, promoteUserRole, softDeleteUser } from "@/lib/admin-actions"

interface Profile {
    id: string
    full_name: string
    email: string
    role: 'admin' | 'user'
    verification_status: string
    account_status: 'pending' | 'active' | 'suspended' | 'rejected'
    facility_type: string
    zone: string
    is_approved: boolean
    last_activity: string
    created_at: string
}

export function UserManagementTable() {
    const { data: profiles, loading } = useSupabase<Profile>("profiles")
    const [searchTerm, setSearchTerm] = useState("")
    const [filterRole, setFilterRole] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")

    const filteredUsers = useMemo(() => {
        return profiles.filter(user => {
            const matchesSearch =
                user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesRole = filterRole === "all" || user.role === filterRole
            const matchesStatus = filterStatus === "all" || user.account_status === filterStatus

            return matchesSearch && matchesRole && matchesStatus
        })
    }, [profiles, searchTerm, filterRole, filterStatus])

    const handleUpdateStatus = async (id: string, status: string, isApproved: boolean) => {
        const promise = updateUserStatus(id, status, isApproved)
        toast.promise(promise, {
            loading: 'Synchronizing protocol...',
            success: 'Security state updated.',
            error: 'Authorization failed.'
        })
    }

    const handlePromote = async (id: string, newRole: string) => {
        const promise = promoteUserRole(id, newRole)
        toast.promise(promise, {
            loading: 'Reconfiguring security rank...',
            success: 'Authority rank modified.',
            error: 'elevation denied.'
        })
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Initiate data purge? This action restricts node access permanently.")) return
        const promise = softDeleteUser(id)
        toast.promise(promise, {
            loading: 'Executing data purge...',
            success: 'Node identity purged.',
            error: 'Purge protocol failed.'
        })
    }

    const getStatusBadge = (status: string) => {
        const config: any = {
            active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
            pending: "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse",
            suspended: "bg-red-500/10 text-red-500 border-red-500/20",
            rejected: "bg-slate-500/10 text-slate-500 border-slate-500/20"
        }
        return <Badge variant="outline" className={cn("font-black uppercase text-[10px] tracking-widest", config[status])}>{status}</Badge>
    }

    return (
        <div className="space-y-8">
            {/* Filtering Hub */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-4 border-b border-border/10">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search registry by name, email or node ID..."
                        className="pl-12 h-12 bg-white/5 border-border/50 font-medium text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <select
                        className="h-12 bg-white/5 border border-border/50 rounded-lg px-4 text-xs font-black uppercase tracking-widest outline-none focus:border-primary transition-all"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="all">Any Role</option>
                        <option value="admin">Executive (Admin)</option>
                        <option value="user">Facility Node (User)</option>
                    </select>
                    <select
                        className="h-12 bg-white/5 border border-border/50 rounded-lg px-4 text-xs font-black uppercase tracking-widest outline-none focus:border-primary transition-all"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">Any Security State</option>
                        <option value="active">Operational (Active)</option>
                        <option value="pending">Awaiting Audit (Pending)</option>
                        <option value="suspended">Locked (Suspended)</option>
                    </select>
                </div>
            </div>

            {/* Main Registry Table */}
            <div className="rounded-2xl border border-border shadow-2xl bg-card/60 backdrop-blur-3xl overflow-hidden relative">
                <Table>
                    <TableHeader className="bg-slate-950 dark:bg-white/5">
                        <TableRow className="border-border/30 h-16">
                            <TableHead className="font-black h-16 text-[10px] pl-8 uppercase tracking-widest text-white/50">Node Profile</TableHead>
                            <TableHead className="font-black h-16 text-[10px] uppercase tracking-widest text-white/50">Security Rank</TableHead>
                            <TableHead className="font-black h-16 text-[10px] uppercase tracking-widest text-white/50">Node Zoning</TableHead>
                            <TableHead className="font-black h-16 text-[10px] uppercase tracking-widest text-white/50">Network Status</TableHead>
                            <TableHead className="font-black h-16 text-[10px] uppercase tracking-widest text-white/50 text-right pr-8">Executive Overrides</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <TableRow key={i} className="animate-pulse h-24 border-border/10">
                                    <TableCell colSpan={5} />
                                </TableRow>
                            ))
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-60 text-center opacity-30 select-none grayscale cursor-not-allowed">
                                    <div className="flex flex-col items-center gap-4">
                                        <AlertTriangle className="h-10 w-10 text-primary mb-2 opacity-50" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Zero nodes detected matching the current search criteria.</p>
                                        <p className="text-[10px] font-bold opacity-30 italic">Try recalibrating your search filters in the registry hub.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.map((user) => (
                            <TableRow key={user.id} className="group border-border/30 hover:bg-primary/5 transition-all duration-500 h-24">
                                <TableCell className="pl-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-slate-950 flex items-center justify-center text-primary font-black shadow-lg border border-white/5 relative bg-gradient-to-br from-slate-900 via-slate-950 to-primary/20">
                                            {user.full_name?.[0] || 'U'}
                                            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-lg" title="Profile Synchronized" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-sm uppercase tracking-tight text-foreground flex items-center gap-2">
                                                {user.full_name || 'Anonymous Node'}
                                                {user.is_approved && <ShieldCheck className="h-3 w-3 text-emerald-500" />}
                                            </span>
                                            <div className="flex items-center gap-2 mt-0.5 opacity-40">
                                                <Mail className="h-3 w-3" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{user.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={cn(
                                        "text-[10px] font-black uppercase tracking-widest border-none px-3",
                                        user.role === 'admin' ? "bg-primary/20 text-primary" : "bg-slate-500/10 text-slate-400"
                                    )}>
                                        {user.role} Authority
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1.5 flex flex-col items-start opacity-70 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-3 w-3 text-primary opacity-50" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{user.facility_type} Protocol</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-3 w-3 opacity-30" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{user.zone} Range</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(user.account_status)}
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-white/40 hover:text-white hover:bg-white/10 rounded-xl">
                                                <MoreVertical className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 bg-slate-900/95 backdrop-blur-3xl text-white border-white/5 py-3 p-2 rounded-2xl shadow-3xl">
                                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-3 py-2">Executive Access</DropdownMenuLabel>
                                            <DropdownMenuSeparator className="bg-white/5 mx-2 my-2" />

                                            {user.account_status !== 'active' && (
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, 'active', true)} className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-emerald-500/10 hover:text-emerald-500 focus:bg-emerald-500/10 focus:text-emerald-500 transition-colors">
                                                    <UserCheck className="h-4 w-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Verify Profile</span>
                                                </DropdownMenuItem>
                                            )}

                                            {user.account_status === 'active' && (
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, 'suspended', true)} className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-red-500/10 hover:text-red-500 focus:bg-red-500/10 focus:text-red-500 transition-colors">
                                                    <ShieldX className="h-4 w-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Suspend Access</span>
                                                </DropdownMenuItem>
                                            )}

                                            <DropdownMenuItem onClick={() => handlePromote(user.id, user.role === 'admin' ? 'user' : 'admin')} className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors">
                                                {user.role === 'admin' ? <UserMinus className="h-4 w-4" /> : <ArrowUpCircle className="h-4 w-4" />}
                                                <span className="text-[10px] font-black uppercase tracking-widest">{user.role === 'admin' ? 'Demote to User' : 'Elevate to Admin'}</span>
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator className="bg-white/5 mx-2 my-2" />

                                            <DropdownMenuItem onClick={() => handleDelete(user.id)} className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 transition-colors">
                                                <UserMinus className="h-4 w-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Data Purge (Delete)</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between opacity-30 px-2">
                <p className="text-[10px] font-black uppercase tracking-widest">Network population statistics: {filteredUsers.length} synchronized medical nodes</p>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Stable</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Sync: {new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
