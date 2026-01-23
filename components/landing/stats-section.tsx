"use client"

import { useEffect, useState, useRef } from "react"
import { Building2, Clock, Shield } from "lucide-react"

interface StatItem {
  id: string
  value: number
  label: string
  suffix: string
  icon: React.ComponentType<{ className?: string }>
}

const statsData: StatItem[] = [
  {
    id: "facilities",
    value: 500,
    label: "Registered Facilities",
    suffix: "+",
    icon: Building2,
  },
  {
    id: "monitoring",
    value: 24,
    label: "Real-time Monitoring",
    suffix: "/7",
    icon: Clock,
  },
  {
    id: "transparency",
    value: 100,
    label: "Data Transparency",
    suffix: "%",
    icon: Shield,
  },
]

export function StatsSection() {
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({})
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Check for prefers-reduced-motion
  const prefersReducedMotion = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  useEffect(() => {
    if (!sectionRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasBeenVisible) {
            setHasBeenVisible(true)
          } else {
            setIsVisible(true)
          }
        } else {
          setIsVisible(false)
          setAnimatedValues({})
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [hasBeenVisible])

  useEffect(() => {
    if (!isVisible || prefersReducedMotion) {
      // Set final values immediately if no animation
      const finalValues: Record<string, number> = {}
      statsData.forEach(stat => {
        finalValues[stat.id] = stat.value
      })
      setAnimatedValues(finalValues)
      return
    }

    // Animation logic - count up from 0 to target value
    const duration = 2000 // 2 seconds total animation
    const steps = 60 // 60 FPS for smooth animation
    const stepDuration = duration / steps

    statsData.forEach(stat => {
      let currentStep = 0
      const increment = stat.value / steps

      const timer = setInterval(() => {
        currentStep++
        const currentValue = Math.min(Math.round(increment * currentStep), stat.value)

        setAnimatedValues(prev => ({
          ...prev,
          [stat.id]: currentValue
        }))

        if (currentStep >= steps) {
          clearInterval(timer)
        }
      }, stepDuration)
    })
  }, [isVisible, prefersReducedMotion])

  return (
    <section ref={sectionRef} className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Trusted by Healthcare Facilities Nationwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform ensures seamless drug supply monitoring with real-time insights and complete transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {statsData.map((stat) => {
            const Icon = stat.icon
            const currentValue = animatedValues[stat.id] || 0
            const isAnimating = isVisible && currentValue < stat.value && !prefersReducedMotion

            return (
              <div
                key={stat.id}
                className="text-center group"
              >
                <div className="relative mb-4">
                  {/* Circular indicator with icon */}
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Animated number with subtle scaling pulse */}
                  <div
                    className={`text-4xl font-bold text-foreground mb-2 transition-transform duration-200 ${
                      isAnimating ? 'scale-110' : 'scale-100'
                    }`}
                    style={{
                      textShadow: isAnimating ? '0 0 10px rgba(var(--primary), 0.3)' : 'none'
                    }}
                  >
                    {currentValue.toLocaleString()}{stat.suffix}
                  </div>
                </div>

                <div className="text-lg font-medium text-foreground mb-1">
                  {stat.label}
                </div>

                {/* Progress indicator during animation */}
                {isAnimating && (
                  <div className="w-full bg-muted rounded-full h-1 mt-2">
                    <div
                      className="bg-primary h-1 rounded-full transition-all duration-200 ease-out"
                      style={{
                        width: `${(currentValue / stat.value) * 100}%`
                      }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
