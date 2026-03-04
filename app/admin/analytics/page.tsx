import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp } from "lucide-react"

export default function AdminAnalyticsPage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="h-6 px-3 bg-blue-500/10 text-blue-500 font-black uppercase text-[9px] tracking-widest border-blue-500/20">Supply Intelligence Hive</Badge>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter">System Analytics Hub</h1>
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        Aggregating system performance and medicine distribution logic metrics.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-40 bg-card/60 backdrop-blur-3xl border border-border/50 rounded-2xl flex flex-col items-center justify-center relative group overflow-hidden">
                        <div className="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <TrendingUp className="h-10 w-10 text-primary opacity-10 mb-2" />
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-20">Analytic Telemetry Offline</p>
                        <p className="text-[8px] font-bold opacity-10 italic mt-1 uppercase">Metric-G synchronized in 0.4ms</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
