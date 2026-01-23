"use client"

import React, { useState, useEffect, useMemo } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { KpiCard } from "@/components/dashboard/KpiCard"
import { InsightsPanel } from "@/components/dashboard/InsightsPanel"
import { HealthGraph } from "@/components/dashboard/HealthGraph"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { AlertsPanel } from "@/components/dashboard/AlertsPanel"
import { InventoryTable } from "@/components/dashboard/InventoryTable"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import {
  Package,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Truck,
  ShoppingCart,
  TrendingUp,
  TrendingDown
} from "lucide-react"
import type { InventoryItem } from "@/lib/types"

// Mock data with 12 realistic medicine entries
const mockInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    category: "OTC",
    batch: "PCM-2024-001",
    qty: 1500,
    minThreshold: 200,
    expiryDate: "2027-06-15",
    status: "available",
  },
  {
    id: "2",
    name: "Amoxicillin 250mg",
    category: "Prescription",
    batch: "AMX-2024-045",
    qty: 15,
    minThreshold: 100,
    expiryDate: "2026-03-20",
    status: "critical",
  },
  {
    id: "3",
    name: "Ibuprofen 400mg",
    category: "OTC",
    batch: "IBU-2024-112",
    qty: 890,
    minThreshold: 150,
    expiryDate: "2027-09-10",
    status: "available",
  },
  {
    id: "4",
    name: "Metformin 500mg",
    category: "Prescription",
    batch: "MET-2024-089",
    qty: 45,
    minThreshold: 50,
    expiryDate: "2026-12-01",
    status: "low",
  },
  {
    id: "5",
    name: "Cetirizine 10mg",
    category: "OTC",
    batch: "CET-2024-056",
    qty: 320,
    minThreshold: 100,
    expiryDate: "2027-04-25",
    status: "available",
  },
  {
    id: "6",
    name: "Omeprazole 20mg",
    category: "Prescription",
    batch: "OMP-2024-033",
    qty: 0,
    minThreshold: 75,
    expiryDate: "2026-08-18",
    status: "critical",
  },
  {
    id: "7",
    name: "Aspirin 100mg",
    category: "OTC",
    batch: "ASP-2024-078",
    qty: 2200,
    minThreshold: 300,
    expiryDate: "2027-11-30",
    status: "available",
  },
  {
    id: "8",
    name: "Ciprofloxacin 500mg",
    category: "Prescription",
    batch: "CIP-2024-019",
    qty: 28,
    minThreshold: 60,
    expiryDate: "2026-05-12",
    status: "low",
  },
  {
    id: "9",
    name: "Insulin Glargine",
    category: "Prescription",
    batch: "INS-2024-067",
    qty: 85,
    minThreshold: 120,
    expiryDate: "2024-12-15",
    status: "low",
  },
  {
    id: "10",
    name: "Atorvastatin 10mg",
    category: "Prescription",
    batch: "ATO-2024-034",
    qty: 67,
    minThreshold: 80,
    expiryDate: "2026-07-22",
    status: "low",
  },
  {
    id: "11",
    name: "Loratadine 10mg",
    category: "OTC",
    batch: "LOR-2024-091",
    qty: 445,
    minThreshold: 100,
    expiryDate: "2027-02-14",
    status: "available",
  },
  {
    id: "12",
    name: "Prednisone 5mg",
    category: "Prescription",
    batch: "PRE-2024-052",
    qty: 12,
    minThreshold: 50,
    expiryDate: "2026-10-08",
    status: "critical",
  },
]

const getStatus = (item: InventoryItem): "Adequate" | "Low Stock" | "Critical" => {
  if (item.qty === 0) return "Critical"
  if (item.qty < item.minThreshold) return "Low Stock"
  return "Adequate"
}

export default function DashboardPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [activeKpi, setActiveKpi] = useState<string | null>(null)
  const [tableFilter, setTableFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [viewingItemId, setViewingItemId] = useState<string | null>(null)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setInventory(mockInventory)
      setIsLoading(false)
    }, 700)
    return () => clearTimeout(timer)
  }, [])

  const kpiData = useMemo(() => {
    if (inventory.length === 0) return []

    const totalMedicines = inventory.length
    const lowStockCount = inventory.filter(item => getStatus(item) === "Low Stock").length
    const criticalCount = inventory.filter(item => getStatus(item) === "Critical").length
    const expiringCount = inventory.filter(item => {
      const expiryDate = new Date(item.expiryDate)
      const now = new Date()
      const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays <= 30 && diffDays > 0
    }).length

    return [
      {
        id: "total",
        title: "Total Medicines",
        value: totalMedicines,
        change: "+5.2%",
        changeType: "positive" as const,
        icon: Package,
        description: "Active inventory items",
      },
      {
        id: "low-stock",
        title: "Low Stock",
        value: lowStockCount,
        change: lowStockCount > 0 ? `-${Math.round((lowStockCount / totalMedicines) * 100)}%` : "+0%",
        changeType: lowStockCount > 0 ? "negative" as const : "neutral" as const,
        icon: AlertTriangle,
        description: "Below threshold levels",
      },
      {
        id: "critical",
        title: "Critical Shortages",
        value: criticalCount,
        change: criticalCount > 0 ? `+${criticalCount * 10}%` : "+0%",
        changeType: criticalCount > 0 ? "negative" as const : "neutral" as const,
        icon: AlertOctagon,
        description: "Immediate attention needed",
      },
      {
        id: "expiring",
        title: "Expiring Soon",
        value: expiringCount,
        change: expiringCount > 0 ? `+${expiringCount * 5}%` : "+0%",
        changeType: expiringCount > 0 ? "negative" as const : "neutral" as const,
        icon: Clock,
        description: "Within 30 days",
      },
      {
        id: "transfers",
        title: "Transfers Pending",
        value: 3, // Mock
        change: "+2",
        changeType: "neutral" as const,
        icon: Truck,
        description: "Awaiting approval",
      },
      {
        id: "reorder",
        title: "Reorder Queue",
        value: selectedItems.length,
        change: selectedItems.length > 0 ? `+${selectedItems.length}` : "+0",
        changeType: "neutral" as const,
        icon: ShoppingCart,
        description: "Marked for reorder",
      },
    ]
  }, [inventory, selectedItems])

  const handleKpiClick = (kpiId: string) => {
    setActiveKpi(kpiId)
    switch (kpiId) {
      case "total":
        setTableFilter("all")
        break
      case "low-stock":
        setTableFilter("Low Stock")
        break
      case "critical":
        setTableFilter("Critical")
        break
      case "expiring":
        setTableFilter("expiring")
        break
      default:
        setTableFilter("all")
    }
    // Scroll to table
    document.getElementById("inventory-table")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleViewItem = (itemId: string) => {
    setViewingItemId(itemId)
    const item = inventory.find(i => i.id === itemId)
    if (item) {
      toast.info(`Viewing details for ${item.name}`)
    }
  }

  const handleTransferRequest = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select items to transfer")
      return
    }
    toast.success(`Transfer request created for ${selectedItems.length} item(s)`)
    // In real app, this would call an API
  }

  const handleReorderMark = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select items to reorder")
      return
    }
    toast.success(`${selectedItems.length} item(s) marked for reorder`)
    // In real app, this would update state
  }

  if (isLoading) {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader title="Medical Authority Dashboard" subtitle="Monitor drug supply across all facilities" />
        <div style={{ background: 'red', color: 'white', padding: '15px', margin: '10px 0', fontSize: '20px', fontWeight: 'bold', textAlign: 'center', border: '3px solid yellow' }}>
          🔴 UI VERSION: FACILITY DASHBOARD - UPDATED {new Date().toLocaleString()} 🔴
        </div>
        <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* KPI Skeleton */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>

              {/* Table Skeleton */}
              <Skeleton className="h-96" />
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader title="Medical Authority Dashboard" subtitle="Monitor drug supply across all facilities" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {kpiData.map((kpi) => (
                <KpiCard
                  key={kpi.id}
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change}
                  changeType={kpi.changeType}
                  icon={kpi.icon}
                  description={kpi.description}
                  onClick={() => handleKpiClick(kpi.id)}
                  isActive={activeKpi === kpi.id}
                />
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left Column - Table */}
              <div className="lg:col-span-2" id="inventory-table">
                <InventoryTable
                  inventory={inventory}
                  selectedItems={selectedItems}
                  onSelectionChange={setSelectedItems}
                  onViewItem={handleViewItem}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <InsightsPanel inventory={inventory} />
                <HealthGraph inventory={inventory} />
                <AlertsPanel
                  inventory={inventory}
                  onViewItem={handleViewItem}
                />
                <QuickActions
                  selectedItems={selectedItems.map(id => inventory.find(item => item.id === id)!).filter(Boolean)}
                  onTransferRequest={handleTransferRequest}
                  onReorderMark={handleReorderMark}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
