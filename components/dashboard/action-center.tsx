"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRightLeft, ShoppingCart, Download, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useSupabase } from "@/hooks/useSupabase"

interface ActionCenterProps {
  selectedItems: Array<{
    id: string
    name: string
    current_stock: number
    min_threshold: number
    category: string
  }>
}

export function ActionCenter({ selectedItems }: ActionCenterProps) {
  const [loading, setLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const { insert: insertTransfer } = useSupabase("transfers")
  const { insert: insertReorder } = useSupabase("reorders")

  const handleTransfer = async () => {
    if (selectedItems.length === 0) return
    setLoading(true)
    try {
      for (const item of selectedItems) {
        await insertTransfer({
          medicine_name: item.name,
          quantity: 50,
          to_facility: 'Regional Hub',
          status: 'requested',
          priority: 'normal'
        })
      }
      toast.success(`Transfer protocol initiated for ${selectedItems.length} medical assets.`)
    } catch (error) {
      toast.error("Failed to transmit transfer requests to Supabase.")
    } finally {
      setLoading(false)
    }
  }

  const handleReorder = async () => {
    if (selectedItems.length === 0) return
    setLoading(true)
    try {
      for (const item of selectedItems) {
        await insertReorder({
          medicine_id: item.id as any,
          medicine_name: item.name,
          quantity: item.min_threshold * 3,
          status: 'pending',
          reason: 'Bulk action reorder'
        })
      }
      toast.success(`Replenishment cycle started for ${selectedItems.length} items.`)
    } catch (error) {
      toast.error("Failed to commit reorder queue to database.")
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    if (selectedItems.length === 0) return
    setIsExporting(true)
    try {
      const csvContent = "data:text/csv;charset=utf-8,"
        + "ID,Name,Stock,Threshold,Category\n"
        + selectedItems.map(item => `${item.id},${item.name},${item.current_stock},${item.min_threshold},${item.category}`).join("\n")

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `supply_chain_export_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("Operational ledger exported.")
    } catch (error) {
      toast.error("Export protocol failed.")
    } finally {
      setIsExporting(false)
    }
  }

  const hasSelections = selectedItems.length > 0

  return (
    <Card className="border-border/50 shadow-2xl bg-card/60 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              Command Center
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase opacity-50">Bulk supply coordination</CardDescription>
          </div>
          {hasSelections && <Badge className="bg-primary text-white font-black text-[9px] uppercase px-2 shadow-lg shadow-primary/20">{selectedItems.length} selected</Badge>}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {hasSelections ? (
          <div className="grid gap-3">
            <Button onClick={handleTransfer} disabled={loading} className="w-full h-11 bg-slate-950 font-black uppercase text-[10px] tracking-widest border border-white/5 shadow-2xl hover:bg-primary transition-all group">
              {loading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <ArrowRightLeft className="h-3 w-3 mr-2 group-hover:rotate-180 transition-transform duration-500" />}
              Initiate Cross-Facility Transfer
            </Button>
            <Button onClick={handleReorder} disabled={loading} variant="outline" className="w-full h-11 border-border/50 font-black uppercase text-[10px] tracking-widest hover:border-amber-500 hover:text-amber-500 transition-all">
              {loading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <ShoppingCart className="h-3 w-3 mr-2" />}
              Primary Reorder Protocol
            </Button>
            <Button onClick={handleExport} disabled={isExporting} variant="ghost" className="w-full h-11 text-muted-foreground font-black uppercase text-[10px] tracking-widest">
              {isExporting ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Download className="h-3 w-3 mr-2" />}
              Export Surveillance Data (CSV)
            </Button>
          </div>
        ) : (
          <div className="text-center py-10 opacity-30 select-none grayscale cursor-not-allowed">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mx-auto mb-4 border border-dashed border-border flex-col">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest px-8">Awaiting cross-table asset selection</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
