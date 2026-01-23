"use client"

import { useMemo, useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AuthGuard } from "@/components/auth/auth-guard"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { toast } from "sonner"
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Package,
  ShoppingCart,
  Sparkles,
  Truck,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "lucide-react"

import type { InventoryItem, Transfer, Alert, ReorderItem, StockStatus } from "@/lib/types"
import { addTransferRequest, emitTransferUpdated, type TransferRequest, type TransferRequestItem } from "@/lib/dms-storage"

// -------------------- Mocked data (frontend-only) --------------------
const mockInventory: InventoryItem[] = [
  { id: "1", name: "Aspirin", category: "OTC", batch: "B001", qty: 150, minThreshold: 50, expiryDate: "2026-12-31", status: "available" },
  { id: "2", name: "Ibuprofen", category: "OTC", batch: "B002", qty: 30, minThreshold: 50, expiryDate: "2026-11-15", status: "low" },
  { id: "3", name: "Amoxicillin", category: "Prescription", batch: "B003", qty: 0, minThreshold: 20, expiryDate: "2026-10-20", status: "critical" },
  { id: "4", name: "Metformin", category: "Prescription", batch: "B004", qty: 25, minThreshold: 30, expiryDate: "2026-01-10", status: "low" },
  { id: "5", name: "Lisinopril", category: "Prescription", batch: "B005", qty: 80, minThreshold: 40, expiryDate: "2026-09-05", status: "available" },
  { id: "6", name: "Simvastatin", category: "Prescription", batch: "B006", qty: 10, minThreshold: 25, expiryDate: "2026-08-30", status: "critical" },
  { id: "7", name: "Omeprazole", category: "OTC", batch: "B007", qty: 60, minThreshold: 30, expiryDate: "2026-12-15", status: "available" },
  { id: "8", name: "Paracetamol", category: "OTC", batch: "B008", qty: 45, minThreshold: 50, expiryDate: "2026-11-30", status: "low" },
  { id: "9", name: "Ciprofloxacin", category: "Prescription", batch: "B009", qty: 15, minThreshold: 20, expiryDate: "2026-10-10", status: "low" },
  { id: "10", name: "Diazepam", category: "Prescription", batch: "B010", qty: 5, minThreshold: 10, expiryDate: "2026-09-20", status: "critical" },
  { id: "11", name: "Vitamin C", category: "OTC", batch: "B011", qty: 200, minThreshold: 100, expiryDate: "2027-02-28", status: "available" },
  { id: "12", name: "Insulin", category: "Prescription", batch: "B012", qty: 20, minThreshold: 15, expiryDate: "2026-08-15", status: "available" },
  { id: "13", name: "Hydrochlorothiazide", category: "Prescription", batch: "B013", qty: 35, minThreshold: 25, expiryDate: "2026-11-25", status: "available" },
  { id: "14", name: "Prednisone", category: "Prescription", batch: "B014", qty: 8, minThreshold: 12, expiryDate: "2026-10-05", status: "critical" },
  { id: "15", name: "Loratadine", category: "OTC", batch: "B015", qty: 70, minThreshold: 40, expiryDate: "2026-12-20", status: "available" },
]

const mockTransfers: Transfer[] = [
  { id: "t1", itemId: "2", fromFacility: "Central Hospital", toFacility: "Clinic A", quantity: 20, status: "pending" },
]

const mockAlerts: Alert[] = [
  { id: "a1", itemId: "2", type: "low_stock", message: "Ibuprofen stock is below threshold by 20 units", resolved: false },
  { id: "a2", itemId: "3", type: "critical", message: "Amoxicillin is out of stock", resolved: false },
  { id: "a3", itemId: "6", type: "expiring", message: "Simvastatin expires soon", resolved: false },
]

const mockReorderQueue: ReorderItem[] = []

// -------------------- Helpers --------------------
function daysUntil(dateStr: string) {
  const now = new Date()
  const d = new Date(dateStr)
  const diff = d.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function statusBadge(status: StockStatus) {
  if (status === "available") {
    return (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200" variant="secondary">
        Available
      </Badge>
    )
  }
  if (status === "low") {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200" variant="secondary">
        Low
      </Badge>
    )
  }
  return <Badge variant="destructive">Critical</Badge>
}

function trendBadge(delta: number) {
  const positive = delta >= 0
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        positive
          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200"
          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",
      ].join(" ")}
    >
      {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {positive ? "+" : ""}
      {delta}% vs last week
    </span>
  )
}

// -------------------- Page --------------------
export default function UserDashboardPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [transfers, setTransfers] = useState<Transfer[]>(mockTransfers)
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [reorderQueue, setReorderQueue] = useState<ReorderItem[]>(mockReorderQueue)

  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<StockStatus | "all">("all")
  const [categoryFilter, setCategoryFilter] = useState<"OTC" | "Prescription" | "all">("all")
  const [expiryFilter, setExpiryFilter] = useState<"30" | "60" | "90" | "all">("all")
  const [sortBy, setSortBy] = useState<"name" | "qty" | "expiryDate">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const [aiInsights, setAiInsights] = useState<string[]>([
    "Metformin is below threshold by 5 units",
    "3 items are in critical state — prioritize reorder",
    "2 items may expire soon — consider transfer/usage plan",
    "Tip: Use KPI cards to filter table quickly",
  ])
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false)

  const [kpiFilter, setKpiFilter] = useState<"low" | "critical" | null>(null)
  const [expiringWindow, setExpiringWindow] = useState<30 | 60>(30)

  const [alertTab, setAlertTab] = useState<"all" | "critical" | "low_stock" | "expiring">("all")
  const [openDetailsId, setOpenDetailsId] = useState<string | null>(null)
  const [kpiModal, setKpiModal] = useState<null | "total" | "low" | "critical" | "expiring" | "transfers" | "reorder">(null)
  const [showAllTotalItems, setShowAllTotalItems] = useState(false)

  const expiringCount = useMemo(() => {
    return inventory.filter((i) => daysUntil(i.expiryDate) <= expiringWindow).length
  }, [inventory, expiringWindow])

  const kpis = useMemo(() => {
    const total = inventory.length
    const low = inventory.filter((i) => i.status === "low").length
    const critical = inventory.filter((i) => i.status === "critical").length
    const pendingTransfers = transfers.filter((t) => t.status === "pending").length
    const reorder = reorderQueue.length

    // demo trend values
    const trend = { total: 4, low: -6, critical: 12, expiring: 8, transfers: 15, reorder: 10 }

    return { total, low, critical, expiring: expiringCount, pendingTransfers, reorder, trend }
  }, [inventory, transfers, reorderQueue, expiringCount])

  const filteredInventory = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    let list = inventory.filter((item) => {
      const matchesSearch =
        term.length === 0 ||
        item.name.toLowerCase().includes(term) ||
        item.batch.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)

      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

      const matchesExpiry =
        expiryFilter === "all" ||
        (() => {
          const days = parseInt(expiryFilter, 10)
          return daysUntil(item.expiryDate) <= days
        })()

      const matchesKpi =
        !kpiFilter ||
        (kpiFilter === "low" && item.status === "low") ||
        (kpiFilter === "critical" && item.status === "critical")

      return matchesSearch && matchesStatus && matchesCategory && matchesExpiry && matchesKpi
    })

    list = list.sort((a, b) => {
      let av: string | number = ""
      let bv: string | number = ""
      if (sortBy === "name") {
        av = a.name.toLowerCase()
        bv = b.name.toLowerCase()
      } else if (sortBy === "qty") {
        av = a.qty
        bv = b.qty
      } else {
        av = new Date(a.expiryDate).getTime()
        bv = new Date(b.expiryDate).getTime()
      }
      if (sortOrder === "asc") return av < bv ? -1 : av > bv ? 1 : 0
      return av > bv ? -1 : av < bv ? 1 : 0
    })

    return list
  }, [inventory, searchTerm, statusFilter, categoryFilter, expiryFilter, sortBy, sortOrder, kpiFilter])

  const health = useMemo(() => {
    const available = inventory.filter((i) => i.status === "available").length
    const low = inventory.filter((i) => i.status === "low").length
    const critical = inventory.filter((i) => i.status === "critical").length
    const total = Math.max(1, inventory.length)
    const aP = Math.round((available / total) * 100)
    const lP = Math.round((low / total) * 100)
    const cP = Math.max(0, 100 - aP - lP)
    return { available, low, critical, aP, lP, cP }
  }, [inventory])

  const selectedItems = useMemo(() => {
    const set = new Set(selectedRows)
    return inventory.filter((i) => set.has(i.id))
  }, [inventory, selectedRows])

  const detailsItem = useMemo(() => {
    if (!openDetailsId) return null
    return inventory.find((i) => i.id === openDetailsId) ?? null
  }, [openDetailsId, inventory])

  const activeAlerts = useMemo(() => alerts.filter((a) => !a.resolved), [alerts])
  const resolvedAlerts = useMemo(() => alerts.filter((a) => a.resolved), [alerts])

  const visibleAlerts = useMemo(() => {
    if (alertTab === "all") return activeAlerts
    return activeAlerts.filter((a) => a.type === alertTab)
  }, [activeAlerts, alertTab])

  function toggleSelect(id: string) {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function toggleSelectAll() {
    if (filteredInventory.length === 0) return
    setSelectedRows((prev) => (prev.length === filteredInventory.length ? [] : filteredInventory.map((i) => i.id)))
  }

  function createTransferRequest(items?: InventoryItem[]) {
    const itemsToUse = items || selectedItems
    if (itemsToUse.length === 0) {
      toast.error("Select at least 1 item to create transfer request.")
      return
    }
    
    // Create transfer request items for storage
    const transferItems: TransferRequestItem[] = itemsToUse.map((it) => ({
      name: it.name,
      batchNo: it.batch,
      requestedQty: clamp(Math.max(5, Math.ceil(it.minThreshold / 2)), 5, 50),
      currentQty: it.qty,
      threshold: it.minThreshold,
    }))

    // Create the transfer request for persistent storage
    const transferRequest: TransferRequest = {
      id: `TRF-${Date.now()}`,
      createdAt: new Date().toISOString(),
      from: "Current Facility",
      to: "Nearby Facility",
      priority: itemsToUse.some(it => it.status === "critical") ? "Critical" : "Normal",
      status: "Requested",
      notes: `Transfer request for ${itemsToUse.length} item(s)`,
      items: transferItems,
    }

    // Save to localStorage so it appears in Transfers page
    addTransferRequest(transferRequest)
    emitTransferUpdated()

    // Also update local state for immediate UI feedback
    const newTransfers: Transfer[] = itemsToUse.map((it) => ({
      id: `t_${Date.now()}_${it.id}`,
      itemId: it.id,
      fromFacility: "Current Facility",
      toFacility: "Nearby Facility",
      quantity: clamp(Math.max(5, Math.ceil(it.minThreshold / 2)), 5, 50),
      status: "pending",
    }))
    setTransfers((p) => [...p, ...newTransfers])
    toast.success(`Created transfer request for ${itemsToUse.length} item(s). View in Transfers section.`)
    if (!items) setSelectedRows([])
  }

  function markSelectedForReorder(items?: InventoryItem[]) {
    const itemsToUse = items || selectedItems
    if (itemsToUse.length === 0) {
      toast.error("Select at least 1 item to mark for reorder.")
      return
    }
    const newItems: ReorderItem[] = itemsToUse.map((it) => ({
      id: `r_${Date.now()}_${it.id}`,
      itemId: it.id,
      quantity: Math.max(25, it.minThreshold * 2),
      status: "pending",
    }))
    setReorderQueue((p) => [...p, ...newItems])
    toast.success(`Added ${newItems.length} item(s) to reorder queue.`)
    if (!items) setSelectedRows([])
  }

  function exportCSV() {
    const rows = [
      ["Name", "Category", "Batch", "Qty", "MinThreshold", "ExpiryDate", "Status"],
      ...filteredInventory.map((i) => [i.name, i.category, i.batch, String(i.qty), String(i.minThreshold), i.expiryDate, i.status]),
    ]
    const csv = rows.map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "inventory.csv"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("CSV exported.")
  }

  function resolveAlert(id: string) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)))
    toast.success("Alert resolved.")
  }

  function viewAlertItem(itemId: string) {
    setOpenDetailsId(itemId)
  }

  function generateInsights() {
    setIsGeneratingInsights(true)
    setTimeout(() => {
      const lows = inventory.filter((i) => i.status === "low")
      const crits = inventory.filter((i) => i.status === "critical")
      const exp30 = inventory.filter((i) => daysUntil(i.expiryDate) <= 30)

      const newInsights: string[] = [
        crits.length ? `${crits[0].name} is critical — reorder or transfer today` : "No critical stock detected — good stability",
        lows.length ? `${lows.length} items are low — consider reorder batching` : "Low stock items are under control",
        exp30.length ? `${exp30.length} items expire within 30 days — prioritize distribution` : "No near-term expiry risk (30 days)",
        "Tip: Use KPI cards to drill down quickly for judges demo",
      ]

      setAiInsights(newInsights)
      setIsGeneratingInsights(false)
      toast.success("Recommendations generated (demo).")
    }, 900)
  }



  return (
    <AuthGuard>
      <div className="min-h-screen w-full bg-background flex">
        <div className="h-screen sticky top-0">
          <DashboardSidebar isAdmin={false} />
        </div>

        <div className="flex-1 flex flex-col min-h-screen">
          <DashboardHeader title="Facility Dashboard" subtitle="Medicine supply command center" />

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="grid h-full min-h-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              {/* LEFT (scroll inside) */}
              <div className="min-h-0 space-y-6 overflow-auto pr-1">
                {/* KPI Row */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <Card className="cursor-pointer transition hover:shadow-md" onClick={() => setKpiModal("total")}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-3xl font-semibold">{kpis.total}</div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">Inventory items tracked</p>
                        {trendBadge(kpis.trend.total)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer transition hover:shadow-md" onClick={() => setKpiModal("low")}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-3xl font-semibold">
                        {kpis.low}{" "}
                        <span className="text-sm text-muted-foreground">
                          ({((kpis.low / Math.max(1, kpis.total)) * 100).toFixed(0)}%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">Below min threshold</p>
                        {trendBadge(kpis.trend.low)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer transition hover:shadow-md" onClick={() => setKpiModal("critical")}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Critical</CardTitle>
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-3xl font-semibold">{kpis.critical}</div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">Out of stock / urgent</p>
                        {trendBadge(kpis.trend.critical)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer transition hover:shadow-md" onClick={() => setKpiModal("expiring")}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-end justify-between">
                        <div className="text-3xl font-semibold">{kpis.expiring}</div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={expiringWindow === 30 ? "default" : "outline"}
                            onClick={() => setExpiringWindow(30)}
                          >
                            30d
                          </Button>
                          <Button
                            size="sm"
                            variant={expiringWindow === 60 ? "default" : "outline"}
                            onClick={() => setExpiringWindow(60)}
                          >
                            60d
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">Batches nearing expiry</p>
                        {trendBadge(kpis.trend.expiring)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer transition hover:shadow-md" onClick={() => setKpiModal("transfers")}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Transfers Pending</CardTitle>
                      <Truck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-3xl font-semibold">{kpis.pendingTransfers}</div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
                        {trendBadge(kpis.trend.transfers)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer transition hover:shadow-md" onClick={() => setKpiModal("reorder")}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Reorder Queue</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-3xl font-semibold">{kpis.reorder}</div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">Items to purchase</p>
                        {trendBadge(kpis.trend.reorder)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Inventory Table */}
                <Card>
                  <CardHeader className="space-y-1">
                    <CardTitle>Inventory Management</CardTitle>
                    <CardDescription>Search, filter, select items & take quick actions</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Controls */}
                    <div className="flex flex-wrap gap-2 justify-between">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input
                          placeholder="Search medicines..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="sm:w-[280px]"
                        />

                        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StockStatus | "all")}>
                          <SelectTrigger className="sm:w-[140px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All status</SelectItem>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as "OTC" | "Prescription" | "all")}>
                          <SelectTrigger className="sm:w-[160px]">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All categories</SelectItem>
                            <SelectItem value="OTC">OTC</SelectItem>
                            <SelectItem value="Prescription">Prescription</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select value={expiryFilter} onValueChange={(v) => setExpiryFilter(v as "30" | "60" | "90" | "all")}>
                          <SelectTrigger className="sm:w-[150px]">
                            <SelectValue placeholder="Expiry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All expiry</SelectItem>
                            <SelectItem value="30">≤ 30 days</SelectItem>
                            <SelectItem value="60">≤ 60 days</SelectItem>
                            <SelectItem value="90">≤ 90 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-between">
                        <Button variant="outline" onClick={exportCSV}>
                          <Download className="mr-2 h-4 w-4" />
                          Export CSV
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => setSortBy(sortBy === "name" ? "qty" : sortBy === "qty" ? "expiryDate" : "name")}
                        >
                          Sort: {sortBy === "name" ? "Name" : sortBy === "qty" ? "Qty" : "Expiry"}
                        </Button>

                        <Button variant="outline" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                          {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
                        </Button>
                      </div>
                    </div>

                    {/* Bulk actions */}
                    <div className="flex flex-wrap gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedRows.length > 0 && selectedRows.length === filteredInventory.length}
                          onCheckedChange={toggleSelectAll}
                        />
                        <span className="text-sm text-muted-foreground">
                          Select all ({selectedRows.length}/{filteredInventory.length})
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-between">
                        <Button size="sm" onClick={() => createTransferRequest()} disabled={selectedRows.length === 0}>
                          <Truck className="mr-2 h-4 w-4" />
                          Create Transfer
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => markSelectedForReorder()} disabled={selectedRows.length === 0}>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Mark for Reorder
                        </Button>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[44px]"></TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Batch</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Expiry</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {filteredInventory.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                                No items match your filters.
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredInventory.map((item) => {
                              const d = daysUntil(item.expiryDate)
                              const expiryPill =
                                d <= 30 ? (
                                  <Badge variant="destructive">≤ 30d</Badge>
                                ) : d <= 60 ? (
                                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200" variant="secondary">
                                    ≤ 60d
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">OK</Badge>
                                )

                              return (
                                <TableRow key={item.id}>
                                  <TableCell>
                                    <Checkbox checked={selectedRows.includes(item.id)} onCheckedChange={() => toggleSelect(item.id)} />
                                  </TableCell>

                                  <TableCell 
                                    className="font-medium cursor-pointer hover:text-primary"
                                    onClick={() => toggleSelect(item.id)}
                                  >
                                    {item.name}
                                  </TableCell>
                                  <TableCell>{item.category}</TableCell>
                                  <TableCell className="text-muted-foreground">{item.batch}</TableCell>
                                  <TableCell className="text-right">{item.qty}</TableCell>
                                  <TableCell>{statusBadge(item.status)}</TableCell>
                                  <TableCell className="flex items-center gap-2">
                                    {expiryPill}
                                    <span className="text-xs text-muted-foreground">{item.expiryDate}</span>
                                  </TableCell>

                                  <TableCell className="text-right">
                                    <Button size="sm" variant="outline" onClick={() => setOpenDetailsId(item.id)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              )
                            })
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Small hint */}
                    <p className="text-xs text-muted-foreground">
                      Tip: Click KPI cards (Low/Critical) to filter table quickly.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* RIGHT (scroll inside) */}
              <div className="min-h-0 space-y-6 overflow-auto pr-1 lg:sticky lg:top-6 self-start">
                {/* Inventory Health */}
                <Card>
                  <CardHeader className="space-y-1">
                    <CardTitle>Inventory Health</CardTitle>
                    <CardDescription>Simple distribution (no chart library)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Available</span>
                        <span className="font-medium">{health.available}</span>
                      </div>
                      <div className="h-2 w-full rounded bg-muted">
                        <div className="h-2 rounded bg-green-500" style={{ width: `${health.aP}%` }} />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Low</span>
                        <span className="font-medium">{health.low}</span>
                      </div>
                      <div className="h-2 w-full rounded bg-muted">
                        <div className="h-2 rounded bg-yellow-500" style={{ width: `${health.lP}%` }} />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Critical</span>
                        <span className="font-medium">{health.critical}</span>
                      </div>
                      <div className="h-2 w-full rounded bg-muted">
                        <div className="h-2 rounded bg-red-500" style={{ width: `${health.cP}%` }} />
                      </div>
                    </div>

                    <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
                      Tip: Click KPI cards to filter table quickly for judges demo.
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader className="space-y-1">
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Actions work via local state + toast</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full" onClick={() => createTransferRequest()} disabled={selectedRows.length === 0}>
                      <Truck className="mr-2 h-4 w-4" />
                      Create Transfer Request
                    </Button>

                    <Button className="w-full" variant="secondary" onClick={() => markSelectedForReorder()} disabled={selectedRows.length === 0}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Mark Selected for Reorder
                    </Button>

                    <Button className="w-full" variant="outline" onClick={() => exportCSV()}>
                      <Download className="mr-2 h-4 w-4" />
                      Export CSV
                    </Button>

                    <p className="text-xs text-muted-foreground">
                      Select rows in table first to enable transfer/reorder.
                    </p>
                  </CardContent>
                </Card>

                {/* Alerts + AI */}
                <Card>
                  <CardHeader className="space-y-1">
                    <CardTitle>Alerts & Insights</CardTitle>
                    <CardDescription>Resolve alerts & generate recommendations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Tabs value={alertTab} onValueChange={(v) => setAlertTab(v as any)}>
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="critical">Critical</TabsTrigger>
                        <TabsTrigger value="low_stock">Low</TabsTrigger>
                        <TabsTrigger value="expiring">Expiry</TabsTrigger>
                      </TabsList>

                      <TabsContent value={alertTab} className="mt-3 space-y-2">
                        {visibleAlerts.length === 0 ? (
                          <div className="rounded-md border p-3 text-sm text-muted-foreground">No active alerts here.</div>
                        ) : (
                          visibleAlerts.map((a) => (
                            <div key={a.id} className="rounded-md border p-3">
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    {a.type === "critical" ? (
                                      <Badge variant="destructive">Critical</Badge>
                                    ) : a.type === "low_stock" ? (
                                      <Badge
                                        className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200"
                                        variant="secondary"
                                      >
                                        Low
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary">Expiring</Badge>
                                    )}
                                    <span className="text-sm font-medium">{a.message}</span>
                                  </div>
                                  <div className="text-xs text-muted-foreground">Item ID: {a.itemId}</div>
                                </div>

                                <div className="flex flex-col gap-2">
                                  <Button size="sm" variant="outline" onClick={() => viewAlertItem(a.itemId)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </Button>
                                  <Button size="sm" onClick={() => resolveAlert(a.id)}>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Resolve
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </TabsContent>
                    </Tabs>

                    <div className="rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm font-medium">AI Insights</p>
                        </div>
                        <Button size="sm" onClick={generateInsights} disabled={isGeneratingInsights}>
                          {isGeneratingInsights ? "Generating..." : "Generate"}
                        </Button>
                      </div>

                      <div className="mt-3 space-y-2">
                        {aiInsights.map((x, idx) => (
                          <div key={idx} className="text-sm text-muted-foreground">
                            • {x}
                          </div>
                        ))}
                      </div>
                    </div>

                    {resolvedAlerts.length > 0 && (
                      <div className="rounded-md border bg-muted/20 p-3">
                        <p className="text-sm font-medium">Resolved</p>
                        <div className="mt-2 space-y-1">
                          {resolvedAlerts.slice(0, 3).map((a) => (
                            <div key={a.id} className="text-xs text-muted-foreground">
                              ✓ {a.message}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>

        {/* KPI Modal */}
        <Dialog open={!!kpiModal} onOpenChange={(o) => { if (!o) { setKpiModal(null); setShowAllTotalItems(false); } }}>
          <DialogContent className="max-w-2xl max-h-[60vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {kpiModal === "total" && "Total Medicines Details"}
                {kpiModal === "low" && "Low Stock Details"}
                {kpiModal === "critical" && "Critical Stock Details"}
                {kpiModal === "expiring" && "Expiring Soon Details"}
                {kpiModal === "transfers" && "Pending Transfers Details"}
                {kpiModal === "reorder" && "Reorder Queue Details"}
              </DialogTitle>
              <DialogDescription>
                {kpiModal === "total" && "All inventory items currently tracked"}
                {kpiModal === "low" && "Items below minimum threshold"}
                {kpiModal === "critical" && "Items out of stock or critically low"}
                {kpiModal === "expiring" && `Items expiring within ${expiringWindow} days`}
                {kpiModal === "transfers" && "Pending transfer requests"}
                {kpiModal === "reorder" && "Items marked for reorder"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {kpiModal === "total" && (
                <div className="space-y-2">
                  {inventory.slice(0, showAllTotalItems ? inventory.length : 10).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.batch}</div>
                        <div className="text-sm">{item.qty}</div>
                        {statusBadge(item.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">{item.expiryDate}</div>
                    </div>
                  ))}
                  {inventory.length > 10 && !showAllTotalItems && (
                    <Button
                      variant="ghost"
                      className="w-full text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setShowAllTotalItems(true)}
                    >
                      ... and {inventory.length - 10} more items (click to show all)
                    </Button>
                  )}
                  {showAllTotalItems && inventory.length > 10 && (
                    <Button
                      variant="ghost"
                      className="w-full text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setShowAllTotalItems(false)}
                    >
                      Show less
                    </Button>
                  )}
                </div>
              )}

              {(kpiModal === "low" || kpiModal === "critical" || kpiModal === "expiring") && (
                <div className="space-y-2">
                  {(() => {
                    let items: InventoryItem[] = []
                    if (kpiModal === "low") items = inventory.filter(i => i.status === "low")
                    if (kpiModal === "critical") items = inventory.filter(i => i.status === "critical")
                    if (kpiModal === "expiring") items = inventory.filter(i => daysUntil(i.expiryDate) <= expiringWindow)
                    return items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.batch}</div>
                          <div className="text-sm">{item.qty}</div>
                          {statusBadge(item.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">{item.expiryDate}</div>
                      </div>
                    ))
                  })()}
                </div>
              )}

              {kpiModal === "transfers" && (
                <div className="space-y-2">
                  {transfers.filter(t => t.status === "pending").map((transfer) => {
                    const item = inventory.find(i => i.id === transfer.itemId)
                    return (
                      <div key={transfer.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <div className="font-medium">{item?.name || "Unknown"}</div>
                          <div className="text-sm text-muted-foreground">{transfer.quantity} units</div>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{transfer.toFacility}</div>
                      </div>
                    )
                  })}
                </div>
              )}

              {kpiModal === "reorder" && (
                <div className="space-y-2">
                  {reorderQueue.map((reorder) => {
                    const item = inventory.find(i => i.id === reorder.itemId)
                    return (
                      <div key={reorder.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <div className="font-medium">{item?.name || "Unknown"}</div>
                          <div className="text-sm text-muted-foreground">{reorder.quantity} units</div>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">Reorder</div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              {(kpiModal === "low" || kpiModal === "critical" || kpiModal === "expiring") && (
                <>
                  <Button onClick={() => {
                    let items: InventoryItem[] = []
                    if (kpiModal === "low") items = inventory.filter(i => i.status === "low")
                    if (kpiModal === "critical") items = inventory.filter(i => i.status === "critical")
                    if (kpiModal === "expiring") items = inventory.filter(i => daysUntil(i.expiryDate) <= expiringWindow)
                    createTransferRequest(items)
                    setKpiModal(null)
                  }}>
                    <Truck className="mr-2 h-4 w-4" />
                    Create Transfer Request
                  </Button>
                  <Button variant="secondary" onClick={() => {
                    let items: InventoryItem[] = []
                    if (kpiModal === "low") items = inventory.filter(i => i.status === "low")
                    if (kpiModal === "critical") items = inventory.filter(i => i.status === "critical")
                    if (kpiModal === "expiring") items = inventory.filter(i => daysUntil(i.expiryDate) <= expiringWindow)
                    markSelectedForReorder(items)
                    setKpiModal(null)
                  }}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Mark for Reorder
                  </Button>
                </>
              )}

              {(kpiModal === "transfers" || kpiModal === "reorder") && (
                <Button variant="outline" onClick={() => {
                  exportCSV()
                  setKpiModal(null)
                }}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              )}

              <Button variant="outline" onClick={() => setKpiModal(null)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Details Dialog */}
        <Dialog open={!!openDetailsId} onOpenChange={(o) => (o ? null : setOpenDetailsId(null))}>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Medicine Details</DialogTitle>
              <DialogDescription>Quick view for selected inventory item.</DialogDescription>
            </DialogHeader>

            {detailsItem ? (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground">Name</div>
                    <div className="font-medium">{detailsItem.name}</div>
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground">Category</div>
                    <div className="font-medium">{detailsItem.category}</div>
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground">Batch</div>
                    <div className="font-medium">{detailsItem.batch}</div>
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground">Status</div>
                    <div className="mt-1">{statusBadge(detailsItem.status)}</div>
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground">Quantity</div>
                    <div className="font-medium">{detailsItem.qty}</div>
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground">Min threshold</div>
                    <div className="font-medium">{detailsItem.minThreshold}</div>
                  </div>

                  <div className="rounded-md border p-3 sm:col-span-2">
                    <div className="text-xs text-muted-foreground">Expiry</div>
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{detailsItem.expiryDate}</div>
                      <Badge variant={daysUntil(detailsItem.expiryDate) <= 30 ? "destructive" : "secondary"}>
                        {daysUntil(detailsItem.expiryDate)} days
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setOpenDetailsId(null)
                    }}
                  >
                    Close
                  </Button>

                  <Button
                    onClick={() => {
                      // Resolve any alerts related to this item
                      const itemId = detailsItem?.id
                      if (itemId) {
                        setAlerts((prev) => prev.map((a) => (a.itemId === itemId ? { ...a, resolved: true } : a)))
                      }
                      toast.success("Action taken successfully.")
                      setOpenDetailsId(null)
                    }}
                  >
                    Take Action
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No item selected.</div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  )
}
