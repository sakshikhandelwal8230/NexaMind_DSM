import { Package, AlertTriangle, CheckCircle, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const kpiData = [
  {
    title: "My Inventory",
    value: "847",
    icon: Package,
    description: "Total medicine items",
  },
  {
    title: "Low Stock Items",
    value: "12",
    icon: AlertTriangle,
    description: "Need restocking",
  },
  {
    title: "Adequate Stock",
    value: "823",
    icon: CheckCircle,
    description: "Within threshold",
  },
  {
    title: "Expiring Soon",
    value: "8",
    icon: Calendar,
    description: "Within 30 days",
  },
]

export function UserKPICards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi) => (
        <Card key={kpi.title} className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <kpi.icon className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-card-foreground">{kpi.value}</div>
            <p className="mt-1 text-sm text-muted-foreground">{kpi.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
