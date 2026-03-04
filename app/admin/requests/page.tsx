import { Badge } from "@/components/ui/badge"
import { FileCheck, Activity } from "lucide-react"

export default function AdminRequestsPage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="h-6 px-3 bg-amber-500/10 text-amber-500 font-black uppercase text-[9px] tracking-widest border-amber-500/20">Supply Chain Authorization</Badge>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter">Inventory Sync Requests</h1>
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-primary" />
                        Interpreting supply replenishment and transfer requests from medical facilities.
                    </p>
                </div>
            </div>

            <div className="h-[400px] flex flex-col items-center justify-center bg-card/40 border border-dashed border-border/50 rounded-3xl opacity-50 select-none grayscale cursor-wait animate-pulse">
                <Activity className="h-12 w-12 text-primary mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Request Analysis Module Offline</p>
                <p className="text-[10px] font-bold opacity-30 italic mt-2">Connecting to supply chain ledger...</p>
            </div>
        </div>
    )
}
