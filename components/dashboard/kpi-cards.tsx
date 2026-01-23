import { Package, AlertTriangle, AlertOctagon, Clock, ArrowRightLeft, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface KPICardsProps {
  onFilterChange?: (filter: string) => void
}

const kpiData = [
  {
    title: "Total Medicines",
    value: "12,847",
    change: "+2.5%",
    changeType: "positive" as const,
    icon: Package,
    description: "Active inventory items",
    filter: "all",
  },
  {
    title: "Low Stock",
    value: "156",
    change: "-12%",
    changeType: "positive" as const,
    icon: AlertTriangle,
    description: "Below threshold levels",
    filter: "low",
  },
  {
    title: "Critical Shortages",
    value: "23",
    change: "+8%",
    changeType: "negative" as const,
    icon: AlertOctagon,
    description: "Immediate attention needed",
    filter: "critical",
  },
  {
    title: "Expiring Soon",
    value: "89",
    change: "-5%",
    changeType: "positive" as const,
    icon: Clock,
    description: "Expires within 30 days",
    filter: "expiring",
  },
  {
    title: "Transfers Pending",
    value: "12",
    change: "+3",
    changeType: "negative" as const,
    icon: ArrowRightLeft,
    description: "Awaiting approval",
    filter: "transfers",
  },
  {
    title: "Reorder Queue",
    value: "45",
    change: "+7",
    changeType: "negative" as const,
    icon: ShoppingCart,
    description: "Items to reorder",
    filter: "reorder",
  },
]

export function KPICards({ onFilterChange }: KPICardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpiData.map((kpi) => (
        <Card
          key={kpi.title}
          className="border-border bg-card cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onFilterChange?.(kpi.filter)}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <kpi.icon className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-card-foreground">{kpi.value}</div>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`text-sm font-medium ${kpi.changeType === "positive" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {kpi.change}
              </span>
              <span className="text-sm text-muted-foreground">{kpi.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
