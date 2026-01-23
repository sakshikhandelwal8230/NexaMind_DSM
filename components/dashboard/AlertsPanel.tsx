"use client"

import { useState, useMemo } from "react"
import { AlertTriangle, AlertOctagon, Clock, Check, CheckCircle, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { InventoryItem } from "@/lib/types"

type AlertType = "Critical" | "Low Stock" | "Expiring"

interface Alert {
  id: string
  type: AlertType
  medicineName: string
  facility: string
  message: string
  itemId: string
}

interface AlertsPanelProps {
  inventory: InventoryItem[]
  onViewItem: (itemId: string) => void
}

const getStatus = (item: InventoryItem): "Adequate" | "Low Stock" | "Critical" => {
  if (item.quantity === 0) return "Critical"
  if (item.quantity < item.minThreshold) return "Low Stock"
  return "Adequate"
}

const isExpiringSoon = (expiryDate: string, days: number = 30): boolean => {
  const expiry = new Date(expiryDate)
  const now = new Date()
  const diffTime = expiry.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= days && diffDays > 0
}

export function AlertsPanel({ inventory, onViewItem }: AlertsPanelProps): React.ReactElement {
  const [resolvedAlerts, setResolvedAlerts] = useState<Set<string>>(new Set())
  const [isResolvedOpen, setIsResolvedOpen] = useState(false)

  const alerts = useMemo((): Alert[] => {
    const alertList: Alert[] = []

    inventory.forEach(item => {
      const status = getStatus(item)

      if (status === "Critical") {
        alertList.push({
          id: `critical-${item.id}`,
          type: "Critical",
          medicineName: item.medicineName,
          facility: item.facility,
          message: `Stock depleted - 0 units remaining`,
          itemId: item.id,
        })
      } else if (status === "Low Stock") {
        alertList.push({
          id: `low-${item.id}`,
          type: "Low Stock",
          medicineName: item.medicineName,
          facility: item.facility,
          message: `Below threshold - ${item.quantity} units remaining`,
          itemId: item.id,
        })
      }

      if (isExpiringSoon(item.expiryDate)) {
        alertList.push({
          id: `expiring-${item.id}`,
          type: "Expiring",
          medicineName: item.medicineName,
          facility: item.facility,
          message: `Batch expires in ${Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`,
          itemId: item.id,
        })
      }
    })

    return alertList
  }, [inventory])

  const activeAlerts = useMemo(() =>
    alerts.filter(alert => !resolvedAlerts.has(alert.id)),
    [alerts, resolvedAlerts]
  )

  const resolvedAlertsList = useMemo(() =>
    alerts.filter(alert => resolvedAlerts.has(alert.id)),
    [alerts, resolvedAlerts]
  )

  const criticalAlerts = activeAlerts.filter(alert => alert.type === "Critical")
  const lowStockAlerts = activeAlerts.filter(alert => alert.type === "Low Stock")
  const expiringAlerts = activeAlerts.filter(alert => alert.type === "Expiring")

  const handleResolve = (alertId: string) => {
    setResolvedAlerts(prev => new Set(prev).add(alertId))
  }

  const alertConfig = {
    Critical: {
      icon: AlertOctagon,
      badgeVariant: "destructive" as const,
    },
    "Low Stock": {
      icon: AlertTriangle,
      badgeVariant: "default" as const,
    },
    Expiring: {
      icon: Clock,
      badgeVariant: "secondary" as const,
    },
  }

  const AlertRow = ({ alert }: { alert: Alert }) => {
    const config = alertConfig[alert.type]
    const Icon = config.icon

    return (
      <div className="flex items-start gap-4 rounded-lg p-3 bg-muted/50">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            alert.type === "Critical" ? "bg-destructive/20" :
            alert.type === "Low Stock" ? "bg-warning/20" : "bg-muted"
          }`}
        >
          <Icon
            className={`h-4 w-4 ${
              alert.type === "Critical" ? "text-destructive" :
              alert.type === "Low Stock" ? "text-warning" : "text-muted-foreground"
            }`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-card-foreground">{alert.medicineName}</span>
            <Badge variant={config.badgeVariant} className="text-xs">
              {alert.type}
            </Badge>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{alert.facility}</p>
          <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewItem(alert.itemId)}
            className="text-xs"
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleResolve(alert.id)}
            className="text-xs"
          >
            <Check className="h-3 w-3 mr-1" />
            Resolve
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg text-card-foreground">My Alerts</CardTitle>
        <CardDescription>Monitor critical issues and take action</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({activeAlerts.length})</TabsTrigger>
            <TabsTrigger value="critical">Critical ({criticalAlerts.length})</TabsTrigger>
            <TabsTrigger value="low">Low Stock ({lowStockAlerts.length})</TabsTrigger>
            <TabsTrigger value="expiring">Expiring ({expiringAlerts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="space-y-4">
              {activeAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active alerts</p>
                </div>
              ) : (
                activeAlerts.map((alert) => (
                  <AlertRow key={alert.id} alert={alert} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="critical" className="mt-4">
            <div className="space-y-4">
              {criticalAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No critical alerts</p>
                </div>
              ) : (
                criticalAlerts.map((alert) => (
                  <AlertRow key={alert.id} alert={alert} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="low" className="mt-4">
            <div className="space-y-4">
              {lowStockAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No low stock alerts</p>
                </div>
              ) : (
                lowStockAlerts.map((alert) => (
                  <AlertRow key={alert.id} alert={alert} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="expiring" className="mt-4">
            <div className="space-y-4">
              {expiringAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No expiring alerts</p>
                </div>
              ) : (
                expiringAlerts.map((alert) => (
                  <AlertRow key={alert.id} alert={alert} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {resolvedAlertsList.length > 0 && (
          <Collapsible open={isResolvedOpen} onOpenChange={setIsResolvedOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full mt-4 justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Resolved ({resolvedAlertsList.length})
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="space-y-2">
                {resolvedAlertsList.map((alert) => (
                  <div key={alert.id} className="flex items-center gap-3 rounded-lg p-2 bg-green-50 dark:bg-green-950/20">
                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">{alert.medicineName}</span>
                      <span className="text-xs text-green-600 dark:text-green-400 ml-2">{alert.facility}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  )
}
