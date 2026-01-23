"use client"

import { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Bot, AlertTriangle, CheckCircle, Package, RefreshCw, FileText, Truck, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { addTransferRequest, addToReorderList, downloadCSV, emitTransferUpdated, type TransferRequest, type TransferRequestItem, type ReorderItem } from "@/lib/dms-storage"

interface Medicine {
  id: string
  name: string
  category: "OTC" | "Prescription"
  currentStock: number
  minThreshold: number
  expiryDate: string
  batchNumber: string
}

interface InventoryAIAssistantProps {
  medicines: Medicine[]
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onHighlightMedicines?: (medicines: Medicine[]) => void
}

function getStockStatus(current: number, threshold: number): "available" | "low" | "critical" {
  if (current === 0) return "critical"
  if (current < threshold) return "low"
  return "available"
}

function getStatusBadge(status: "available" | "low" | "critical") {
  switch (status) {
    case "available":
      return (
        <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">
          <CheckCircle className="mr-1 h-3 w-3" />
          Available
        </Badge>
      )
    case "low":
      return (
        <Badge className="bg-amber-500 text-white hover:bg-amber-600">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Low Stock
        </Badge>
      )
    case "critical":
      return (
        <Badge className="bg-red-600 text-white hover:bg-red-700">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Critical
        </Badge>
      )
  }
}

function generateAIResponse(query: string, medicines: Medicine[]): string {
  const lowerQuery = query.toLowerCase().trim()

  // Critical medicines
  if (lowerQuery.includes("critical")) {
    const critical = medicines.filter(m => getStockStatus(m.currentStock, m.minThreshold) === "critical")
    if (critical.length === 0) {
      return "Great news! No medicines are currently critical. All items have some stock available."
    }
    return `⚠️ ${critical.length} medicine${critical.length > 1 ? 's are' : ' is'} critical:\n${critical.map(m => `• ${m.name} (${m.currentStock} units remaining)`).join('\n')}\n\nImmediate action recommended: Contact suppliers for restocking.`
  }

  // Low stock medicines
  if (lowerQuery.includes("low stock") || lowerQuery.includes("low")) {
    const low = medicines.filter(m => getStockStatus(m.currentStock, m.minThreshold) === "low")
    if (low.length === 0) {
      return "Excellent! No medicines are currently low on stock. All items are above their minimum thresholds."
    }
    return `🟡 ${low.length} medicine${low.length > 1 ? 's are' : ' is'} low on stock:\n${low.map(m => `• ${m.name} (${m.currentStock}/${m.minThreshold} units)`).join('\n')}\n\nConsider reordering soon to avoid shortages.`
  }

  // Expiring soon
  if (lowerQuery.includes("expir") || lowerQuery.includes("expir")) {
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const expiringSoon = medicines.filter(m => {
      const expiry = new Date(m.expiryDate)
      return expiry <= thirtyDaysFromNow && expiry > now
    })
    if (expiringSoon.length === 0) {
      return "Good! No medicines are expiring within the next 30 days. All expiry dates are well in the future."
    }
    return `⏰ ${expiringSoon.length} medicine${expiringSoon.length > 1 ? 's will' : ' will'} expire soon:\n${expiringSoon.map(m => `• ${m.name} (expires: ${new Date(m.expiryDate).toLocaleDateString()})`).join('\n')}\n\nPlan to use or redistribute these items before expiry to avoid waste.`
  }

  // Reorder suggestion for specific medicine
  const medicineMatch = medicines.find(m => lowerQuery.includes(m.name.toLowerCase()))
  if (medicineMatch && (lowerQuery.includes("reorder") || lowerQuery.includes("suggest"))) {
    const suggestedQuantity = Math.max(medicineMatch.minThreshold * 2 - medicineMatch.currentStock, 0)
    return `📦 For ${medicineMatch.name}:\n• Current stock: ${medicineMatch.currentStock} units\n• Minimum threshold: ${medicineMatch.minThreshold} units\n• Suggested reorder: ${suggestedQuantity} units\n\nThis will bring stock to ${medicineMatch.currentStock + suggestedQuantity} units (2x threshold).`
  }

  // Total stock count
  if (lowerQuery.includes("total") && lowerQuery.includes("count")) {
    const totalStock = medicines.reduce((sum, m) => sum + m.currentStock, 0)
    return `📊 Total inventory count:\n• ${medicines.length} different medicines registered\n• ${totalStock} total units across all medicines\n• Average stock per medicine: ${Math.round(totalStock / medicines.length)} units`
  }

  // Available vs low-stock counts
  if (lowerQuery.includes("available") || lowerQuery.includes("count")) {
    const available = medicines.filter(m => getStockStatus(m.currentStock, m.minThreshold) === "available").length
    const low = medicines.filter(m => getStockStatus(m.currentStock, m.minThreshold) === "low").length
    const critical = medicines.filter(m => getStockStatus(m.currentStock, m.minThreshold) === "critical").length
    return `📈 Stock status breakdown:\n• ${available} medicines available (above threshold)\n• ${low} medicines low on stock\n• ${critical} medicines critical (out of stock)\n\n${available + low + critical} total medicines monitored.`
  }

  // Default response
  return "I'm here to help with your inventory! Try asking about:\n• Critical medicines\n• Low stock items\n• Medicines expiring soon\n• Reorder suggestions\n• Total stock counts\n• Stock status breakdown"
}

export function InventoryAIAssistant({ medicines, isOpen, onOpenChange, onHighlightMedicines }: InventoryAIAssistantProps) {
  const [chatInput, setChatInput] = useState("")
  const [chatHistory, setChatHistory] = useState<Array<{query: string, response: string, actions?: Array<{label: string, action: () => void}>}>>([])
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Dialog states
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [isReorderDialogOpen, setIsReorderDialogOpen] = useState(false)
  const [selectedMedicines, setSelectedMedicines] = useState<Medicine[]>([])

  // Transfer request form
  const [transferForm, setTransferForm] = useState({
    from: "Central Warehouse",
    to: "",
    priority: "Critical" as 'Normal' | 'High' | 'Critical',
    notes: "",
    quantities: {} as Record<string, number>
  })

  const { toast } = useToast()

  // Generate summary insights
  const criticalMedicines = medicines.filter(m => getStockStatus(m.currentStock, m.minThreshold) === "critical")
  const lowStockMedicines = medicines.filter(m => getStockStatus(m.currentStock, m.minThreshold) === "low")
  const expiringSoon = medicines.filter(m => {
    const expiry = new Date(m.expiryDate)
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    return expiry <= thirtyDaysFromNow && expiry > new Date()
  })

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [chatHistory, isTyping])

  const handleSummaryClick = (type: 'critical' | 'low' | 'expiring') => {
    let query = ""
    let medicinesToHighlight: Medicine[] = []

    switch (type) {
      case 'critical':
        query = "Show all critical medicines"
        medicinesToHighlight = criticalMedicines
        break
      case 'low':
        query = "Which medicines need restocking?"
        medicinesToHighlight = lowStockMedicines
        break
      case 'expiring':
        query = "What will expire in 30 days?"
        medicinesToHighlight = expiringSoon
        break
    }

    // Fill input field with query and send immediately
    setChatInput(query)
    setTimeout(() => {
      handleSendMessage()
    }, 100) // Small delay to show the query in input field
  }

  const handleSendMessage = () => {
    if (!chatInput.trim()) return

    const query = chatInput
    setChatInput("")
    setIsTyping(true)

    // Simulate AI processing time
    setTimeout(() => {
      const response = generateAIResponse(query, medicines)

      // Extract medicines mentioned in response for highlighting
      const mentionedMedicines: Medicine[] = []
      if (response.includes("critical")) {
        mentionedMedicines.push(...criticalMedicines)
      }
      if (response.includes("low") || response.includes("restocking")) {
        mentionedMedicines.push(...lowStockMedicines)
      }
      if (response.includes("expire")) {
        mentionedMedicines.push(...expiringSoon)
      }

      // Highlight medicines if any are mentioned
      if (onHighlightMedicines && mentionedMedicines.length > 0) {
        onHighlightMedicines(mentionedMedicines)
      }

      const actions = mentionedMedicines.length > 0 ? [
        { label: "Create Transfer Request", action: handleCreateTransferRequest },
        { label: "Mark for Reorder", action: handleMarkForReorder },
        { label: "Export This List", action: handleExportList }
      ] : undefined

      setChatHistory(prev => [...prev, { query, response, actions }])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Action handlers
  const handleCreateTransferRequest = () => {
    // Get critical medicines (quantity === 0 OR quantity < threshold * 0.25)
    const criticalMeds = medicines.filter(med =>
      med.currentStock === 0 || med.currentStock < med.minThreshold * 0.25
    )
    setSelectedMedicines(criticalMeds)
    setTransferForm({
      from: "Central Warehouse",
      to: "",
      priority: "Critical",
      notes: "",
      quantities: {}
    })
    setIsTransferDialogOpen(true)
  }

  const handleMarkForReorder = () => {
    // Get low stock medicines (quantity < threshold)
    const lowStockMeds = medicines.filter(med => med.currentStock < med.minThreshold)
    setSelectedMedicines(lowStockMeds)
    setIsReorderDialogOpen(true)
  }

  const handleExportList = () => {
    const exportMedicines = selectedMedicines.length > 0 ? selectedMedicines : medicines
    const csvData = exportMedicines.map(med => ({
      "Medicine": med.name,
      "Category": med.category,
      "Batch No": med.batchNumber || "",
      "Current Stock": med.currentStock,
      "Threshold": med.minThreshold,
      "Expiry Date": med.expiryDate || "",
      "Status": getStockStatus(med.currentStock, med.minThreshold),
      "Reorder Flag": "false" // Reorder flag - could be enhanced later
    }))
    downloadCSV(`inventory-export-${new Date().toISOString().split('T')[0]}.csv`, csvData)
    toast({
      title: "Export Started",
      description: `Exported ${exportMedicines.length} medicines to CSV file.`,
    })
  }

  // Transfer request handlers
  const handleTransferSubmit = () => {
    if (!transferForm.to || selectedMedicines.length === 0) return

    const items: TransferRequestItem[] = selectedMedicines.map(med => ({
      name: med.name,
      batchNo: med.batchNumber,
      requestedQty: transferForm.quantities[med.id] || 1,
      currentQty: med.currentStock,
      threshold: med.minThreshold
    }))

    const request: TransferRequest = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      from: transferForm.from,
      to: transferForm.to,
      priority: transferForm.priority,
      items,
      status: "Requested",
      notes: transferForm.notes
    }

    addTransferRequest(request)
    emitTransferUpdated()
    setIsTransferDialogOpen(false)
    toast({
      title: "Transfer Request Created",
      description: `Request for ${items.length} medicine${items.length > 1 ? 's' : ''} sent to ${transferForm.to}.`,
    })
  }

  // Reorder handlers
  const handleReorderSubmit = () => {
    if (selectedMedicines.length === 0) return

    selectedMedicines.forEach(med => {
      const status = getStockStatus(med.currentStock, med.minThreshold)
      let reason = "Below threshold"
      if (status === "critical") reason = "Out of stock"
      else if (new Date(med.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) reason = "Expiring soon"

      const reorderItem: ReorderItem = {
        id: med.id,
        medicine: med.name,
        batchNo: med.batchNumber,
        currentStock: med.currentStock,
        threshold: med.minThreshold,
        suggestedQty: Math.max(med.minThreshold * 2 - med.currentStock, 10),
        reason,
        createdAt: new Date().toISOString()
      }

      addToReorderList(reorderItem)
    })

    setIsReorderDialogOpen(false)
    toast({
      title: "Added to Reorder List",
      description: `${selectedMedicines.length} medicine${selectedMedicines.length > 1 ? 's' : ''} marked for reorder.`,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[900px] max-h-[85vh] flex flex-col p-0 bg-white dark:bg-slate-900">
        {/* Fixed Header */}
        <div className="flex-shrink-0 border-b border-slate-200 dark:border-slate-700 bg-background px-6 py-4">
          <DialogHeader className="space-y-1">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5" />
              AI Inventory Assistant
            </DialogTitle>
            <DialogDescription className="text-sm">
              Get intelligent insights and ask questions about your medicine inventory
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Summary Insights */}
            <Card className="border-0 shadow-none bg-slate-50 dark:bg-slate-800">
              <CardHeader className="px-0 py-2">
                <CardTitle className="text-base">Current Inventory Summary</CardTitle>
              </CardHeader>
              <CardContent className="px-0 py-2 space-y-2">
                <div
                  className="flex items-center gap-3 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 p-3 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800"
                  onClick={() => handleSummaryClick('critical')}
                >
                  <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400 flex-shrink-0" />
                  <span className="text-sm flex-1 text-slate-900 dark:text-slate-100">
                    {criticalMedicines.length} critical medicine{criticalMedicines.length !== 1 ? 's' : ''} (out of stock)
                  </span>
                  {criticalMedicines.length > 0 && getStatusBadge("critical")}
                </div>
                <div
                  className="flex items-center gap-3 cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-900/20 p-3 rounded-lg transition-colors border border-transparent hover:border-amber-200 dark:hover:border-amber-800"
                  onClick={() => handleSummaryClick('low')}
                >
                  <AlertTriangle className="h-4 w-4 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                  <span className="text-sm flex-1 text-slate-900 dark:text-slate-100">
                    {lowStockMedicines.length} low stock medicine{lowStockMedicines.length !== 1 ? 's' : ''} (below threshold)
                  </span>
                  {lowStockMedicines.length > 0 && getStatusBadge("low")}
                </div>
                <div
                  className="flex items-center gap-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 p-3 rounded-lg transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                  onClick={() => handleSummaryClick('expiring')}
                >
                  <Package className="h-4 w-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                  <span className="text-sm flex-1 text-slate-900 dark:text-slate-100">
                    {expiringSoon.length} medicine{expiringSoon.length !== 1 ? 's' : ''} expiring within 30 days
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Chat History */}
            <Card className="border-0 shadow-none bg-slate-50 dark:bg-slate-800">
              <CardHeader className="px-0 py-2">
                <CardTitle className="text-base">Ask Me Anything</CardTitle>
              </CardHeader>
              <CardContent className="px-0 py-2">
                <ScrollArea ref={scrollAreaRef} className="h-80 w-full">
                  <div className="pr-4">
                    {chatHistory.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Ask me about your inventory! Try: "Which medicines are critical?" or "Show me low stock items"
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {chatHistory.map((chat, index) => (
                          <div key={index} className="space-y-2">
                            {/* User Message */}
                            <div className="flex items-start gap-2 justify-end">
                              <div className="text-sm bg-primary p-3 rounded-lg max-w-[80%] text-primary-foreground">
                                {chat.query}
                              </div>
                              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-xs">👤</span>
                              </div>
                            </div>
                            {/* AI Response */}
                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                <Bot className="h-3 w-3" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm bg-muted p-3 rounded-lg whitespace-pre-line">
                                  {chat.response}
                                </div>
                                {/* Action Buttons */}
                                {chat.actions && chat.actions.length > 0 && (
                                  <div className="flex gap-2 mt-2">
                                    {chat.actions.map((action, actionIndex) => (
                                      <Button
                                        key={actionIndex}
                                        size="sm"
                                        variant="outline"
                                        onClick={action.action}
                                        className="text-xs"
                                      >
                                        {action.label === "Create Transfer Request" && <Truck className="h-3 w-3 mr-1" />}
                                        {action.label === "Mark for Reorder" && <RefreshCw className="h-3 w-3 mr-1" />}
                                        {action.label === "Export This List" && <FileText className="h-3 w-3 mr-1" />}
                                        {action.label}
                                      </Button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {/* Typing Indicator */}
                        {isTyping && (
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                              <Bot className="h-3 w-3" />
                            </div>
                            <div className="text-sm bg-muted p-3 rounded-lg">
                              <div className="flex items-center gap-1">
                                <span>AI is analyzing inventory</span>
                                <div className="flex gap-1">
                                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Sticky Footer - Chat Input */}
          <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 bg-background px-4 py-3">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about low stock, critical items, expiry..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
              <Button onClick={handleSendMessage} disabled={!chatInput.trim()} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Transfer Request Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Create Transfer Request
            </DialogTitle>
            <DialogDescription>
              Request transfer of critical medicines to another facility
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4">
            {/* From/To Facilities */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from-facility">From Facility</Label>
                <Input
                  id="from-facility"
                  value={transferForm.from}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to-facility">To Facility *</Label>
                <Select
                  value={transferForm.to}
                  onValueChange={(value) => setTransferForm({ ...transferForm, to: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="City General Hospital">City General Hospital</SelectItem>
                    <SelectItem value="Regional Medical Center">Regional Medical Center</SelectItem>
                    <SelectItem value="Downtown Pharmacy">Downtown Pharmacy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={transferForm.priority}
                onValueChange={(value: 'Normal' | 'High' | 'Critical') =>
                  setTransferForm({ ...transferForm, priority: value })
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

            {/* Medicine Selection */}
            <div className="space-y-2">
              <Label>Medicines to Transfer</Label>
              <div className="border rounded-lg p-4 space-y-3 max-h-60 overflow-y-auto">
                {selectedMedicines.map((med) => (
                  <div key={med.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={true}
                        disabled
                        className="pointer-events-none"
                      />
                      <div>
                        <p className="font-medium">{med.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Batch: {med.batchNumber} | Current: {med.currentStock} | Threshold: {med.minThreshold}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`qty-${med.id}`} className="text-sm">Qty:</Label>
                      <Input
                        id={`qty-${med.id}`}
                        type="number"
                        min="1"
                        max={med.currentStock}
                        value={transferForm.quantities[med.id] || 1}
                        onChange={(e) => setTransferForm({
                          ...transferForm,
                          quantities: {
                            ...transferForm.quantities,
                            [med.id]: parseInt(e.target.value) || 1
                          }
                        })}
                        className="w-20"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes for the transfer request..."
                value={transferForm.notes}
                onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTransferSubmit} disabled={!transferForm.to}>
              Create Transfer Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reorder Dialog */}
      <Dialog open={isReorderDialogOpen} onOpenChange={setIsReorderDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Mark for Reorder
            </DialogTitle>
            <DialogDescription>
              Add low-stock medicines to the reorder list for procurement
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4">
            <div className="space-y-2">
              <Label>Medicines to Reorder</Label>
              <div className="border rounded-lg p-4 space-y-3 max-h-60 overflow-y-auto">
                {selectedMedicines.map((med) => {
                  const status = getStockStatus(med.currentStock, med.minThreshold)
                  let reason = "Below threshold"
                  if (status === "critical") reason = "Out of stock"
                  else if (new Date(med.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) reason = "Expiring soon"

                  const suggestedQty = Math.max(med.minThreshold * 2 - med.currentStock, 10)

                  return (
                    <div key={med.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={true}
                          disabled
                          className="pointer-events-none"
                        />
                        <div>
                          <p className="font-medium">{med.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Batch: {med.batchNumber} | Current: {med.currentStock} | Suggested: {suggestedQty}
                          </p>
                          <p className="text-xs text-amber-600">Reason: {reason}</p>
                        </div>
                      </div>
                      {getStatusBadge(status)}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReorderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReorderSubmit}>
              Add to Reorder List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
