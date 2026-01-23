import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/medi.jpeg')" }}
      />

      {/* Overlay (balanced for light + dark) */}
      <div className="absolute inset-0 bg-white/60 dark:bg-[rgba(10,20,40,0.6)]" />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-sm font-medium text-gray-800 dark:bg-white/10 dark:text-gray-200">
            <Shield className="h-4 w-4" />
            Government Authorized Platform
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Preventing Drug Shortages{" "}
            <span className="text-teal-600 dark:text-teal-400">
              Before They Become Critical
            </span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 md:text-xl dark:text-gray-300">
            A centralized digital platform to monitor medicine availability across
            hospitals and pharmacies in real time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="h-12 gap-2 bg-teal-600 px-8 text-white hover:bg-teal-700"
              asChild
            >
              <Link href="/signup">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-12 border-gray-400 px-8 text-gray-800 hover:bg-gray-100 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-white/10"
              asChild
            >
              <Link href="/login">Login to Dashboard</Link>
            </Button>
          </div>

        </div>
      </div>
    </section>
  )
}
