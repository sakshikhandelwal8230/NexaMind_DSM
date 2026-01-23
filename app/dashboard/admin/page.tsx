"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { InventoryTable } from "@/components/dashboard/inventory-table"
import { EmergencyToggle } from "@/components/dashboard/emergency-toggle"
import { AIInsightsPanel } from "@/components/dashboard/ai-insights-panel"
import { InventoryHealthGraph } from "@/components/dashboard/inventory-health-graph"
import { ActionCenter } from "@/components/dashboard/action-center"
import { AuthGuard } from "@/components/auth/auth-guard"
import { toast } from "sonner"

type StatusType = "adequate" | "low" | "critical"
type CategoryType = "OTC" | "Prescription"

interface InventoryItem {
  id: number
  name: string
  category: CategoryType
  quantity: number
  threshold: number
  status: StatusType
  facility: string
  expiryDate: string
}

export default function AdminDashboardPage() {
  const [tableFilter, setTableFilter] = useState("all")
  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([])

  const handleFilterChange = (filter: string) => {
    setTableFilter(filter)
  }

  return (
    <AuthGuard>
      <div className="flex h-screen bg-background">
        <DashboardSidebar isAdmin />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader title="Medical Authority Dashboard" subtitle="Monitor drug supply across all facilities" />
          <div style={{ background: 'red', color: 'white', padding: '10px', margin: '10px 0', fontSize: '18px', fontWeight: 'bold' }}>
            __UI_TEST__ - Latest Changes Applied - {new Date().toLocaleTimeString()}
          </div>
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* KPI Cards */}
              <KPICards onFilterChange={handleFilterChange} />

              {/* Emergency Toggle */}
              <EmergencyToggle />

              {/* Two Column Layout */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-6">
                  <InventoryTable
                    externalFilter={tableFilter}
                    onSelectionChange={setSelectedItems}
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <AIInsightsPanel />
                  <InventoryHealthGraph />
                  <AlertsPanel />
                  <ActionCenter selectedItems={selectedItems} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
