import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { ArrowRightLeft, Clock, MapPin, Package, ShieldCheck, Search, Filter } from "lucide-react"
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

async function getTransfers() {
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

    const { data: transfers } = await supabase
        .from('transfers')
        .select('*')
        .order('created_at', { ascending: false })

    return transfers || []
}

export default async function AdminTransfersPage() {
    const transfers = await getTransfers()

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="h-6 px-3 bg-blue-500/10 text-blue-500 font-black uppercase text-[9px] tracking-widest border-blue-500/20">Supply Chain Surveillance</Badge>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter">Global Logistics</h1>
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        <ArrowRightLeft className="h-4 w-4 text-primary" />
                        Executive oversight of inter-facility pharmaceutical movements across the synchronized grid.
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-border shadow-2xl bg-card/60 backdrop-blur-3xl overflow-hidden relative">
                <Table>
                    <TableHeader className="bg-slate-950 dark:bg-white/5">
                        <TableRow className="border-border/30 h-16">
                            <TableHead className="font-black h-16 text-[10px] pl-8 uppercase tracking-widest text-white/50">Medicine Asset</TableHead>
                            <TableHead className="font-black h-16 text-[10px] uppercase tracking-widest text-white/50">Transit Route</TableHead>
                            <TableHead className="font-black h-16 text-[10px] uppercase tracking-widest text-white/50">Logistics Status</TableHead>
                            <TableHead className="font-black h-16 text-[10px] uppercase tracking-widest text-white/50">Timestamp</TableHead>
                            <TableHead className="font-black h-16 text-[10px] uppercase tracking-widest text-white/50 text-right pr-8">Priority</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transfers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-60 text-center opacity-30 select-none grayscale">
                                    <ArrowRightLeft className="h-10 w-10 text-primary mb-2 mx-auto opacity-50" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No logistics telemetry detected.</p>
                                </TableCell>
                            </TableRow>
                        ) : transfers.map((tx) => (
                            <TableRow key={tx.id} className="group border-border/30 hover:bg-primary/5 transition-all duration-500 h-24">
                                <TableCell className="pl-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center text-primary font-black shadow-inner">
                                            <Package className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-sm uppercase tracking-tight">{tx.medicine_name}</span>
                                            <span className="text-[10px] font-bold text-primary opacity-60 uppercase">{tx.quantity} units requested</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1.5 py-2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">From:</span>
                                            <span className="text-xs font-black uppercase tracking-tight">{tx.from_facility || 'Unknown Node'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">To:</span>
                                            <span className="text-xs font-black uppercase tracking-tight text-primary">{tx.to_facility || 'Unknown Node'}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={cn(
                                        "font-black uppercase text-[9px] tracking-widest border-none px-3",
                                        tx.status === 'requested' && "bg-amber-500/10 text-amber-500 animate-pulse",
                                        tx.status === 'approved' && "bg-emerald-500/10 text-emerald-500",
                                        tx.status === 'dispatched' && "bg-blue-500/10 text-blue-500",
                                        tx.status === 'received' && "bg-emerald-600/20 text-emerald-400"
                                    )}>
                                        {tx.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase opacity-40">
                                        <Clock className="h-3 w-3" />
                                        {new Date(tx.created_at).toLocaleString()}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <Badge className={cn(
                                        "text-[9px] font-black uppercase tracking-widest",
                                        tx.priority === 'critical' ? "bg-red-600 text-white" : "bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white"
                                    )}>
                                        {tx.priority}
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
