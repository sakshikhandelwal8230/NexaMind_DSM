"use client"

import { Bell, Search, User, LogOut, Settings, Hospital } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/app/providers/auth-context"
import { ThemeToggle } from "@/components/providers/theme-toggle"
import { useSupabase } from "@/hooks/useSupabase"
import { useMemo } from "react"

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  hideSearch?: boolean
}

interface AlertItem {
  id: string
  title: string
  description?: string
  type: 'critical' | 'warning' | 'info' | 'success'
  is_read: boolean
  status: 'active' | 'resolved'
}

export function DashboardHeader({
  title,
  subtitle,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  hideSearch = false,
}: DashboardHeaderProps) {
  const { user, profile, signOut } = useAuth()
  const { data: alerts } = useSupabase<AlertItem>("alerts")

  const activeAlerts = useMemo(() => {
    return alerts.filter((a: AlertItem) => a.status === 'active' || !a.is_read)
  }, [alerts])

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b bg-background/95 px-8 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm transition-all duration-300">
      <div className="flex flex-col space-y-0.5">
        <div className="flex items-center gap-2">
          <Hospital className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-black text-foreground uppercase tracking-tight">{title}</h1>
        </div>
        {subtitle && <p className="text-xs font-bold text-muted-foreground uppercase opacity-70 tracking-widest">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-6">
        {!hideSearch && (
          <div className="relative hidden w-[350px] lg:block group">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder={searchPlaceholder}
              className="h-11 w-full pl-11 bg-muted/40 border-none ring-offset-background group-focus-within:ring-2 group-focus-within:ring-primary/20 group-focus-within:bg-background transition-all"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        )}

        <div className="flex items-center gap-4 border-l pl-6 h-10 border-border">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-full bg-muted/40 hover:bg-muted font-bold">
                <Bell className="h-5 w-5 text-card-foreground" />
                {activeAlerts.length > 0 && (
                  <Badge className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center p-0 text-[10px] font-black animate-in zoom-in-50 bg-red-600 border-2 border-background shadow-lg">
                    {activeAlerts.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden rounded-xl border-border/50">
              <DropdownMenuLabel className="p-4 bg-muted/50 border-b flex items-center justify-between">
                <span className="font-black uppercase tracking-tight">Active Alerts</span>
                <Badge variant="outline" className="text-[10px] uppercase font-bold text-red-600 border-red-200 bg-red-50">{activeAlerts.length} Directives</Badge>
              </DropdownMenuLabel>
              <div className="max-h-80 overflow-y-auto divide-y divide-border/50 bg-card">
                {activeAlerts.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <p className="text-sm font-bold text-muted-foreground italic">No unread alerts.</p>
                  </div>
                ) : (
                  activeAlerts.slice(0, 5).map((alert: AlertItem) => (
                    <div key={alert.id} className="p-4 hover:bg-muted/40 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${alert.type === 'critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                          alert.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                          }`} />
                        <h4 className="text-xs font-black uppercase tracking-tight text-foreground">{alert.title}</h4>
                      </div>
                      <p className="text-xs font-medium text-muted-foreground line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                        {alert.description || "Supply chain directive issued."}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-3 cursor-pointer text-xs font-bold uppercase tracking-widest text-primary justify-center bg-primary/5 hover:bg-primary/10 transition-colors">
                View All Alerts
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-11 gap-3 rounded-full bg-muted/40 px-4 hover:bg-muted transition-all">
                <div className="flex flex-col items-end mr-3">
                  <span className="text-[11px] font-black uppercase tracking-tighter text-foreground h-3">
                    {profile?.full_name || user?.email?.split("@")[0] || "User"}
                  </span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-80 h-3">
                    {profile?.role || "Member"}
                  </span>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-border/50">
              <DropdownMenuLabel className="px-2 py-3 text-xs font-black uppercase tracking-widest text-muted-foreground">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="opacity-50" />
              <DropdownMenuItem className="p-3 cursor-pointer rounded-lg hover:bg-muted flex items-center gap-3">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-bold uppercase tracking-tight">System Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="p-3 cursor-pointer rounded-lg hover:bg-red-500 hover:text-white transition-colors flex items-center gap-3"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4 text-muted-foreground group-hover:text-white" />
                <span className="text-xs font-bold uppercase tracking-tight">Sign Out Session</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}