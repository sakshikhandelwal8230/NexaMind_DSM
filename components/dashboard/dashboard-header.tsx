"use client"

import { useState } from "react"
import { Bell, Search, Clock, AlertTriangle, AlertOctagon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"
import { DashboardThemeToggle } from "@/components/dashboard-theme-toggle"
import { ProfileMenu } from "@/components/dashboard/profile-menu"
import { useSearch } from "@/app/providers/search-context"

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  // optional controlled search
  searchValue?: string
  onSearchChange?: (value: string) => void
}

interface Alert {
  id: number
  type: "critical" | "warning" | "expiry"
  medicine: string
  message: string
}

export function DashboardHeader({ title, subtitle, searchValue, onSearchChange }: DashboardHeaderProps) {
  const { searchQuery, setSearchQuery } = useSearch()
  const [alertsOpen, setAlertsOpen] = useState(false)

  // ✅ If page passes props, use them. Otherwise use global search context.
  const effectiveSearchValue = searchValue ?? searchQuery
  const handleSearchChange = (value: string) => {
    if (onSearchChange) onSearchChange(value)
    else setSearchQuery(value)
  }

  // Mock alerts data
  const mockMedicines = [
    { id: 1, name: "Paracetamol 500mg", stock: 0, threshold: 50, expiryDays: 45 },
    { id: 2, name: "Amoxicillin 250mg", stock: 15, threshold: 100, expiryDays: 25 },
    { id: 3, name: "Metformin 500mg", stock: 120, threshold: 150, expiryDays: 60 },
    { id: 4, name: "Insulin Glargine", stock: 200, threshold: 100, expiryDays: 7 },
    { id: 5, name: "Atorvastatin 10mg", stock: 85, threshold: 100, expiryDays: 90 },
  ]

  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = []
    mockMedicines.forEach((medicine) => {
      if (medicine.stock === 0) {
        alerts.push({
          id: medicine.id,
          type: "critical",
          medicine: medicine.name,
          message: "Stock depleted - 0 units remaining",
        })
      } else if (medicine.stock < medicine.threshold) {
        alerts.push({
          id: medicine.id,
          type: "warning",
          medicine: medicine.name,
          message: `Low stock - ${medicine.stock} units remaining`,
        })
      }
      if (medicine.expiryDays < 30) {
        alerts.push({
          id: medicine.id + 100,
          type: "expiry",
          medicine: medicine.name,
          message: `Batch expires in ${medicine.expiryDays} days`,
        })
      }
    })
    return alerts
  }

  const alerts = generateAlerts()
  const criticalCount = alerts.filter((a) => a.type === "critical").length

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-card px-6">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={effectiveSearchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search medicines..."
            className="w-64 pl-9"
          />
        </div>

        <DashboardThemeToggle />

        <Popover open={alertsOpen} onOpenChange={setAlertsOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {criticalCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
                >
                  {criticalCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-80 p-0" align="end">
            <div className="border-b p-4">
              <h3 className="font-semibold">Alerts</h3>
              <p className="text-sm text-muted-foreground">Recent notifications</p>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No alerts at this time</div>
              ) : (
                alerts.map((alert) => {
                  const Icon =
                    alert.type === "critical" ? AlertOctagon : alert.type === "warning" ? AlertTriangle : Clock
                  return (
                    <div
                      key={alert.id}
                      className="flex items-start gap-3 border-b p-4 last:border-b-0 hover:bg-muted/50"
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          alert.type === "critical"
                            ? "bg-destructive/20 text-destructive"
                            : alert.type === "warning"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{alert.medicine}</p>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {alerts.length > 0 && (
              <div className="border-t p-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/alerts">View All Alerts</Link>
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        <ProfileMenu />
      </div>
    </header>
  )
}