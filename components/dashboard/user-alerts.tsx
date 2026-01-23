import { AlertTriangle, Clock, Bell } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const alerts = [
  {
    id: 1,
    type: "critical",
    medicine: "Metformin 500mg",
    message: "Stock critically low - 8 units remaining",
    time: "10 min ago",
  },
  {
    id: 2,
    type: "warning",
    medicine: "Amoxicillin 250mg",
    message: "Below threshold - 25 units (threshold: 50)",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "expiry",
    medicine: "Omeprazole 20mg",
    message: "Batch OMP2025015 expires on 2026-02-28",
    time: "2 hours ago",
  },
]

const alertConfig = {
  critical: {
    icon: AlertTriangle,
    className: "bg-destructive/20 text-destructive",
    badge: "Critical",
    badgeClass: "bg-destructive/20 text-destructive border-destructive/30",
  },
  warning: {
    icon: Bell,
    className: "bg-warning/20 text-warning",
    badge: "Warning",
    badgeClass: "bg-warning/20 text-warning border-warning/30",
  },
  expiry: {
    icon: Clock,
    className: "bg-muted text-muted-foreground",
    badge: "Expiring",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
}

export function UserAlerts() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg text-card-foreground">My Alerts</CardTitle>
        <CardDescription>Stock alerts for your facility</CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Bell className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p>No alerts at this time</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const config = alertConfig[alert.type as keyof typeof alertConfig]
              const Icon = config.icon
              return (
                <div key={alert.id} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.className}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-card-foreground">{alert.medicine}</span>
                      <Badge className={config.badgeClass}>{config.badge}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{alert.time}</p>
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
