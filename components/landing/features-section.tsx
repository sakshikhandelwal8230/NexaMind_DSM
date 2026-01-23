import { Activity, Bell, ShieldCheck, Database, Zap, Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Activity,
    title: "Real-Time Inventory Monitoring",
    description:
      "Track medicine stock levels across all registered hospitals and pharmacies with live data updates every minute.",
  },
  {
    icon: Bell,
    title: "Early Shortage Alerts",
    description: "Automated alerts when stock levels fall below threshold, enabling proactive supply chain management.",
  },
  {
    icon: ShieldCheck,
    title: "Government-Compliant System",
    description: "Built to meet all regulatory requirements with full audit trails and compliance reporting.",
  },
  {
    icon: Database,
    title: "Centralized Data Management",
    description: "Single source of truth for all drug inventory data across the healthcare network.",
  },
  {
    icon: Zap,
    title: "Instant Decision Support",
    description: "Analytics and insights to help health authorities make informed decisions quickly.",
  },
  {
    icon: Lock,
    title: "Secure & Encrypted",
    description: "Enterprise-grade security with end-to-end encryption protecting all sensitive healthcare data.",
  },
]

export function FeaturesSection() {
  return (
    <section id="about" className="bg-background py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Key Features</h2>
          <p className="text-pretty text-lg text-muted-foreground">
            A comprehensive platform designed to prevent drug shortages and ensure healthcare accessibility for all
            citizens.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border bg-card transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
