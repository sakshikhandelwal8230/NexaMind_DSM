"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Loader2 } from "lucide-react"

const mockInsights = [
  "Critical shortage of Amoxicillin detected across 3 facilities - recommend immediate redistribution",
  "Paracetamol expiry approaching in 2 weeks at Central Medical Store - 500 units at risk",
  "Low stock trend for Insulin Glargine increasing - consider bulk reorder",
  "High demand for Metformin observed in urban areas - monitor closely",
  "Batch expiry risk: 15% of current stock expires within 30 days"
]

export function AIInsightsPanel() {
  const [insights, setInsights] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateInsights = async () => {
    setIsGenerating(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setInsights(mockInsights.slice(0, Math.floor(Math.random() * 3) + 3))
    setIsGenerating(false)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Insights
          </CardTitle>
          <CardDescription>Intelligent analysis of inventory patterns</CardDescription>
        </div>
        <Button
          onClick={generateInsights}
          disabled={isGenerating}
          size="sm"
          className="gap-2"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Brain className="h-4 w-4" />
          )}
          {isGenerating ? "Analyzing..." : "Generate"}
        </Button>
      </CardHeader>
      <CardContent>
        {insights.length > 0 ? (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Badge variant="secondary" className="shrink-0 mt-0.5">
                  {index + 1}
                </Badge>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Click "Generate" to analyze current inventory patterns and get actionable insights
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
