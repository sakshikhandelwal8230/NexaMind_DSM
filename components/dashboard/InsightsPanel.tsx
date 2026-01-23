"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Loader2 } from "lucide-react"
import type { InventoryItem } from "@/lib/types"

interface InsightsPanelProps {
  inventory: InventoryItem[]
}

const getStatus = (item: InventoryItem): "Adequate" | "Low Stock" | "Critical" => {
  if (item.quantity === 0) return "Critical"
  if (item.quantity < item.minThreshold) return "Low Stock"
  return "Adequate"
}

export function InsightsPanel({ inventory }: InsightsPanelProps): React.ReactElement {
  const [insights, setInsights] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateInsights = async () => {
    setIsGenerating(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Generate insights based on current inventory
    const newInsights: string[] = []
    const lowStockItems = inventory.filter(item => getStatus(item) === "Low Stock")
    const criticalItems = inventory.filter(item => getStatus(item) === "Critical")
    const expiringSoon = inventory.filter(item => {
      const expiryDate = new Date(item.expiryDate)
      const now = new Date()
      const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays <= 30 && diffDays > 0
    })

    if (criticalItems.length > 0) {
      newInsights.push(`${criticalItems.length} medicines are completely out of stock and need immediate redistribution`)
    }

    if (lowStockItems.length > 0) {
      const totalShortage = lowStockItems.reduce((sum, item) => sum + (item.minThreshold - item.quantity), 0)
      newInsights.push(`${lowStockItems.length} medicines are below threshold by ${totalShortage} units total`)
    }

    if (expiringSoon.length > 0) {
      newInsights.push(`${expiringSoon.length} batches will expire within 30 days - consider priority usage`)
    }

    // Add facility-specific insights
    const facilityGroups = inventory.reduce((acc, item) => {
      if (!acc[item.facility]) acc[item.facility] = []
      acc[item.facility].push(item)
      return acc
    }, {} as Record<string, InventoryItem[]>)

    const facilityIssues = Object.entries(facilityGroups).filter(([_, items]) =>
      items.some(item => getStatus(item) !== "Adequate")
    )

    if (facilityIssues.length > 0) {
      newInsights.push(`${facilityIssues.length} facilities have inventory issues requiring attention`)
    }

    // Randomize order and limit to 3-5 insights
    const shuffled = newInsights.sort(() => Math.random() - 0.5)
    setInsights(shuffled.slice(0, Math.floor(Math.random() * 3) + 3))
    setIsGenerating(false)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Insights
          </CardTitle>
          <CardDescription>Intelligent analysis of inventory patterns</CardDescription>
        </div>
        <Button
          onClick={generateInsights}
          disabled={isGenerating}
          size="sm"
          className="gap-2"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Brain className="h-4 w-4" />
          )}
          {isGenerating ? "Analyzing..." : "Generate"}
        </Button>
      </CardHeader>
      <CardContent>
        {insights.length > 0 ? (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Badge variant="secondary" className="shrink-0 mt-0.5">
                  {index + 1}
                </Badge>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Click "Generate" to analyze current inventory patterns and get actionable insights
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
