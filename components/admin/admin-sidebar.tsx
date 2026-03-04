"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    BarChart3,
    Users,
    Settings,
    ShieldCheck,
    LogOut,
    LayoutDashboard,
    FileCheck,
    Building2,
    Bell,
    Activity,
    ChevronRight,
    Menu,
    X,
    ArrowRightLeft,
    Package
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useAuth } from "@/app/providers/auth-context"
import { useRouter } from "next/navigation"

const navItems = [
    { label: "Fleet Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Gateway Approvals", href: "/admin/approvals", icon: FileCheck },
    { label: "Registry Control", href: "/admin/users", icon: Users },
    { label: "Facility Hierarchy", href: "/admin/facilities", icon: Building2 },
    { label: "Global Logistics", href: "/admin/transfers", icon: ArrowRightLeft },
    { label: "Stock Monitoring", href: "/admin/inventory", icon: Package },
    { label: "Audit Ledgers", href: "/admin/logs", icon: ShieldCheck },
    { label: "Analytics Hub", href: "/admin/analytics", icon: BarChart3 },
]

const supportItems = [
    { label: "System Config", href: "/admin/settings", icon: Settings },
    { label: "Incident Alerts", href: "/admin/alerts", icon: Bell },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const { signOut } = useAuth()

    const handleSignOut = async () => {
        try {
            toast.info("Decommissioning Identity Session...", {
                description: "Executing executive logout protocol."
            })

            // Fail-safe: Force redirect after 1.5s regardless of session state
            const failSafeId = setTimeout(() => {
                localStorage.clear()
                sessionStorage.clear()
                window.location.href = "/login?logged_out=true"
            }, 1500)

            await signOut()
            clearTimeout(failSafeId)

            // Total Registry Clearing
            localStorage.clear()
            sessionStorage.clear()

            window.location.href = "/login?logged_out=true"
        } catch (err) {
            console.error("Logout error:", err)
            localStorage.clear()
            window.location.href = "/login?logged_out=true"
        }
    }

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-[60] lg:hidden bg-background border border-border"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-white border-r border-white/5 transform transition-transform duration-300 lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full p-6 bg-gradient-to-b from-slate-900/50 to-transparent">
                    <div className="flex items-center gap-3 mb-12 px-2">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <ShieldCheck className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-widest">Surveillance Admin</h2>
                            <p className="text-[10px] font-bold uppercase text-primary tracking-widest opacity-80">Grid Authority v.4.0</p>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-8 overflow-y-auto scrollbar-thin scrollbar-thumb-white/5 pr-2 -mr-2">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6 px-4">Executive Core</p>
                            <div className="space-y-2">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <div className={cn(
                                                "flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-300",
                                                isActive ? "bg-white/10 text-white" : "text-white/40 hover:text-white hover:bg-white/5"
                                            )}>
                                                <div className="flex items-center gap-3">
                                                    <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "group-hover:text-primary")} />
                                                    <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                                                </div>
                                                {isActive && <ChevronRight className="h-3 w-3 text-primary animate-pulse" />}
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6 px-4">System Support</p>
                            <div className="space-y-2">
                                {supportItems.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <div className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                                isActive ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                                            )}>
                                                <item.icon className="h-4 w-4" />
                                                <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </nav>

                    <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                <Activity className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest">Network Health</p>
                                <p className="text-[8px] font-bold text-emerald-500 italic uppercase">Operational (100%)</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10 font-black uppercase text-[10px] tracking-widest h-11"
                            onClick={handleSignOut}
                        >
                            <LogOut className="mr-3 h-4 w-4" />
                            Terminate Session
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
