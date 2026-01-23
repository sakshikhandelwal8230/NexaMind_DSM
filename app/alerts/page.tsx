"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bell, AlertTriangle, AlertOctagon, Zap, Building2, Store, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSearch } from "@/app/providers/search-context"

interface Alert {
  id: string
  medicineName: string
  facility: string
  facilityType: "Hospital" | "Pharmacy"
  alertType: "Low" | "Critical"
  quantityLeft: number
  timestamp: string
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    medicineName: "Omeprazole 20mg",
    facility: "City General Hospital",
    facilityType: "Hospital",
    alertType: "Critical",
    quantityLeft: 0,
    timestamp: "2026-01-11T10:30:00",
  },
  {
    id: "2",
    medicineName: "Metformin 500mg",
    facility: "HealthPlus Pharmacy",
    facilityType: "Pharmacy",
    alertType: "Critical",
    quantityLeft: 15,
    timestamp: "2026-01-11T09:45:00",
  },
  {
    id: "3",
    medicineName: "Amoxicillin 250mg",
    facility: "Central Medical Center",
    facilityType: "Hospital",
    alertType: "Low",
    quantityLeft: 45,
    timestamp: "2026-01-11T08:20:00",
  },
  {
    id: "4",
    medicineName: "Insulin Glargine",
    facility: "MedCare Pharmacy",
    facilityType: "Pharmacy",
    alertType: "Critical",
    quantityLeft: 5,
    timestamp: "2026-01-10T16:55:00",
  },
  {
    id: "5",
    medicineName: "Lisinopril 10mg",
    facility: "Regional Hospital",
    facilityType: "Hospital",
    alertType: "Low",
    quantityLeft: 78,
    timestamp: "2026-01-10T14:30:00",
  },
  {
    id: "6",
    medicineName: "Atorvastatin 20mg",
    facility: "Downtown Pharmacy",
    facilityType: "Pharmacy",
    alertType: "Low",
    quantityLeft: 92,
    timestamp: "2026-01-10T11:15:00",
  },
  {
    id: "7",
    medicineName: "Amlodipine 5mg",
    facility: "City General Hospital",
    facilityType: "Hospital",
    alertType: "Critical",
    quantityLeft: 12,
    timestamp: "2026-01-09T17:40:00",
  },
  {
    id: "8",
    medicineName: "Metoprolol 50mg",
    facility: "LifeCare Medical",
    facilityType: "Hospital",
    alertType: "Low",
    quantityLeft: 55,
    timestamp: "2026-01-09T13:25:00",
  },
  {
    id: "9",
    medicineName: "Losartan 50mg",
    facility: "Apollo Pharmacy",
    facilityType: "Pharmacy",
    alertType: "Critical",
    quantityLeft: 3,
    timestamp: "2026-01-09T10:10:00",
  },
  {
    id: "10",
    medicineName: "Pantoprazole 40mg",
    facility: "St. Mary's Hospital",
    facilityType: "Hospital",
    alertType: "Low",
    quantityLeft: 67,
    timestamp: "2026-01-08T15:45:00",
  },
]

export default function AlertsPage() {
  const { searchQuery } = useSearch()
  const [filter, setFilter] = useState<string>("all")
  const [emergencyMode, setEmergencyMode] = useState(false)

  const stats = {
    total: mockAlerts.length,
    low: mockAlerts.filter((a) => a.alertType === "Low").length,
    critical: mockAlerts.filter((a) => a.alertType === "Critical").length,
  }

  const filteredAlerts = mockAlerts.filter((alert) => {
    const matchesSearch = alert.medicineName.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false
    if (emergencyMode && alert.alertType !== "Critical") return false
    if (filter === "all") return true
    if (filter === "critical") return alert.alertType === "Critical"
    if (filter === "low") return alert.alertType === "Low"
    return true
  })

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const alertTime = new Date(timestamp)
    const diffMs = now.getTime() - alertTime.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    return "Just now"
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader title="Alerts & Notifications" subtitle="Monitor real-time medicine shortage alerts" searchValue={""} onSearchChange={function (value: string): void {
          throw new Error("Function not implemented.")
        } } />
        <main className="flex-1 overflow-y-auto p-6">
          {emergencyMode && (
            <div className="mb-6 flex items-center gap-4 rounded-lg border-2 border-red-500 bg-red-500/10 p-4 shadow-lg shadow-red-500/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white">
                <Zap className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-red-600">Emergency Mode Active</p>
                <p className="text-sm text-muted-foreground">
                  Showing only critical alerts. Low priority alerts are hidden to focus on urgent issues.
                </p>
              </div>
              <Badge className="bg-red-500 text-white text-lg px-4 py-1">{stats.critical} Critical</Badge>
            </div>
          )}

          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Alerts</CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Active notifications</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Alerts</CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">{stats.low}</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>
            <Card
              className={cn(
                "border-l-4 border-l-red-500",
                emergencyMode && "ring-2 ring-red-500 shadow-lg shadow-red-500/20",
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Critical Alerts</CardTitle>
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    emergencyMode ? "bg-red-500 animate-pulse" : "bg-red-500/10",
                  )}
                >
                  <AlertOctagon className={cn("h-5 w-5", emergencyMode ? "text-white" : "text-red-500")} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{stats.critical}</div>
                <p className="text-xs text-muted-foreground">Immediate action needed</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-card p-4">
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-muted-foreground">Filter:</Label>
              <Select value={filter} onValueChange={setFilter} disabled={emergencyMode}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter alerts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Alerts</SelectItem>
                  <SelectItem value="critical">Critical Only</SelectItem>
                  <SelectItem value="low">Low Stock Only</SelectItem>
                </SelectContent>
              </Select>
              {emergencyMode && (
                <span className="text-xs text-muted-foreground italic">Filter disabled in emergency mode</span>
              )}
            </div>
            <div
              className={cn(
                "flex items-center gap-3 rounded-lg border-2 px-4 py-2 transition-all",
                emergencyMode ? "border-red-500 bg-red-500/10" : "border-border bg-background",
              )}
            >
              <Zap className={cn("h-5 w-5", emergencyMode ? "text-red-500" : "text-muted-foreground")} />
              <Label htmlFor="emergency-mode" className={cn("font-semibold", emergencyMode && "text-red-600")}>
                Emergency Mode
              </Label>
              <Switch id="emergency-mode" checked={emergencyMode} onCheckedChange={setEmergencyMode} />
            </div>
          </div>

          <Card>
            <CardHeader className="border-b bg-muted/50">
              <CardTitle className="text-lg">Alert History</CardTitle>
              <p className="text-sm text-muted-foreground">
                Showing {filteredAlerts.length} {emergencyMode ? "critical" : ""} alerts
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold">Alert Type</TableHead>
                    <TableHead className="font-semibold">Medicine Name</TableHead>
                    <TableHead className="font-semibold">Hospital / Pharmacy</TableHead>
                    <TableHead className="text-right font-semibold">Quantity Left</TableHead>
                    <TableHead className="font-semibold">Time</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        {emergencyMode ? "No critical alerts at this time." : "No alerts found."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAlerts.map((alert) => {
                      const isCritical = alert.alertType === "Critical"
                      return (
                        <TableRow
                          key={alert.id}
                          className={cn(
                            "transition-colors hover:bg-muted/50",
                            isCritical && "bg-red-500/5 hover:bg-red-500/10",
                          )}
                        >
                          <TableCell>
                            {isCritical ? (
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                                  <AlertOctagon className="h-4 w-4 text-red-600" />
                                </div>
                                <span className="font-bold text-red-600">Critical</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20">
                                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                                </div>
                                <span className="font-medium text-amber-600">Low Stock</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{alert.medicineName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {alert.facilityType === "Hospital" ? (
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Store className="h-4 w-4 text-muted-foreground" />
                              )}
                              <div>
                                <p className="font-medium">{alert.facility}</p>
                                <p className="text-xs text-muted-foreground">{alert.facilityType}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={cn(
                                "font-mono text-lg font-bold",
                                alert.quantityLeft === 0
                                  ? "text-red-600"
                                  : isCritical
                                    ? "text-red-500"
                                    : "text-amber-500",
                              )}
                            >
                              {alert.quantityLeft}
                            </span>
                            <span className="ml-1 text-xs text-muted-foreground">units</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <div>
                                <p className="text-xs">{formatTimestamp(alert.timestamp)}</p>
                                <p className="text-xs font-medium">{getTimeAgo(alert.timestamp)}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {isCritical ? (
                              <Badge className="bg-red-600 text-white font-semibold">
                                <AlertOctagon className="mr-1 h-3 w-3" />
                                Critical
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-500 text-white font-semibold">
                                <AlertTriangle className="mr-1 h-3 w-3" />
                                Low Stock
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
