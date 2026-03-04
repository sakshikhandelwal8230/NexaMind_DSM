import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { Building2, MapPin, Package, ShieldCheck, Activity, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export const dynamic = 'force-dynamic'

async function getFacilities() {
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

    const { data: facilities } = await supabase
        .from('profiles')
        .select('*, medicines(count)')
        .eq('role', 'user')
        .is('deleted_at', null)

    return facilities || []
}

export default async function AdminFacilitiesPage() {
    const facilities = await getFacilities()

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="h-6 px-3 bg-primary/10 text-primary font-black uppercase text-[9px] tracking-widest border-primary/20">Operational Node Oversight</Badge>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter">Facility Hierarchy</h1>
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        Global surveillance of verified medical nodes and their local inventory counts.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {facilities.map((fac) => (
                    <Card key={fac.id} className="border-border/50 hover:border-primary/50 transition-all duration-500 shadow-2xl bg-card/60 backdrop-blur-3xl group overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className="h-12 w-12 rounded-xl bg-slate-950 flex items-center justify-center text-primary font-black shadow-lg border border-white/5">
                                    {fac.full_name?.[0] || 'F'}
                                </div>
                                <Badge className={cn(
                                    "text-[8px] font-black uppercase tracking-[0.2em] px-3",
                                    fac.is_approved ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                )}>
                                    {fac.is_approved ? 'Verified Node' : 'Unverified'}
                                </Badge>
                            </div>
                            <CardTitle className="text-xl font-black uppercase tracking-tight mt-4">{fac.full_name}</CardTitle>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                <MapPin className="h-3 w-3" />
                                {fac.zone} Sector · {fac.facility_type} Protocol
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-0">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-border/50">
                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1 flex items-center gap-1.5">
                                        <Package className="h-3 w-3 text-primary" />
                                        Active SKUs
                                    </p>
                                    <p className="text-xl font-black">{fac.medicines?.[0]?.count || 0}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-border/50">
                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1 flex items-center gap-1.5">
                                        <Activity className="h-3 w-3 text-emerald-500" />
                                        Status
                                    </p>
                                    <p className="text-sm font-black uppercase text-emerald-500">{fac.account_status}</p>
                                </div>
                            </div>
                            <Button variant="ghost" className="w-full text-xs font-black uppercase tracking-widest text-primary border border-primary/10 hover:bg-primary/5">
                                View Node Details
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
