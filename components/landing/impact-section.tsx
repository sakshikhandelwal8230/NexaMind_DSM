"use client"

import { useEffect, useState, useRef } from "react"
import { TrendingUp, Users, Building2, AlertTriangle } from "lucide-react"

interface ImpactItem {
  id: string
  value: number
  label: string
  suffix: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const impactData: ImpactItem[] = [
  {
    id: "reduction",
    value: 40,
    suffix: "%",
    label: "Reduction in Stockouts",
    description: "Average decrease in critical medicine shortages across connected facilities",
    icon: TrendingUp,
  },
  {
    id: "citizens",
    value: 2000000,
    suffix: "M+",
    label: "Citizens Impacted",
    description: "People benefiting from improved medicine availability in their region",
    icon: Users,
  },
  {
    id: "districts",
    value: 500,
    suffix: "+",
    label: "Districts Covered",
    description: "Geographic spread ensuring nationwide healthcare coverage",
    icon: Building2,
  },
  {
    id: "shortages",
    value: 10000,
    suffix: "K+",
    label: "Shortages Prevented",
    description: "Critical alerts that enabled proactive inventory management",
    icon: AlertTriangle,
  },
]

export function ImpactSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!sectionRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        } else {
          setIsVisible(false)
          setAnimatedValues({}) // reset on scroll out
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    impactData.forEach((item) => {
      let step = 0
      const increment = item.value / steps

      const timer = setInterval(() => {
        step++
        setAnimatedValues((prev) => ({
          ...prev,
          [item.id]: Math.min(Math.round(step * increment), item.value),
        }))

        if (step >= steps) clearInterval(timer)
      }, stepDuration)
    })
  }, [isVisible])

  const formatValue = (value: number, suffix: string) => {
    if (suffix === "M+") return `${Math.floor(value / 1_000_000)}M+`
    if (suffix === "K+") return `${Math.floor(value / 1_000)}K+`
    return `${value}${suffix}`
  }

  return (
    <section ref={sectionRef} className="bg-primary py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
            Our Impact
          </h2>
          <p className="text-lg text-primary-foreground/80">
            Measurable improvements in healthcare supply chain management across the nation.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {impactData.map((stat) => (
            <div
              key={stat.id}
              className="rounded-xl bg-primary-foreground/5 p-6 text-center backdrop-blur-sm transition-all duration-300"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent">
                <stat.icon className="h-7 w-7 text-accent-foreground" />
              </div>

              <div className="mb-2 text-4xl font-bold text-primary-foreground">
                {formatValue(animatedValues[stat.id] || 0, stat.suffix)}
              </div>

              <div className="mb-2 font-semibold text-primary-foreground">
                {stat.label}
              </div>

              <p className="text-sm text-primary-foreground/60">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
