import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { Package, AlertCircle, BarChart3, Clock, Database, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

export const dynamic = 'force-dynamic'

async function getGlobalInventory() {
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

    const { data: inventory } = await supabase
        .from('medicines')
        .select('*, profiles(full_name)')
        .order('name')

    return inventory || []
}

export default async function AdminInventoryPage() {
    const inventory = await getGlobalInventory()

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="h-6 px-3 bg-emerald-500/10 text-emerald-500 font-black uppercase text-[9px] tracking-widest border-emerald-500/20">Executive Oversight Mode</Badge>
                        <Badge variant="outline" className="h-6 px-3 bg-slate-900/10 dark:bg-white/10 text-slate-500 font-black uppercase text-[9px] tracking-widest">Read-Only Surveillance</Badge>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter">Global SKU Monitoring</h1>
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        <Database className="h-4 w-4 text-primary" />
                        Deterministic tracking of every pharmaceutical asset registered across the synchronized medical grid.
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-border shadow-2xl bg-card/60 backdrop-blur-3xl overflow-hidden relative">
                <Table>
                    <TableHeader className="bg-slate-950 dark:bg-white/5">
                        <TableRow className="border-border/30 h-16">
                            <TableHead className="font-black h-16 text-[10px] pl-8 uppercase tracking-widest text-white/50">Pharma Asset</TableHead>
                            <TableHead className="font-black h-16 text-[10px] uppercase tracking-widest text-white/50">Custodian Node</TableHead>
                            <TableHead className="font-black h-16 text-[10px] uppercase tracking-widest text-white/50">Inventory Level</TableHead>
                            <TableHead className="font-black h-16 text-[10px] uppercase tracking-widest text-white/50 text-right pr-8">System Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inventory.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-60 text-center opacity-30 select-none grayscale">
                                    <Package className="h-10 w-10 text-primary mb-2 mx-auto opacity-50" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No medicine telemetry detected.</p>
                                </TableCell>
                            </TableRow>
                        ) : inventory.map((med) => (
                            <TableRow key={med.id} className="group border-border/30 hover:bg-primary/5 transition-all duration-500 h-24">
                                <TableCell className="pl-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center text-primary font-black shadow-inner">
                                            {med.name[0]}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-sm uppercase tracking-tight">{med.name}</span>
                                            <span className="text-[9px] font-bold text-muted-foreground uppercase">{med.category} Protocol · Batch {med.batch_number}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black uppercase tracking-tight">{med.profiles?.full_name || 'Individual Custodian'}</span>
                                        <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest mt-1">Authorized Storage Site</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-end gap-3">
                                        <span className="text-xl font-black">{med.current_stock}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-1">Target: {med.min_threshold}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <Badge variant="outline" className={cn(
                                        "font-black uppercase text-[9px] tracking-widest px-3",
                                        med.current_stock <= med.min_threshold ? "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    )}>
                                        {med.current_stock <= med.min_threshold ? 'Critical Depletion' : 'Nominal Level'}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

import { cn } from "@/lib/utils"
