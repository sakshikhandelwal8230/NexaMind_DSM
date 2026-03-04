"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { InventoryTable } from "@/components/dashboard/inventory-table"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { ActionCenter } from "@/components/dashboard/action-center"
import { AIInsightsPanel } from "@/components/dashboard/ai-insights-panel"
import { InventoryHealthGraph } from "@/components/dashboard/inventory-health-graph"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useSupabase } from "@/hooks/useSupabase"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { loading } = useSupabase<any>("medicines")
  const [selectedItems, setSelectedItems] = useState<any[]>([])

  return (
    <AuthGuard>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader
            title="Surveillance Hub"
            subtitle="Central monitoring and supply intelligence"
          />

          <main className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-primary/10">
            {loading ? (
              <div className="h-[80vh] flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
              </div>
            ) : (
              <>
                {/* Key Performance Indicators */}
                <KPICards />

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Left Column: Analytics and Real-time Table */}
                  <div className="xl:col-span-2 space-y-8">
                    <InventoryHealthGraph />
                    <InventoryTable onSelectionChange={setSelectedItems} />
                  </div>

                  {/* Right Column: AI Insights & Emergency Monitoring */}
                  <div className="space-y-8">
                    <AIInsightsPanel />
                    <AlertsPanel />
                    <ActionCenter selectedItems={selectedItems} />
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
