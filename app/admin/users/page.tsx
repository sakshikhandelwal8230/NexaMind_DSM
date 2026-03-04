import { UserManagementTable } from "@/components/admin/user-management-table"
import { Badge } from "@/components/ui/badge"
import { Users, FileSearch } from "lucide-react"

export default function AdminUsersPage() {
    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="h-6 px-3 bg-primary/10 text-primary font-black uppercase text-[9px] tracking-widest border-primary/20">Registry Fleet Control</Badge>
                        <Badge variant="outline" className="h-6 px-3 bg-slate-900/10 dark:bg-white/10 text-slate-500 font-black uppercase text-[9px] tracking-widest border-border/50">Sector-G Authorization Hub</Badge>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter">Medical Registry Audit</h1>
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        <FileSearch className="h-4 w-4 text-primary" />
                        Review, verify, and manage all pharmaceutical facility nodes in the grid.
                    </p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-40">
                    Current Surveillance Depth: 100%
                </div>
            </div>

            <UserManagementTable />
        </div>
    )
}
