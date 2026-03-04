"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AuthGuard } from "@/components/auth/auth-guard"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { InventoryTable } from "@/components/dashboard/inventory-table"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { ActionCenter } from "@/components/dashboard/action-center"
import { AIInsightsPanel } from "@/components/dashboard/ai-insights-panel"
import { InventoryHealthGraph } from "@/components/dashboard/inventory-health-graph"

export default function UserDashboardPage() {
  const [tableFilter, setTableFilter] = useState("all")
  const [selectedItems, setSelectedItems] = useState<any[]>([])

  return (
    <AuthGuard>
      <div className="flex h-screen bg-background">
        <DashboardSidebar isAdmin={false} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader
            title="Facility Dashboard"
            subtitle="Real-time medicine supply monitoring and inventory management."
          />

          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Real-time KPI Stats */}
            <KPICards onFilterChange={setTableFilter} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Inventory Control */}
              <div className="lg:col-span-2 space-y-6">
                <InventoryTable
                  externalFilter={tableFilter}
                  onSelectionChange={setSelectedItems}
                />
              </div>

              {/* Sidebar Controls & Insights */}
              <div className="space-y-6">
                <InventoryHealthGraph />
                <ActionCenter selectedItems={selectedItems} />
                <AIInsightsPanel />
                <AlertsPanel />
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
