"use client"

import { useState, useMemo } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Eye, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import type { InventoryItem } from "@/lib/types"

interface InventoryTableProps {
  inventory: InventoryItem[]
  selectedItems: string[]
  onSelectionChange: (selected: string[]) => void
  onViewItem: (itemId: string) => void
}

type SortField = "medicineName" | "quantity" | "expiryDate" | "facility"
type SortDirection = "asc" | "desc"

const getStatus = (item: InventoryItem): "Adequate" | "Low Stock" | "Critical" => {
  if (item.quantity === 0) return "Critical"
  if (item.quantity < item.minThreshold) return "Low Stock"
  return "Adequate"
}

const getStatusBadge = (status: "Adequate" | "Low Stock" | "Critical") => {
  switch (status) {
    case "Adequate":
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">Adequate</Badge>
    case "Low Stock":
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">Low Stock</Badge>
    case "Critical":
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">Critical</Badge>
  }
}

export function InventoryTable({
  inventory,
  selectedItems,
  onSelectionChange,
  onViewItem
}: InventoryTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [expiryFilter, setExpiryFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("medicineName")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [viewingItem, setViewingItem] = useState<InventoryItem | null>(null)

  const filteredAndSortedInventory = useMemo(() => {
    let filtered = inventory.filter(item => {
      const matchesSearch = item.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.facility.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.batchNo.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || getStatus(item) === statusFilter
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

      let matchesExpiry = true
      if (expiryFilter !== "all") {
        const expiryDate = new Date(item.expiryDate)
        const now = new Date()
        const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        switch (expiryFilter) {
          case "30":
            matchesExpiry = diffDays <= 30 && diffDays > 0
            break
          case "60":
            matchesExpiry = diffDays <= 60 && diffDays > 0
            break
          case "90":
            matchesExpiry = diffDays <= 90 && diffDays > 0
            break
        }
      }

      return matchesSearch && matchesStatus && matchesCategory && matchesExpiry
    })

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === "expiryDate") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [inventory, searchQuery, statusFilter, categoryFilter, expiryFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(filteredAndSortedInventory.map(item => item.id))
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedItems, itemId])
    } else {
      onSelectionChange(selectedItems.filter(id => id !== itemId))
    }
  }

  const handleViewDetails = (item: InventoryItem) => {
    setViewingItem(item)
    onViewItem(item.id)
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === "asc" ?
      <ArrowUp className="h-4 w-4" /> :
      <ArrowDown className="h-4 w-4" />
  }

  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg text-card-foreground">Inventory Management</CardTitle>

          {/* Controls */}
          <div className="flex flex-col gap-4 pt-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search medicines, facilities, or batch numbers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Adequate">Adequate</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="OTC">OTC</SelectItem>
                  <SelectItem value="Prescription">Prescription</SelectItem>
                </SelectContent>
              </Select>

              <Select value={expiryFilter} onValueChange={setExpiryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Expiry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Expiry</SelectItem>
                  <SelectItem value="30">Within 30 days</SelectItem>
                  <SelectItem value="60">Within 60 days</SelectItem>
                  <SelectItem value="90">Within 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {selectedItems.length > 0 && (
            <div className="px-6 py-3 bg-primary/5 border-b border-border">
              <p className="text-sm text-primary font-medium">
                {selectedItems.length} item(s) selected
              </p>
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={filteredAndSortedInventory.length > 0 &&
                              selectedItems.length === filteredAndSortedInventory.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("medicineName")}
                      className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
                    >
                      Medicine Name {getSortIcon("medicineName")}
                    </Button>
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Batch No.</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("quantity")}
                      className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
                    >
                      Quantity {getSortIcon("quantity")}
                    </Button>
                  </TableHead>
                  <TableHead>Min Threshold</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("expiryDate")}
                      className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
                    >
                      Expiry Date {getSortIcon("expiryDate")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("facility")}
                      className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
                    >
                      Facility {getSortIcon("facility")}
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredAndSortedInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8">
                      <p className="text-muted-foreground">No items found matching your criteria</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedInventory.map((item) => {
                    const status = getStatus(item)
                    const isSelected = selectedItems.includes(item.id)

                    return (
                      <TableRow key={item.id} className={isSelected ? "bg-primary/5" : ""}>
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell 
                          className="font-medium text-card-foreground cursor-pointer hover:text-primary"
                          onClick={() => handleSelectItem(item.id, !isSelected)}
                        >
                          {item.medicineName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.batchNo}</TableCell>
                        <TableCell className="font-mono">{item.quantity}</TableCell>
                        <TableCell className="font-mono text-muted-foreground">{item.minThreshold}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(item.expiryDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(status)}</TableCell>
                        <TableCell className="text-muted-foreground">{item.facility}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Medicine Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected medicine
            </DialogDescription>
          </DialogHeader>
          {viewingItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Medicine Name</Label>
                  <p className="text-sm text-muted-foreground">{viewingItem.medicineName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="text-sm text-muted-foreground">{viewingItem.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Batch Number</Label>
                  <p className="text-sm text-muted-foreground">{viewingItem.batchNo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Facility</Label>
                  <p className="text-sm text-muted-foreground">{viewingItem.facility}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Current Stock</Label>
                  <p className="text-sm text-muted-foreground">{viewingItem.quantity} units</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Min Threshold</Label>
                  <p className="text-sm text-muted-foreground">{viewingItem.minThreshold} units</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Expiry Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(viewingItem.expiryDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(getStatus(viewingItem))}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
