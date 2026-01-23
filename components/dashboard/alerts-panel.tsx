"use client"

import { useState, useMemo } from "react"
import { AlertTriangle, AlertOctagon, Clock, ChevronRight, Check, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type AlertType = "critical" | "warning" | "expiry"

interface AlertItem {
  id: number
  type: AlertType
  medicine: string
  facility: string
  message: string
  time: string
}

const initialAlerts: AlertItem[] = [
  {
    id: 1,
    type: "critical",
    medicine: "Paracetamol 500mg",
    facility: "City General Hospital",
    message: "Stock depleted - 0 units remaining",
    time: "5 min ago",
  },
  {
    id: 2,
    type: "critical",
    medicine: "Amoxicillin 250mg",
    facility: "District Pharmacy #12",
    message: "Critical shortage - 15 units left",
    time: "12 min ago",
  },
  {
    id: 3,
    type: "warning",
    medicine: "Metformin 500mg",
    facility: "Central Medical Store",
    message: "Low stock - 120 units remaining",
    time: "25 min ago",
  },
  {
    id: 4,
    type: "expiry",
    medicine: "Insulin Glargine",
    facility: "Memorial Hospital",
    message: "Batch expires in 7 days",
    time: "1 hour ago",
  },
  {
    id: 5,
    type: "warning",
    medicine: "Atorvastatin 10mg",
    facility: "Health Plus Pharmacy",
    message: "Below threshold - 85 units",
    time: "2 hours ago",
  },
]

const alertConfig = {
  critical: {
    icon: AlertOctagon,
    badgeVariant: "destructive" as const,
    label: "Critical",
  },
  warning: {
    icon: AlertTriangle,
    badgeVariant: "default" as const,
    label: "Warning",
  },
  expiry: {
    icon: Clock,
    badgeVariant: "secondary" as const,
    label: "Expiring",
  },
}

export function AlertsPanel() {
  const [activeTab, setActiveTab] = useState("all")
  const [resolvedAlerts, setResolvedAlerts] = useState<Set<number>>(new Set())

  const activeAlerts = useMemo(() => initialAlerts.filter(alert => !resolvedAlerts.has(alert.id)), [resolvedAlerts])

  const filteredAlerts = useMemo(() => {
    if (activeTab === "all") return activeAlerts
    if (activeTab === "critical") return activeAlerts.filter(alert => alert.type === "critical")
    if (activeTab === "low") return activeAlerts.filter(alert => alert.type === "warning")
    if (activeTab === "expiring") return activeAlerts.filter(alert => alert.type === "expiry")
    return activeAlerts
  }, [activeTab, activeAlerts])

  const resolvedAlertsList = useMemo(() =>
    initialAlerts.filter(alert => resolvedAlerts.has(alert.id)),
    [resolvedAlerts]
  )

  const handleResolve = (alertId: number) => {
    setResolvedAlerts(prev => new Set(prev).add(alertId))
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg text-card-foreground">Alerts & Notifications</CardTitle>
        <CardDescription>Monitor critical issues and take action</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({filteredAlerts.length})</TabsTrigger>
            <TabsTrigger value="critical">Critical ({activeAlerts.filter((a: AlertItem) => a.type === "critical" && !resolvedAlerts.has(a.id)).length})</TabsTrigger>
            <TabsTrigger value="low">Low ({activeAlerts.filter((a: AlertItem) => a.type === "warning" && !resolvedAlerts.has(a.id)).length})</TabsTrigger>
            <TabsTrigger value="expiring">Expiring ({activeAlerts.filter((a: AlertItem) => a.type === "expiry" && !resolvedAlerts.has(a.id)).length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-4">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active alerts in this category</p>
                </div>
              ) : (
                filteredAlerts.map((alert: AlertItem) => {
                  const config = alertConfig[alert.type as keyof typeof alertConfig]
                  const Icon = config.icon

                  return (
                    <div key={alert.id} className="flex items-start gap-4 rounded-lg p-3 bg-muted/50">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${alert.type === "critical" ? "bg-destructive/20" : alert.type === "warning" ? "bg-warning/20" : "bg-muted"}`}
                      >
                        <Icon
                          className={`h-4 w-4 ${alert.type === "critical" ? "text-destructive" : alert.type === "warning" ? "text-warning" : "text-muted-foreground"}`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-card-foreground">{alert.medicine}</span>
                          <Badge variant={config.badgeVariant} className="text-xs">
                            {config.label}
                          </Badge>
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">{alert.facility}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolve(alert.id)}
                          className="text-xs"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Resolve
                        </Button>
                        <span className="shrink-0 text-xs text-muted-foreground">{alert.time}</span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </TabsContent>
        </Tabs>

        {resolvedAlertsList.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-card-foreground mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Resolved ({resolvedAlertsList.length})
            </h4>
            <div className="space-y-2">
              {resolvedAlertsList.map((alert) => (
                <div key={alert.id} className="flex items-center gap-3 rounded-lg p-2 bg-green-50 dark:bg-green-950/20">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">{alert.medicine}</span>
                    <span className="text-xs text-green-600 dark:text-green-400 ml-2">{alert.facility}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
