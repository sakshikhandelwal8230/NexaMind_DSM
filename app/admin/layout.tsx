import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Toaster } from "@/components/ui/sonner"
import { ShieldCheck, User } from "lucide-react"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col lg:pl-72 overflow-hidden">
                {/* Top Navigation Bar */}
                <header className="h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-10 z-40">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-950 dark:bg-white flex items-center justify-center text-white dark:text-slate-950 shadow-2xl">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-sm font-black uppercase tracking-tighter">Command & Control</h2>
                            <p className="text-[10px] font-bold uppercase opacity-40 text-primary italic">Administrative Surveillance Protocol Active</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col text-right">
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Root Executive</span>
                            <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest mt-1">Authorized (Sector-G)</span>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-primary shadow-inner">
                            <User className="h-6 w-6" />
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-thin scrollbar-thumb-primary/10">
                    {children}
                </main>
            </div>
        </div>
    )
}
