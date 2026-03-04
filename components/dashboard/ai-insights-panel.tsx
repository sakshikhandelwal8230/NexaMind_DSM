"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingDown, Clock, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"
import { useSupabase } from "@/hooks/useSupabase"

interface Insight {
  id: string
  title: string
  message: string
  type: "warning" | "info" | "success" | "critical"
  icon: any
}

export function AIInsightsPanel() {
  const { data: medicines, loading } = useSupabase<any>("medicines")

  const insights = useMemo<Insight[]>(() => {
    if (!medicines || medicines.length === 0) return []

    const results: Insight[] = []

    // Rule 1: Critical Shortage Analysis
    const critical = medicines.filter((m: any) => m.current_stock === 0)
    if (critical.length > 0) {
      results.push({
        id: "crit-1",
        title: "Critical Shortage Found",
        message: `${critical[0].name} and ${critical.length - 1} other items are out of stock. Immediate reorder or transfer needed.`,
        type: "critical",
        icon: AlertTriangle
      })
    }

    // Rule 2: Low Stock Trend
    const low = medicines.filter((m: any) => m.current_stock > 0 && m.current_stock <= m.min_threshold)
    if (low.length > 3) {
      results.push({
        id: "low-1",
        title: "Declining Inventory Levels",
        message: `${low.length} items are currently below their minimum safety thresholds. Plan bulk replenishment for optimized costs.`,
        type: "warning",
        icon: TrendingDown
      })
    }

    // Rule 3: Expiry Risk
    const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    const expiring = medicines.filter((m: any) => {
      const exp = m.expiry_date ? new Date(m.expiry_date) : null
      return exp && exp <= thirtyDays
    })
    if (expiring.length > 0) {
      results.push({
        id: "exp-1",
        title: "Near-Term Expiry Risk",
        message: `${expiring.length} batches will expire within 30 days. Prioritize these for distribution to clinics with high usage.`,
        type: "info",
        icon: Clock
      })
    }

    // Default Success if all good
    if (results.length === 0) {
      results.push({
        id: "ok-1",
        title: "Supply Chain Healthy",
        message: "No major disruptions detected in your inventory. Stock levels are within stable parameters.",
        type: "success",
        icon: CheckCircle2
      })
    }

    return results
  }, [medicines])

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-3 border-b bg-muted/20">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          NexaView AI Insights
        </CardTitle>
        <CardDescription>Live rule-based supply chain recommendations</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {loading && (
          <div className="h-40 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
          </div>
        )}

        {!loading && insights.map((insight) => (
          <div key={insight.id} className="group relative flex items-start gap-4 rounded-xl border border-border bg-muted/10 p-4 transition hover:bg-muted/30">
            <div className={`mt-1 p-2 rounded-lg ${insight.type === 'critical' ? 'bg-red-100 text-red-600' :
                insight.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                  insight.type === 'success' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
              }`}>
              <insight.icon className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-foreground">{insight.title}</h4>
                <Badge variant="outline" className="text-[10px] h-4 py-0 uppercase border-muted-foreground/30 text-muted-foreground">AI Rule</Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                {insight.message}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
