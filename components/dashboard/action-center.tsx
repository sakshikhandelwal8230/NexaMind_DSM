"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRightLeft, ShoppingCart, Download, Loader2 } from "lucide-react"
import { addTransferRequest, addToReorderList, downloadCSV } from "@/lib/dms-storage"
import { toast } from "sonner"

interface ActionCenterProps {
  selectedItems: Array<{
    id: number
    name: string
    quantity: number
    threshold: number
    status: string
    facility: string
  }>
}

export function ActionCenter({ selectedItems }: ActionCenterProps) {
  const [isTransferring, setIsTransferring] = useState(false)
  const [isReordering, setIsReordering] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleTransfer = async () => {
    if (selectedItems.length === 0) return

    setIsTransferring(true)
    try {
      // Mock transfer request
      const transferRequest = {
        id: `transfer-${Date.now()}`,
        createdAt: new Date().toISOString(),
        from: "Central Warehouse",
        to: selectedItems[0].facility,
        priority: "High" as const,
        status: "Requested" as const,
        items: selectedItems.map(item => ({
          name: item.name,
          requestedQty: item.threshold - item.quantity,
          currentQty: item.quantity,
          threshold: item.threshold,
        })),
      }

      addTransferRequest(transferRequest)
      toast.success(`Transfer request created for ${selectedItems.length} item(s)`)
    } catch (error) {
      toast.error("Failed to create transfer request")
    } finally {
      setIsTransferring(false)
    }
  }

  const handleReorder = async () => {
    if (selectedItems.length === 0) return

    setIsReordering(true)
    try {
      selectedItems.forEach(item => {
        const reorderItem = {
          id: `reorder-${item.id}-${Date.now()}`,
          medicine: item.name,
          currentStock: item.quantity,
          threshold: item.threshold,
          suggestedQty: Math.max(item.threshold * 2 - item.quantity, 100),
          reason: item.status === "critical" ? "Critical shortage" : "Low stock",
          createdAt: new Date().toISOString(),
        }
        addToReorderList(reorderItem)
      })
      toast.success(`Reorder requests created for ${selectedItems.length} item(s)`)
    } catch (error) {
      toast.error("Failed to create reorder requests")
    } finally {
      setIsReordering(false)
    }
  }

  const handleExport = async () => {
    if (selectedItems.length === 0) return

    setIsExporting(true)
    try {
      const csvData = selectedItems.map(item => ({
        Medicine: item.name,
        Quantity: item.quantity,
        Threshold: item.threshold,
        Status: item.status,
        Facility: item.facility,
      }))
      downloadCSV(`inventory-export-${new Date().toISOString().split('T')[0]}.csv`, csvData)
      toast.success("Inventory data exported successfully")
    } catch (error) {
      toast.error("Failed to export data")
    } finally {
      setIsExporting(false)
    }
  }

  const hasSelections = selectedItems.length > 0

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-primary" />
          Action Center
        </CardTitle>
        <CardDescription>Manage selected inventory items</CardDescription>
      </CardHeader>
      <CardContent>
        {hasSelections ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{selectedItems.length} item(s) selected</Badge>
            </div>
            <div className="grid gap-3">
              <Button
                onClick={handleTransfer}
                disabled={isTransferring}
                className="justify-start gap-2"
                variant="default"
              >
                {isTransferring ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRightLeft className="h-4 w-4" />
                )}
                Request Transfer
              </Button>
              <Button
                onClick={handleReorder}
                disabled={isReordering}
                className="justify-start gap-2"
                variant="outline"
              >
                {isReordering ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
                Add to Reorder Queue
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
