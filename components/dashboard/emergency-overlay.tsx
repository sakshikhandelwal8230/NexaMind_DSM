"use client"

import { useEmergency } from "@/app/providers/emergency-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertOctagon, Shield } from "lucide-react"

export function EmergencyOverlay() {
  const { isEmergencyMode } = useEmergency()

  if (!isEmergencyMode) return null

  return (
    <div className="fixed inset-0 z-50 bg-red-500/20 backdrop-blur-sm">
      <div className="absolute top-4 left-4 right-4">
        <Alert className="border-red-500 bg-red-500/10 shadow-lg">
          <AlertOctagon className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-red-600">Emergency Mode Active</AlertTitle>
          <AlertDescription className="text-red-600/80">
            Critical supply monitoring enabled. Filters and search disabled. Only critical medicines displayed.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
