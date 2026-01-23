"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MapPin, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react"

interface ZoneData {
  zone: string
  adequate: number
  low: number
  critical: number
}

const zoneData: ZoneData[] = [
  {
    zone: "North Zone",
    adequate: 75,
    low: 20,
    critical: 5,
  },
  {
    zone: "Central Zone",
    adequate: 60,
    low: 30,
    critical: 10,
  },
  {
    zone: "South Zone",
    adequate: 85,
    low: 10,
    critical: 5,
  },
]

const statusColors = {
  adequate: "bg-green-500",
  low: "bg-yellow-500",
  critical: "bg-red-500",
}

export function StatusHeatmap() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Status Heatmap
        </CardTitle>
        <CardDescription>Zone-wise medicine health summary</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {zoneData.map((zone) => (
          <div key={zone.zone} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-card-foreground">{zone.zone}</span>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  {zone.adequate}%
                </span>
                <span className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-yellow-500" />
                  {zone.low}%
                </span>
                <span className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-red-500" />
                  {zone.critical}%
                </span>
              </div>
            </div>
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-300"
                style={{ width: `${zone.adequate}%` }}
              />
              <div
                className="absolute top-0 h-full bg-yellow-500 transition-all duration-300"
                style={{ left: `${zone.adequate}%`, width: `${zone.low}%` }}
              />
              <div
                className="absolute top-0 h-full bg-red-500 transition-all duration-300"
                style={{ left: `${zone.adequate + zone.low}%`, width: `${zone.critical}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
