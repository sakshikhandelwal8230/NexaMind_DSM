"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LucideIcon } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  description: string
  onClick?: () => void
  isActive?: boolean
}

export function KpiCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  description,
  onClick,
  isActive = false
}: KpiCardProps): React.ReactElement {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isActive ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          isActive ? "bg-primary/10" : "bg-muted"
        }`}>
          <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-card-foreground">{value}</div>
        <div className="mt-1 flex items-center gap-2">
          {change && (
            <Badge
              variant={changeType === "positive" ? "default" : changeType === "negative" ? "destructive" : "secondary"}
              className="text-xs"
            >
              {change}
            </Badge>
          )}
          <span className="text-sm text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}
