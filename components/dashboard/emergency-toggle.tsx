"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { AlertOctagon, Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useEmergency } from "@/app/providers/emergency-context"

export function EmergencyToggle() {
  const { isEmergencyMode, setEmergencyMode } = useEmergency()

  const handleToggle = (checked: boolean) => {
    setEmergencyMode(checked)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Shield className="h-5 w-5 text-primary" />
          Emergency Mode
        </CardTitle>
        <CardDescription>
          Activate emergency protocols for critical situations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-card-foreground">
              Emergency Mode: {isEmergencyMode ? "Active" : "Inactive"}
            </p>
            <p className="text-xs text-muted-foreground">
              When active, all non-essential features are disabled
            </p>
          </div>
          <Switch
            checked={isEmergencyMode}
            onCheckedChange={handleToggle}
            aria-label="Toggle emergency mode"
          />
        </div>
        {isEmergencyMode && (
          <Alert className="mt-4 border-destructive/50 bg-destructive/10">
            <AlertOctagon className="h-4 w-4" />
            <AlertTitle className="text-destructive">Emergency Mode Active</AlertTitle>
            <AlertDescription className="text-destructive/80">
              All standard operations are suspended. Only critical functions are available.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
