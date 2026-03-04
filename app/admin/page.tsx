import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import {
    Users,
    Package,
    ArrowRightLeft,
    Building2,
    ShieldAlert,
    CheckCircle,
    TrendingUp,
    Activity,
    Zap,
    Clock,
    XCircle,
    AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const dynamic = 'force-dynamic'

async function getStats() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
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

    const [
        { count: totalUsers },
        { count: pendingApprovals },
        { count: suspendedAccounts },
        { count: totalMedicines },
        { count: activeTransfers },
        { count: lowStockItems }
    ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_approved', false).is('deleted_at', null),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('account_status', 'suspended').is('deleted_at', null),
        supabase.from('medicines').select('*', { count: 'exact', head: true }),
        supabase.from('transfers').select('*', { count: 'exact', head: true }).eq('status', 'requested'),
        supabase.from('medicines').select('*', { count: 'exact', head: true }).lt('current_stock', 10)
    ])

    return {
        totalUsers: totalUsers || 0,
        pendingApprovals: pendingApprovals || 0,
        suspendedAccounts: suspendedAccounts || 0,
        totalMedicines: totalMedicines || 0,
        activeTransfers: activeTransfers || 0,
        lowStockItems: lowStockItems || 0
    }
}

export default async function AdminDashboard() {
    const stats = await getStats()

    return (
        <div className="space-y-12">
            {/* Welcome & Status */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="h-6 px-3 bg-emerald-500/10 text-emerald-500 font-black uppercase text-[9px] tracking-widest border-emerald-500/20">Executive Surveillance Active</Badge>
                        <Badge variant="outline" className="h-6 px-3 bg-primary/10 text-primary font-black uppercase text-[9px] tracking-widest border-primary/20">Operational Sector-G</Badge>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter">Executive Fleet Overview</h1>
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        Aggregated real-time metrics across all synchronized medical nodes.
                    </p>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest opacity-60">
                    <Clock className="h-4 w-4" />
                    Last Ledger Synced: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    title="Total Node Users"
                    value={stats.totalUsers}
                    icon={Users}
                    color="primary"
                    trend="+12% from last cycle"
                />
                <StatCard
                    title="Authorization Queue"
                    value={stats.pendingApprovals}
                    icon={ShieldAlert}
                    color="amber"
                    trend="Needs immediate audit"
                    urgent={stats.pendingApprovals > 0}
                />
                <StatCard
                    title="Suspended Nodes"
                    value={stats.suspendedAccounts}
                    icon={XCircle}
                    color="red"
                    trend="Security restrictions active"
                />
                <StatCard
                    title="Supply Logic Hub"
                    value={stats.activeTransfers}
                    icon={ArrowRightLeft}
                    color="blue"
                    trend="Requests in transit queue"
                />
            </div>

            {/* Secondary Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    title="Global Medicines"
                    value={stats.totalMedicines}
                    icon={Package}
                    color="emerald"
                    trend="Inventory Ledger stable"
                />
                <StatCard
                    title="Depletion Hazards"
                    value={stats.lowStockItems}
                    icon={AlertCircle}
                    color="amber"
                    trend="SKUs below threshold"
                    urgent={stats.lowStockItems > 0}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Situation Analysis */}
                <Card className="xl:col-span-2 border-border shadow-2xl bg-card/60 backdrop-blur-3xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <CardHeader className="pb-8">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 text-primary leading-none">
                                <Zap className="h-4 w-4" />
                                Situational Report
                            </CardTitle>
                            <Badge className="bg-primary text-white font-black uppercase text-[9px]">Live Data</Badge>
                        </div>
                        <CardDescription className="text-xs uppercase font-bold tracking-widest mt-2">Neural Analysis of Grid Stabilization</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            <div className="h-64 rounded-2xl bg-slate-100 dark:bg-white/5 border border-dashed border-border/50 flex flex-col items-center justify-center relative overflow-hidden">
                                <Activity className="h-10 w-10 text-primary opacity-20 absolute top-10 right-10 animate-pulse" />
                                <TrendingUp className="h-16 w-16 text-primary mb-4 opacity-10" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Grid Visualization Module Active</p>
                                <p className="text-[10px] font-bold opacity-30 italic mt-2">Aggregating telemetry from {stats.totalUsers} facilities...</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <SmallInfo icon={CheckCircle} title="Sync Status" value="Desynchronized 0.2ms" color="emerald" />
                                <SmallInfo icon={Building2} title="Active Zones" value="5 Metropolitan Hubs" color="primary" />
                                <SmallInfo icon={Users} title="Current Ops" value="124 Systems Online" color="blue" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Prompt Approval Reminder */}
                <Card className="border-primary/20 shadow-2xl shadow-primary/5 bg-primary/5 backdrop-blur-3xl relative overflow-hidden group">
                    <div className="absolute -right-10 -bottom-10 h-64 w-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                    <CardHeader>
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary">Priority Node Authorization</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-black">
                                {stats.pendingApprovals}
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-black uppercase leading-tight">Unverified Profiles</h3>
                                <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest leading-relaxed">System security currently restricted for these nodes.</p>
                            </div>
                        </div>
                        <Button asChild className="w-full font-black uppercase text-[10px] tracking-widest h-12 shadow-xl shadow-primary/20">
                            <Link href="/admin/approvals">Launch Approval Protocol</Link>
                        </Button>
                        <p className="text-[9px] font-bold text-center opacity-30 uppercase italic">Next system audit scheduled for 04:00 AM</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon: Icon, color, trend, urgent }: any) {
    const colors: any = {
        primary: "text-primary bg-primary/10 border-primary/20",
        amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        red: "text-red-500 bg-red-500/10 border-red-500/20",
        orange: "text-orange-500 bg-orange-500/10 border-orange-500/20"
    }

    return (
        <Card className={cn(
            "border-border/50 shadow-2xl group transition-all duration-500 hover:scale-[1.02] relative overflow-hidden",
            urgent && "ring-2 ring-amber-500/50"
        )}>
            {urgent && <div className="absolute top-0 right-0 h-4 w-4 bg-amber-500 rounded-bl-xl shadow-lg animate-pulse" />}
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">{title}</p>
                    <div className={cn("p-2 rounded-lg", colors[color])}>
                        <Icon className="h-4 w-4" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between">
                    <div className="text-4xl font-black tracking-tighter">{value}</div>
                    <div className="text-[8px] font-bold uppercase tracking-widest opacity-40 mb-1">{trend}</div>
                </div>
            </CardContent>
        </Card>
    )
}

function SmallInfo({ icon: Icon, title, value, color }: any) {
    return (
        <div className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-border/50 shadow-inner group transition-colors hover:border-primary/30">
            <div className="flex items-center gap-2 mb-1">
                <Icon className={cn("h-3 w-3", color === 'primary' ? 'text-primary' : color === 'emerald' ? 'text-emerald-500' : 'text-blue-500')} />
                <span className="text-[8px] font-black uppercase tracking-widest opacity-40">{title}</span>
            </div>
            <p className="text-sm font-black uppercase tracking-tight">{value}</p>
        </div>
    )
}

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
