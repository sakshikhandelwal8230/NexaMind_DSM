import { UserPlus, FileCheck, BarChart3, Bell } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Register Your Facility",
    description:
      "Hospitals and pharmacies register with their license details. Our team verifies credentials within 24-48 hours.",
  },
  {
    icon: FileCheck,
    step: "02",
    title: "Connect Your Inventory",
    description: "Link your existing inventory management system or use our built-in tools to report stock levels.",
  },
  {
    icon: BarChart3,
    step: "03",
    title: "Monitor in Real-Time",
    description: "Access the dashboard to view inventory status, analytics, and trends across your facility network.",
  },
  {
    icon: Bell,
    step: "04",
    title: "Receive Smart Alerts",
    description:
      "Get notified instantly when stock levels are low or when critical shortages are detected in your region.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-muted py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">How It Works</h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Get started in four simple steps and join the nationwide network of healthcare facilities.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-border lg:block" />
              )}

              <div className="relative flex flex-col items-center text-center">
                {/* Step Number */}
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary">
                  <item.icon className="h-10 w-10 text-primary-foreground" />
                </div>
                <span className="mb-2 text-sm font-semibold text-accent">Step {item.step}</span>
                <h3 className="mb-3 text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-pretty text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
