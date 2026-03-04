"use client"

import { useMemo } from "react"
import { Package, AlertTriangle, AlertOctagon, Clock, ArrowRightLeft, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSupabase } from "@/hooks/useSupabase"

interface KPICardsProps {
  onFilterChange?: (filter: string) => void
}

export function KPICards({ onFilterChange }: KPICardsProps) {
  const { data: medicines, loading } = useSupabase<any>("medicines")

  const stats = useMemo(() => {
    if (!medicines) return null

    const totalItems = medicines.length
    const lowStock = medicines.filter((m: any) => m.current_stock > 0 && m.current_stock <= m.min_threshold).length
    const critical = medicines.filter((m: any) => m.current_stock === 0).length

    // Check if expiry date is within 30 days
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    const expiringSoon = medicines.filter((m: any) => {
      if (!m.expiry_date) return false
      const expiry = new Date(m.expiry_date)
      return expiry <= thirtyDaysFromNow && expiry >= today
    }).length

    return [
      {
        title: "Total Medicines",
        value: totalItems.toLocaleString(),
        icon: Package,
        description: "Active inventory items",
        filter: "all",
        color: "text-blue-600",
      },
      {
        title: "Low Stock",
        value: lowStock.toLocaleString(),
        icon: AlertTriangle,
        description: "Below threshold levels",
        filter: "low",
        color: "text-amber-500",
      },
      {
        title: "Critical Shortages",
        value: critical.toLocaleString(),
        icon: AlertOctagon,
        description: "Immediate attention needed",
        filter: "critical",
        color: "text-red-600",
      },
      {
        title: "Expiring Soon",
        value: expiringSoon.toLocaleString(),
        icon: Clock,
        description: "Within 30 days",
        filter: "expiring",
        color: "text-orange-500",
      },
      {
        title: "Transfers Pending",
        value: "0",
        icon: ArrowRightLeft,
        description: "Awaiting approval",
        filter: "transfers",
        color: "text-purple-600",
      },
      {
        title: "Reorder Queue",
        value: lowStock.toString(),
        icon: ShoppingCart,
        description: "Items to reorder",
        filter: "reorder",
        color: "text-indigo-600",
      },
    ]
  }, [medicines])

  if (loading || !stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-card rounded-lg border border-border" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((kpi) => (
        <Card
          key={kpi.title}
          className="border-border bg-card cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onFilterChange?.(kpi.filter)}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
            <div className={`p-2 rounded-lg bg-primary/10`}>
              <kpi.icon className={`h-4 w-4 text-primary`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{kpi.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
