"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, AlertOctagon, Info, CheckCircle2, Loader2, Hospital } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSupabase } from "@/hooks/useSupabase"

interface AlertItem {
  id: string
  medicine: string
  facility: string
  message: string
  type: "critical" | "warning" | "expiry" | "info"
  status: "active" | "resolved"
  created_at: string
}

const typeStyles = {
  critical: {
    icon: AlertOctagon,
    badgeVariant: "destructive" as const,
    label: "Critical",
    color: "text-red-600",
    bgColor: "bg-red-50"
  },
  warning: {
    icon: AlertTriangle,
    badgeVariant: "secondary" as const, // We'll use custom class for amber
    label: "Low Stock",
    color: "text-amber-600",
    bgColor: "bg-amber-50"
  },
  expiry: {
    icon: Info,
    badgeVariant: "outline" as const,
    label: "Expiry",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  info: {
    icon: Info,
    badgeVariant: "outline" as const,
    label: "Update",
    color: "text-slate-600",
    bgColor: "bg-slate-50"
  }
}

export function AlertsPanel() {
  const { data: alerts, loading, update } = useSupabase<AlertItem>("alerts")

  const stats = useMemo(() => {
    const active = alerts.filter((a: AlertItem) => a.status === 'active')
    return {
      total: active.length,
      critical: active.filter((a: AlertItem) => a.type === "critical").length,
      low: active.filter((a: AlertItem) => a.type === "warning").length,
    }
  }, [alerts])

  const activeAlerts = useMemo(() => {
    return alerts
      .filter((a: AlertItem) => a.status === 'active')
      .sort((a: AlertItem, b: AlertItem) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 10)
  }, [alerts])

  const resolveAlert = async (id: string) => {
    try {
      await update(id, { status: 'resolved' })
    } catch (err) {
      console.error("Failed to resolve alert:", err)
    }
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const alertTime = new Date(timestamp)
    const diffMs = now.getTime() - alertTime.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    if (diffMins > 0) return `${diffMins}m ago`
    return "Just now"
  }

  return (
    <Card className="border-border bg-card shadow-sm overflow-hidden">
      <CardHeader className="border-b bg-muted/30 pb-3 flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-red-500" />
            Live Alerts
          </CardTitle>
          <p className="text-xs text-muted-foreground font-medium">
            {stats.total} total active notifications
          </p>
        </div>
        {stats.critical > 0 && (
          <Badge variant="destructive" className="animate-pulse bg-red-600">
            {stats.critical} Critical
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {loading && (
          <div className="h-40 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary/30" />
          </div>
        )}

        {!loading && activeAlerts.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto opacity-50" />
            <p className="text-sm text-muted-foreground font-medium italic">No active alerts. Systems stable.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {activeAlerts.map((alert: AlertItem) => {
              const styles = typeStyles[alert.type] || typeStyles.info
              const Icon = styles.icon

              return (
                <div key={alert.id} className={cn("p-4 transition-colors hover:bg-muted/30", styles.bgColor + "/30")}>
                  <div className="flex items-start gap-3">
                    <div className={cn("p-2 rounded-full", styles.bgColor, styles.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge variant={styles.badgeVariant} className={cn(
                          "text-[10px] uppercase font-bold py-0 h-5 border-none",
                          alert.type === 'warning' ? "bg-amber-500 text-white" : ""
                        )}>
                          {styles.label}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                          {getTimeAgo(alert.created_at)}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-foreground">
                        {alert.medicine}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <Hospital className="h-3 w-3" />
                        {alert.facility}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {alert.message}
                      </p>
                      <div className="pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-[10px] px-3 font-bold uppercase tracking-wider hover:bg-green-500 hover:text-white transition-all duration-300"
                          onClick={() => resolveAlert(alert.id)}
                        >
                          <CheckCircle2 className="mr-1.5 h-3 w-3" />
                          Mark Resolved
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
