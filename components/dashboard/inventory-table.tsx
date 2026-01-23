"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Filter, Download, Info, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSearch } from "@/app/providers/search-context"

/* ================= TYPES ================= */

type StatusType = "adequate" | "low" | "critical"
type CategoryType = "OTC" | "Prescription"
type SortField = "name" | "status" | "quantity" | "facility" | "expiryDate"
type SortDirection = "asc" | "desc"

interface InventoryItem {
  id: number
  name: string
  category: CategoryType
  quantity: number
  threshold: number
  status: StatusType
  facility: string
  expiryDate: string // ISO date string
}

interface InventoryTableProps {
  externalFilter?: string
  onSelectionChange?: (selectedItems: InventoryItem[]) => void
}

/* ================= MOCK DATA ================= */

const inventoryData: InventoryItem[] = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "OTC",
    quantity: 2500,
    threshold: 500,
    status: "adequate",
    facility: "City General Hospital",
    expiryDate: "2025-12-31",
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    category: "Prescription",
    quantity: 15,
    threshold: 100,
    status: "critical",
    facility: "District Pharmacy #12",
    expiryDate: "2024-02-15",
  },
]

/* ================= STATUS CONFIG ================= */

const statusConfig: Record<StatusType, string> = {
  adequate: "bg-green-100 text-green-800",
  low: "bg-yellow-100 text-yellow-800",
  critical: "bg-red-100 text-red-800",
}

/* ================= AI INSIGHTS (RULE BASED) ================= */

const getAIInsights = (item: InventoryItem): string[] => {
  const insights: string[] = []

  if (item.quantity === 0) {
    insights.push("Stock is completely depleted. Immediate redistribution required.")
  }

  if (item.quantity < item.threshold) {
    insights.push("Stock dropped rapidly below the minimum threshold.")
  }

  const expiryDate = new Date(item.expiryDate)
  const now = new Date()
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
    insights.push("Expiry approaching soon. Risk of wastage.")
  }

  if (item.status === "critical") {
    insights.push("High demand observed in recent activity.")
  }

  return insights
}

/* ================= COMPONENT ================= */

export function InventoryTable({ externalFilter, onSelectionChange }: InventoryTableProps) {
  const { searchQuery } = useSearch()
  const [localSearch, setLocalSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)

  const getStatusFromFilter = (filter: string) => {
    switch (filter) {
      case "low": return "low"
      case "critical": return "critical"
      case "expiring": return "adequate" // We'll filter by expiry separately
      default: return "all"
    }
  }

  const filtered = inventoryData.filter(item => {
    const matchSearch = (searchQuery || localSearch).toLowerCase() === "" ||
      item.name.toLowerCase().includes((searchQuery || localSearch).toLowerCase())
    const matchCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchStatus = externalFilter === "all" || externalFilter === undefined ||
      (externalFilter === "expiring" ?
        (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 30 :
        item.status === getStatusFromFilter(externalFilter))
    return matchSearch && matchCategory && matchStatus
  }).sort((a, b) => {
    let aVal: any = a[sortField]
    let bVal: any = b[sortField]

    if (sortField === "expiryDate") {
      aVal = new Date(aVal).getTime()
      bVal = new Date(bVal).getTime()
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleRowSelect = (itemId: number, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(itemId)
    } else {
      newSelected.delete(itemId)
    }
    setSelectedRows(newSelected)
    const selectedItems = inventoryData.filter(item => newSelected.has(item.id))
    onSelectionChange?.(selectedItems)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filtered.map(item => item.id))
      setSelectedRows(allIds)
      onSelectionChange?.(filtered)
    } else {
      setSelectedRows(new Set())
      onSelectionChange?.([])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Overview</CardTitle>
        <CardDescription>Medicine stock monitoring</CardDescription>

        <div className="flex flex-wrap gap-3 mt-4">
          <Input
            placeholder="Search medicines..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-64"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="OTC">OTC</SelectItem>
              <SelectItem value="Prescription">Prescription</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.size === filtered.length && filtered.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("name")} className="h-auto p-0 font-semibold">
                  Medicine
                  {sortField === "name" && (
                    sortDirection === "asc" ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                  )}
                  {sortField !== "name" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("status")} className="h-auto p-0 font-semibold">
                  Status
                  {sortField === "status" && (
                    sortDirection === "asc" ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                  )}
                  {sortField !== "status" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("quantity")} className="h-auto p-0 font-semibold">
                  Quantity
                  {sortField === "quantity" && (
                    sortDirection === "asc" ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                  )}
                  {sortField !== "quantity" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("facility")} className="h-auto p-0 font-semibold">
                  Facility
                  {sortField === "facility" && (
                    sortDirection === "asc" ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                  )}
                  {sortField !== "facility" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("expiryDate")} className="h-auto p-0 font-semibold">
                  Expiry
                  {sortField === "expiryDate" && (
                    sortDirection === "asc" ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                  )}
                  {sortField !== "expiryDate" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                </Button>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(item => {
                const insights = getAIInsights(item)
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(item.id)}
                        onCheckedChange={(checked) => handleRowSelect(item.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell 
                      className="font-medium cursor-pointer hover:text-primary"
                      onClick={() => handleRowSelect(item.id, !selectedRows.has(item.id))}
                    >
                      {item.name}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[item.status]}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.facility}</TableCell>
                    <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Info className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="max-w-xs">
                                <p className="font-semibold mb-2">🤖 AI-generated insights</p>
                                {insights.length > 0 ? (
                                  <ul className="list-disc list-inside space-y-1">
                                    {insights.map((insight: string, index: number) => (
                                      <li key={index} className="text-sm">{insight}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-sm">No critical risks detected.</p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedItem(item)}>
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{selectedItem?.name}</DialogTitle>
                              <DialogDescription>Detailed inventory information</DialogDescription>
                            </DialogHeader>
                            {selectedItem && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Category</label>
                                    <p>{selectedItem.category}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <p><Badge className={statusConfig[selectedItem.status]}>{selectedItem.status}</Badge></p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Quantity</label>
                                    <p>{selectedItem.quantity} units</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Threshold</label>
                                    <p>{selectedItem.threshold} units</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Facility</label>
                                    <p>{selectedItem.facility}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Expiry Date</label>
                                    <p>{new Date(selectedItem.expiryDate).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">AI Insights</label>
                                  <div className="mt-2">
                                    {insights.length > 0 ? (
                                      <ul className="list-disc list-inside space-y-1">
                                        {insights.map((insight: string, index: number) => (
                                          <li key={index} className="text-sm">{insight}</li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-sm text-muted-foreground">No critical risks detected.</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
