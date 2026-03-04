"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { TrendingUp, Loader2 } from "lucide-react"
import { useSupabase } from "@/hooks/useSupabase"

export function InventoryHealthGraph() {
  const { data: medicines, loading } = useSupabase<any>("medicines")

  const chartData = useMemo(() => {
    if (!medicines) return []

    const adequate = medicines.filter((m: any) => m.current_stock > m.min_threshold).length
    const low = medicines.filter((m: any) => m.current_stock > 0 && m.current_stock <= m.min_threshold).length
    const critical = medicines.filter((m: any) => m.current_stock === 0).length

    const today = new Date()
    const thirtyDays = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    const expiring = medicines.filter((m: any) => {
      const exp = m.expiry_date ? new Date(m.expiry_date) : null
      return exp && exp <= thirtyDays && exp >= today
    }).length

    return [
      { name: "Adequate", value: adequate, color: "#22c55e" },
      { name: "Low", value: low, color: "#eab308" },
      { name: "Critical", value: critical, color: "#ef4444" },
      { name: "Expiring", value: expiring, color: "#f97316" },
    ]
  }, [medicines])

  if (loading) {
    return (
      <Card className="border-border bg-card">
        <div className="h-80 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Stock distribution
        </CardTitle>
        <CardDescription>Live health status of current inventory</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/30" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                className="text-[10px] text-muted-foreground uppercase font-bold"
                dy={10}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px"
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 space-y-2">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs px-1">
              <div className="flex items-center gap-2 font-medium">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-bold text-foreground">{item.value.toLocaleString()} items</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
