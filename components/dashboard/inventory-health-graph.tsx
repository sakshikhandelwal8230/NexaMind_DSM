"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

const mockData = [
  { name: "Adequate", value: 12450, fill: "#22c55e" },
  { name: "Low", value: 890, fill: "#eab308" },
  { name: "Critical", value: 156, fill: "#ef4444" },
  { name: "Expiring Soon", value: 234, fill: "#f97316" },
]

export function InventoryHealthGraph() {
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
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="name"
                className="text-muted-foreground"
                fontSize={12}
              />
              <YAxis
                className="text-muted-foreground"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
                labelStyle={{ color: "hsl(var(--card-foreground))" }}
              />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span className="text-muted-foreground">Adequate: 12,450 units</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-500"></div>
            <span className="text-muted-foreground">Low: 890 units</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500"></div>
            <span className="text-muted-foreground">Critical: 156 units</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-500"></div>
            <span className="text-muted-foreground">Expiring: 234 units</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
