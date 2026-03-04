import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { ShieldCheck, History, User, Activity, Clock, Terminal } from "lucide-react"
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

async function getAuditLogs() {
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

    const { data: logs } = await supabase
        .from('audit_logs')
        .select('*, profiles:actor_id(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(100)

    return logs || []
}

export default async function AdminLogsPage() {
    const logs = await getAuditLogs()

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="h-6 px-3 bg-primary/10 text-primary font-black uppercase text-[9px] tracking-widest border-primary/20">Executive Compliance Hub</Badge>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter">Audit Ledgers</h1>
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        <History className="h-4 w-4 text-primary" />
                        Chronological surveillance of all administrative actions and security protocols executed in Sector-G.
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-border shadow-2xl bg-card/60 backdrop-blur-3xl overflow-hidden relative">
                <Table>
                    <TableHeader className="bg-slate-950 dark:bg-white/5">
                        <TableRow className="border-border/30 h-16">
                            <TableHead className="font-black h-16 text-[10px] pl-8 uppercase tracking-widest text-white/50">Executor Node</TableHead>
                            <TableHead className="font-black h-16 text-[10px] uppercase tracking-widest text-white/50">Protocol Action</TableHead>
                            <TableHead className="font-black h-16 text-[10px] uppercase tracking-widest text-white/50">Target Entity</TableHead>
                            <TableHead className="font-black h-16 text-[10px] uppercase tracking-widest text-white/50">Metadata Analysis</TableHead>
                            <TableHead className="font-black h-16 text-[10px] uppercase tracking-widest text-white/50 text-right pr-8">Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-60 text-center opacity-30 select-none grayscale">
                                    <Terminal className="h-10 w-10 text-primary mb-2 mx-auto opacity-50" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Audit ledgers currently desynchronized.</p>
                                </TableCell>
                            </TableRow>
                        ) : logs.map((log) => (
                            <TableRow key={log.id} className="group border-border/30 hover:bg-primary/5 transition-all duration-500 h-24">
                                <TableCell className="pl-8">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-primary font-black border border-white/5">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-[11px] uppercase tracking-tight">{log.profiles?.full_name || 'System Auto'}</span>
                                            <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest leading-none">{log.profiles?.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-black uppercase text-[10px] tracking-widest border-primary/20 bg-primary/5 text-primary py-1 px-3">
                                        {log.action_type.replace(/_/g, ' ')}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{log.target_type} UUID</span>
                                        <span className="text-[10px] font-bold font-mono tracking-tight">{log.target_id?.slice(0, 13)}...</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="max-w-[200px] truncate text-[10px] font-bold font-mono opacity-50 bg-slate-100 dark:bg-white/5 p-2 rounded-lg border border-border/50">
                                        {JSON.stringify(log.metadata)}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <div className="flex items-center justify-end gap-2 text-[10px] font-bold uppercase opacity-40">
                                        <Clock className="h-3 w-3" />
                                        {new Date(log.created_at).toLocaleString()}
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

import { cn } from "@/lib/utils"
