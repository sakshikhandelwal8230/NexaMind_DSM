"use client"

import { useState, useMemo } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bell, AlertTriangle, AlertOctagon, Zap, Clock, Hospital, Store } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSupabase } from "@/hooks/useSupabase"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function AlertsPage() {
  const [localSearch, setLocalSearch] = useState("")
  const [filter, setFilter] = useState<string>("all")
  const [emergencyMode, setEmergencyMode] = useState(false)
  const { data: alerts, loading } = useSupabase<any>("alerts")

  const stats = useMemo(() => {
    if (!alerts) return { total: 0, low: 0, critical: 0, expiring: 0 }
    const active = alerts.filter((a: any) => a.status === 'active')
    return {
      total: active.length,
      low: active.filter((a: any) => a.type === "warning").length,
      critical: active.filter((a: any) => a.type === "critical").length,
      expiring: active.filter((a: any) => a.type === "expiry").length,
    }
  }, [alerts])

  const filteredAlerts = useMemo(() => {
    if (!alerts) return []
    return alerts.filter((alert: any) => {
      if (alert.status !== 'active') return false

      const matchesSearch = alert.medicine.toLowerCase().includes(localSearch.toLowerCase()) ||
        alert.facility.toLowerCase().includes(localSearch.toLowerCase())
      if (!matchesSearch) return false

      if (emergencyMode && alert.type !== "critical") return false

      if (filter === "all") return true
      if (filter === "critical") return alert.type === "critical"
      if (filter === "low") return alert.type === "warning"
      if (filter === "expiring") return alert.type === "expiry"

      return true
    })
  }, [alerts, localSearch, emergencyMode, filter])

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString()
  }

  return (
    <AuthGuard requireAdmin>
      <div className="flex h-screen bg-background">
        <DashboardSidebar isAdmin />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader
            title="Alerts Center"
            subtitle="Centralized monitoring for medical supply disruptions."
            searchPlaceholder="Search by medicine or facility..."
            searchValue={localSearch}
            onSearchChange={setLocalSearch}
          />
          <main className="flex-1 overflow-y-auto p-6">
            {emergencyMode && (
              <div className="mb-6 flex items-center gap-4 rounded-xl border-2 border-red-500 bg-red-500/10 p-5 shadow-2xl shadow-red-500/20 animate-pulse">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white">
                  <Zap className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <p className="text-xl font-black text-red-600 uppercase tracking-tighter">Emergency Protocol Active</p>
                  <p className="text-sm text-red-600/80 font-medium">
                    Critical stock depletion alerts prioritized. Low-priority notifications suppressed.
                  </p>
                </div>
                <Badge className="bg-red-600 text-white text-lg px-6 py-2 font-bold">{stats.critical} CRITICAL</Badge>
              </div>
            )}

            <div className="mb-8 grid gap-6 sm:grid-cols-4">
              <StatCard title="Active Alerts" value={stats.total} icon={Bell} color="primary" />
              <StatCard title="Critical" value={stats.critical} icon={AlertOctagon} color="red" />
              <StatCard title="Low Stock" value={stats.low} icon={AlertTriangle} color="amber" />
              <StatCard title="Expiring" value={stats.expiring} icon={Clock} color="blue" />
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-card border shadow-sm">
              <div className="flex items-center gap-4">
                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Filter</Label>
                <Select value={filter} onValueChange={setFilter} disabled={emergencyMode}>
                  <SelectTrigger className="w-48 h-10">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="critical">Critical Only</SelectItem>
                    <SelectItem value="low">Warning Only</SelectItem>
                    <SelectItem value="expiring">Expiry Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-full border-2 transition-all duration-300",
                emergencyMode ? "border-red-500 bg-red-500/10 shadow-lg" : "border-border bg-muted/30"
              )}>
                <Zap className={cn("h-4 w-4", emergencyMode ? "text-red-500 animate-bounce" : "text-muted-foreground")} />
                <Label htmlFor="emergency-mode" className={cn("text-sm font-bold", emergencyMode && "text-red-600")}>
                  EMERGENCY
                </Label>
                <Switch id="emergency-mode" checked={emergencyMode} onCheckedChange={setEmergencyMode} />
              </div>
            </div>

            <Card className="border-border shadow-sm overflow-hidden">
              <div className="p-0">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Priority</TableHead>
                      <TableHead>Medicine</TableHead>
                      <TableHead>Facility</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Observed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={5} className="h-16 bg-muted/10 animate-pulse my-1" />
                        </TableRow>
                      ))
                    ) : filteredAlerts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-40 text-center text-muted-foreground italic">
                          No active alerts matching your criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAlerts.map((alert: any) => (
                        <TableRow key={alert.id} className={cn("group hover:bg-muted/30", alert.type === "critical" && "bg-red-500/[0.03]")}>
                          <TableCell>
                            <Badge variant="outline" className={cn(
                              "font-bold uppercase text-[10px] px-2 py-0.5 border-none",
                              alert.type === "critical" ? "bg-red-100 text-red-700" :
                                alert.type === "expiry" ? "bg-blue-100 text-blue-700" :
                                  "bg-amber-100 text-amber-700"
                            )}>
                              {alert.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold text-foreground">{alert.medicine}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="p-1 rounded bg-muted">
                                <Hospital className="h-3 w-3 text-muted-foreground" />
                              </div>
                              <span className="text-sm font-medium">{alert.facility}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-md">{alert.message}</TableCell>
                          <TableCell className="text-xs font-mono text-muted-foreground">
                            {formatTime(alert.created_at)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    primary: "border-l-primary text-primary bg-primary/5",
    red: "border-l-red-500 text-red-600 bg-red-500/5",
    amber: "border-l-amber-500 text-amber-600 bg-amber-500/5",
    blue: "border-l-blue-500 text-blue-600 bg-blue-500/5",
  }
  return (
    <Card className={cn("border-l-4 shadow-sm", colors[color])}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-70">{title}</CardTitle>
        <Icon className="h-4 w-4 opacity-50" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black">{value}</div>
      </CardContent>
    </Card>
  )
}
