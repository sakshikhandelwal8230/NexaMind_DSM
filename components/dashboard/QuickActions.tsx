"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowRightLeft, ShoppingCart, Download, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { InventoryItem } from "@/lib/types"

interface QuickActionsProps {
  selectedItems: InventoryItem[]
  onTransferRequest: () => void
  onReorderMark: () => void
}

export function QuickActions({ selectedItems, onTransferRequest, onReorderMark }: QuickActionsProps) {
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [transferData, setTransferData] = useState({
    destination: "",
    priority: "Normal" as "Normal" | "High" | "Critical",
    notes: "",
  })

  const handleExport = async () => {
    if (selectedItems.length === 0) {
      toast.error("Please select items to export")
      return
    }

    setIsExporting(true)
    try {
      // Create CSV content
      const headers = ["Medicine Name", "Category", "Batch No", "Quantity", "Min Threshold", "Expiry Date", "Facility", "Status"]
      const rows = selectedItems.map(item => [
        item.medicineName,
        item.category,
        item.batchNo,
        item.quantity.toString(),
        item.minThreshold.toString(),
        item.expiryDate,
        item.facility,
        getStatus(item)
      ])

      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(","))
        .join("\n")

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `inventory-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success("Inventory data exported successfully")
    } catch (error) {
      toast.error("Failed to export data")
    } finally {
      setIsExporting(false)
    }
  }

  const handleTransferSubmit = () => {
    if (!transferData.destination.trim()) {
      toast.error("Please select a destination facility")
      return
    }

    // In real app, this would send to backend
    toast.success(`Transfer request created for ${selectedItems.length} item(s) to ${transferData.destination}`)
    setIsTransferDialogOpen(false)
    setTransferData({ destination: "", priority: "Normal", notes: "" })
    onTransferRequest()
  }

  const getStatus = (item: InventoryItem): "Adequate" | "Low Stock" | "Critical" => {
    if (item.quantity === 0) return "Critical"
    if (item.quantity < item.minThreshold) return "Low Stock"
    return "Adequate"
  }

  const hasSelections = selectedItems.length > 0

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
        <CardDescription>Manage selected inventory items</CardDescription>
      </CardHeader>
      <CardContent>
        {hasSelections ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedItems.length} item(s) selected
              </span>
            </div>
            <div className="grid gap-3">
              <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="justify-start gap-2" variant="default">
                    <ArrowRightLeft className="h-4 w-4" />
                    Create Transfer Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create Transfer Request</DialogTitle>
                    <DialogDescription>
                      Request transfer of selected items to another facility
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="destination">Destination Facility</Label>
                      <Input
                        id="destination"
                        placeholder="Enter facility name"
                        value={transferData.destination}
                        onChange={(e) => setTransferData(prev => ({ ...prev, destination: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={transferData.priority}
                        onValueChange={(value: "Normal" | "High" | "Critical") =>
                          setTransferData(prev => ({ ...prev, priority: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Input
                        id="notes"
                        placeholder="Additional notes"
                        value={transferData.notes}
                        onChange={(e) => setTransferData(prev => ({ ...prev, notes: e.target.value }))}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleTransferSubmit}>
                      Create Request
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                onClick={() => {
                  toast.success(`${selectedItems.length} item(s) marked for reorder`)
                  onReorderMark()
                }}
                className="justify-start gap-2"
                variant="outline"
              >
                <ShoppingCart className="h-4 w-4" />
                Mark for Reorder
              </Button>

              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="justify-start gap-2"
                variant="outline"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export Selected
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <ArrowRightLeft className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Select items from the inventory table to perform bulk actions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
