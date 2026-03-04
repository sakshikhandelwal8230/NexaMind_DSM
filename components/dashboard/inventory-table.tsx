"use client"

import { useState, useMemo } from "react"
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
import { Info, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSearch } from "@/app/providers/search-context"
import { useSupabase } from "@/hooks/useSupabase"

/* ================= TYPES ================= */

type StatusType = "adequate" | "low" | "critical"
type SortField = "name" | "current_stock" | "expiry_date"
type SortDirection = "asc" | "desc"

interface Medicine {
  id: string
  name: string
  category: "OTC" | "Prescription"
  current_stock: number
  min_threshold: number
  expiry_date: string
  batch_number: string
  manufacturer: string
}

interface InventoryTableProps {
  externalFilter?: string
  onSelectionChange?: (selectedItems: Medicine[]) => void
}

/* ================= STATUS CONFIG ================= */

const statusConfig: Record<StatusType, string> = {
  adequate: "bg-green-100 text-green-800",
  low: "bg-yellow-100 text-yellow-800",
  critical: "bg-red-100 text-red-800",
}

/* ================= AI INSIGHTS (RULE BASED) ================= */

const getAIInsights = (item: Medicine): string[] => {
  const insights: string[] = []

  if (item.current_stock === 0) {
    insights.push("Stock is completely depleted. Immediate redistribution required.")
  } else if (item.current_stock <= item.min_threshold) {
    insights.push("Stock dropped below the minimum threshold.")
  }

  if (item.expiry_date) {
    const expiryDate = new Date(item.expiry_date)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
      insights.push("Expiry approaching soon. Risk of wastage.")
    } else if (daysUntilExpiry <= 0) {
      insights.push("Item is EXPIRED. Remove from inventory immediately.")
    }
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
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [selectedItem, setSelectedItem] = useState<Medicine | null>(null)

  const { data: medicines, loading } = useSupabase<Medicine>("medicines")

  const filtered = useMemo(() => {
    if (!medicines) return []

    return medicines.filter((item: Medicine) => {
      // 1. Search Query
      const query = (searchQuery || localSearch).toLowerCase()
      const matchSearch = query === "" || item.name.toLowerCase().includes(query)

      // 2. Category Filter
      const matchCategory = categoryFilter === "all" || item.category === categoryFilter

      // 3. Status Filter (External)
      let matchStatus = true
      const today = new Date()
      const thirtyDays = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      const expiryDate = item.expiry_date ? new Date(item.expiry_date) : null

      if (externalFilter === "low") {
        matchStatus = item.current_stock > 0 && item.current_stock <= item.min_threshold
      } else if (externalFilter === "critical") {
        matchStatus = item.current_stock === 0
      } else if (externalFilter === "expiring") {
        matchStatus = expiryDate ? (expiryDate <= thirtyDays && expiryDate >= today) : false
      }

      return matchSearch && matchCategory && matchStatus
    }).sort((a: any, b: any) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (sortField === "expiry_date") {
        aVal = aVal ? new Date(aVal).getTime() : 0
        bVal = bVal ? new Date(bVal).getTime() : 0
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [medicines, searchQuery, localSearch, categoryFilter, externalFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleRowSelect = (itemId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(itemId)
    } else {
      newSelected.delete(itemId)
    }
    setSelectedRows(newSelected)
    const selectedItemsList = medicines?.filter(item => newSelected.has(item.id)) || []
    onSelectionChange?.(selectedItemsList)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl">Inventory Overview</CardTitle>
        <CardDescription>Live medicine stock monitoring</CardDescription>

        <div className="flex flex-wrap gap-3 mt-4">
          <Input
            placeholder="Search medicines..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-40">
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

      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={filtered.length > 0 && selectedRows.size === filtered.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      const allIds = new Set(filtered.map(i => i.id))
                      setSelectedRows(allIds)
                      onSelectionChange?.(filtered)
                    } else {
                      setSelectedRows(new Set())
                      onSelectionChange?.([])
                    }
                  }}
                />
              </TableHead>
              <TableHead>
                <button onClick={() => handleSort("name")} className="flex items-center gap-1 font-semibold">
                  Medicine
                  {sortField === "name" ? (
                    sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                  ) : <ArrowUpDown className="h-3 w-3 opacity-50" />}
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <button onClick={() => handleSort("current_stock")} className="flex items-center gap-1 font-semibold">
                  Stock
                  {sortField === "current_stock" ? (
                    sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                  ) : <ArrowUpDown className="h-3 w-3 opacity-50" />}
                </button>
              </TableHead>
              <TableHead>
                <button onClick={() => handleSort("expiry_date")} className="flex items-center gap-1 font-semibold">
                  Expiry
                  {sortField === "expiry_date" ? (
                    sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                  ) : <ArrowUpDown className="h-3 w-3 opacity-50" />}
                </button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6} className="h-12 bg-muted/20 animate-pulse rounded-md my-1" />
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No inventory data found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item: Medicine) => {
                const insights = getAIInsights(item)
                const status: StatusType = (item.current_stock === 0) ? "critical" :
                  (item.current_stock <= item.min_threshold) ? "low" : "adequate"

                return (
                  <TableRow key={item.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(item.id)}
                        onCheckedChange={(checked) => handleRowSelect(item.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${statusConfig[status]} border-none font-semibold px-2 py-0.5 capitalize`}>
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={status === "critical" ? "text-red-600 font-bold" : ""}>
                        {item.current_stock}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                                <Info className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <div className="max-w-xs space-y-2 py-1">
                                <p className="font-bold flex items-center gap-2">🤖 AI Analysis</p>
                                {insights.length > 0 ? (
                                  <ul className="text-xs list-disc list-inside space-y-1">
                                    {insights.map((msg, i) => <li key={i}>{msg}</li>)}
                                  </ul>
                                ) : <p className="text-xs">Healthy stock levels maintained.</p>}
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
                              <DialogDescription>Full inventory breakdown</DialogDescription>
                            </DialogHeader>
                            {selectedItem && (
                              <div className="grid grid-cols-2 gap-4 pt-4">
                                <DetailItem label="Quantity" value={`${selectedItem.current_stock} units`} />
                                <DetailItem label="Threshold" value={`${selectedItem.min_threshold} units`} />
                                <DetailItem label="Manufacturer" value={selectedItem.manufacturer || "N/A"} />
                                <DetailItem label="Batch" value={selectedItem.batch_number || "N/A"} />
                                <DetailItem label="Expiry" value={selectedItem.expiry_date ? new Date(selectedItem.expiry_date).toLocaleDateString() : "N/A"} />
                                <DetailItem label="Category" value={selectedItem.category} />
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

function DetailItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  )
}
