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
import { sharedAlerts } from "@/lib/alerts-data"

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  // optional controlled search
  searchValue?: string
  onSearchChange?: (value: string) => void
  hideSearch?: boolean
  searchPlaceholder?: string
}

interface Alert {
  id: string
  type: "critical" | "warning"
  medicine: string
  message: string
}

export function DashboardHeader({ title, subtitle, searchValue, onSearchChange, hideSearch, searchPlaceholder }: DashboardHeaderProps) {
  const { searchQuery, setSearchQuery } = useSearch()
  const [alertsOpen, setAlertsOpen] = useState(false)

  // ✅ If page passes props, use them. Otherwise use global search context.
  const effectiveSearchValue = searchValue ?? searchQuery
  const handleSearchChange = (value: string) => {
    if (onSearchChange) onSearchChange(value)
    else setSearchQuery(value)
  }

  // Use shared alerts data - convert to display format
  const alerts: Alert[] = sharedAlerts.map((alert) => ({
    id: alert.id,
    type: alert.alertType === "Critical" ? "critical" : "warning",
    medicine: alert.medicineName,
    message: alert.quantityLeft === 0 
      ? "Stock depleted - 0 units remaining" 
      : `${alert.alertType} stock - ${alert.quantityLeft} units remaining`,
  }))

  const criticalCount = alerts.filter((a) => a.type === "critical").length

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-card px-6">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {!hideSearch && (
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={effectiveSearchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={searchPlaceholder || "Search medicines..."}
              className="w-64 pl-9"
            />
          </div>
        )}

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
                  const Icon = alert.type === "critical" ? AlertOctagon : AlertTriangle
                  return (
                    <Link
                      key={alert.id}
                      href="/alerts"
                      onClick={() => setAlertsOpen(false)}
                      className="flex items-start gap-3 border-b p-4 last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          alert.type === "critical"
                            ? "bg-destructive/20 text-destructive"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{alert.medicine}</p>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                    </Link>
                  )
                })
              )}
            </div>

            {alerts.length > 0 && (
              <div className="border-t p-4">
                <Link href="/alerts" onClick={() => setAlertsOpen(false)}>
                  <Button variant="outline" className="w-full">View All Alerts</Button>
                </Link>
              </div>
            )}
          </PopoverContent>
        </Popover>

        <ProfileMenu />
      </div>
    </header>
  )
}