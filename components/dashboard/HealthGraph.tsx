"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import type { InventoryItem } from "@/lib/types"

interface HealthGraphProps {
  inventory: InventoryItem[]
}

const getStatus = (item: InventoryItem): "Adequate" | "Low Stock" | "Critical" => {
  if (item.quantity === 0) return "Critical"
  if (item.quantity < item.minThreshold) return "Low Stock"
  return "Adequate"
}

export function HealthGraph({ inventory }: HealthGraphProps) {
  const statusCounts = inventory.reduce((acc, item) => {
    const status = getStatus(item)
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const total = inventory.length
  const adequate = statusCounts["Adequate"] || 0
  const lowStock = statusCounts["Low Stock"] || 0
  const critical = statusCounts["Critical"] || 0

  const adequatePercent = total > 0 ? Math.round((adequate / total) * 100) : 0
  const lowStockPercent = total > 0 ? Math.round((lowStock / total) * 100) : 0
  const criticalPercent = total > 0 ? Math.round((critical / total) * 100) : 0

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Inventory Health Overview
        </CardTitle>
        <CardDescription>Stock distribution by health status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="bg-green-500 transition-all duration-300"
                style={{ width: `${adequatePercent}%` }}
              />
              <div
                className="bg-yellow-500 transition-all duration-300"
                style={{ width: `${lowStockPercent}%` }}
              />
              <div
                className="bg-red-500 transition-all duration-300"
                style={{ width: `${criticalPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Adequate</span>
              <span>Low Stock</span>
              <span>Critical</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {adequate}
              </div>
              <div className="text-sm text-muted-foreground">Adequate</div>
              <div className="text-xs text-muted-foreground">{adequatePercent}%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {lowStock}
              </div>
              <div className="text-sm text-muted-foreground">Low Stock</div>
              <div className="text-xs text-muted-foreground">{lowStockPercent}%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {critical}
              </div>
              <div className="text-sm text-muted-foreground">Critical</div>
              <div className="text-xs text-muted-foreground">{criticalPercent}%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
