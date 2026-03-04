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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Bot, AlertTriangle, RefreshCw, Truck, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useSupabase } from "@/hooks/useSupabase"
import { cn } from "@/lib/utils"

interface Medicine {
  id: string
  name: string
  category: string
  current_stock: number
  min_threshold: number
  expiry_date?: string
  batch_number?: string
}

interface InventoryAIAssistantProps {
  medicines: Medicine[]
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function InventoryAIAssistant({ medicines, isOpen, onOpenChange }: InventoryAIAssistantProps) {
  const [chatInput, setChatInput] = useState("")
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { insert: insertTransfer } = useSupabase("transfers")
  const { insert: insertReorder } = useSupabase("reorders")

  // Dialog states for AI-triggered actions
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [isReorderDialogOpen, setIsReorderDialogOpen] = useState(false)
  const [selectedMedicines, setSelectedMedicines] = useState<Medicine[]>([])

  const [transferForm, setTransferForm] = useState({
    to: "",
    priority: "normal" as any,
    notes: "",
    quantities: {} as Record<string, number>
  })

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }, [chatHistory, isTyping])

  const generateResponse = (query: string) => {
    const q = query.toLowerCase()
    if (q.includes("critical")) {
      const list = medicines.filter(m => m.current_stock === 0)
      return list.length > 0
        ? `I've found ${list.length} critical items: ${list.map(m => m.name).join(", ")}. Would you like to create a transfer request?`
        : "No critical (zero stock) items currently detected."
    }
    if (q.includes("low")) {
      const list = medicines.filter(m => m.current_stock <= m.min_threshold)
      return `${list.length} items are at or below threshold. I recommend prioritizing ${list.slice(0, 3).map(m => m.name).join(", ")} for reorder.`
    }
    return "I can help you analyze stock levels, find critical shortages, or draft transfer requests. Try asking: 'What items are critical?'"
  }

  const handleSend = () => {
    if (!chatInput.trim()) return
    const query = chatInput
    setChatInput("")
    setChatHistory(prev => [...prev, { type: 'user', content: query }])
    setIsTyping(true)

    setTimeout(() => {
      const response = generateResponse(query)
      setChatHistory(prev => [...prev, { type: 'ai', content: response }])
      setIsTyping(false)
    }, 1000)
  }

  const handleAction = async (type: 'transfer' | 'reorder') => {
    if (type === 'transfer') {
      const meds = medicines.filter(m => m.current_stock === 0).slice(0, 5)
      setSelectedMedicines(meds)
      setIsTransferDialogOpen(true)
    } else {
      const meds = medicines.filter(m => m.current_stock <= m.min_threshold).slice(0, 5)
      setSelectedMedicines(meds)
      setIsReorderDialogOpen(true)
    }
  }

  const submitTransfer = async () => {
    try {
      for (const med of selectedMedicines) {
        await insertTransfer({
          medicine_name: med.name,
          quantity: transferForm.quantities[med.id] || 50,
          to_facility: transferForm.to,
          status: 'requested',
          priority: transferForm.priority,
          notes: transferForm.notes
        })
      }
      toast.success("Transfer requests submitted to Supabase.")
      setIsTransferDialogOpen(false)
    } catch (e) {
      toast.error("Failed to submit transfer.")
    }
  }

  const submitReorder = async () => {
    try {
      for (const med of selectedMedicines) {
        await insertReorder({
          medicine_id: med.id as any,
          medicine_name: med.name,
          quantity: med.min_threshold * 2,
          status: 'pending',
          reason: 'AI suggested reorder'
        })
      }
      toast.success("Items added to reorder queue in Supabase.")
      setIsReorderDialogOpen(false)
    } catch (e) {
      toast.error("Failed to submit reorder.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 overflow-hidden bg-slate-950 border-slate-800 text-white shadow-2xl">
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-slate-900 to-slate-950">
          <DialogTitle className="flex items-center gap-3 text-xl font-black uppercase tracking-tight">
            <div className="p-2 rounded-lg bg-primary/20 text-primary">
              <Bot className="h-6 w-6" />
            </div>
            AI Supply Assistant
          </DialogTitle>
          <DialogDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">
            Real-time supply chain intelligence engine
          </DialogDescription>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col bg-slate-950/50">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl rounded-tl-none max-w-[80%] shadow-xl">
                  <p className="text-sm font-medium leading-relaxed">
                    Hello! I am your AI assistant. I can help you identify critical shortages or manage inter-facility transfers.
                    How can I help you today?
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-white/5 border-white/10 hover:bg-primary hover:text-white transition-all text-white" onClick={() => handleAction('transfer')}>
                      <Truck className="mr-2 h-3 w-3" />
                      Transfer Requests
                    </Button>
                    <Button size="sm" variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-white/5 border-white/10 hover:bg-amber-500 hover:text-white transition-all text-white" onClick={() => handleAction('reorder')}>
                      <RefreshCw className="mr-2 h-3 w-3" />
                      Reorder Analysis
                    </Button>
                  </div>
                </div>
              </div>

              {chatHistory.map((msg, i) => (
                <div key={i} className={cn("flex gap-3", msg.type === 'user' ? "flex-row-reverse" : "")}>
                  <div className={cn("h-8 w-8 rounded-full flex items-center justify-center border",
                    msg.type === 'user' ? "bg-slate-800 border-white/10" : "bg-primary/20 border-primary/30"
                  )}>
                    {msg.type === 'user' ? <span className="text-xs">U</span> : <Bot className="h-4 w-4 text-primary" />}
                  </div>
                  <div className={cn("p-4 rounded-2xl max-w-[80%] shadow-xl text-sm font-medium leading-relaxed",
                    msg.type === 'user' ? "bg-primary text-white rounded-tr-none" : "bg-slate-900 border border-white/5 rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 animate-pulse">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                  <div className="p-3 bg-slate-900 border border-white/5 rounded-2xl rounded-tl-none">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 text-white">Generating response...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-6 bg-slate-900/50 border-t border-white/10">
            <div className="flex gap-3">
              <Input
                placeholder="Ask about critical stock, expiry, or transfers..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-slate-950 border-white/10 focus-visible:ring-primary/50 text-white h-12 rounded-xl"
              />
              <Button onClick={handleSend} className="h-12 w-12 rounded-xl shadow-lg shadow-primary/20">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>

      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="max-w-xl bg-slate-900 text-white border-slate-800">
          <DialogHeader>
            <DialogTitle>AI Transfer Proposal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase opacity-50">To Facility</Label>
              <Select value={transferForm.to} onValueChange={(v) => setTransferForm({ ...transferForm, to: v })}>
                <SelectTrigger className="bg-slate-950 border-white/10 h-11 text-white">
                  <SelectValue placeholder="Select Destination" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="Central Hospital">Central Hospital</SelectItem>
                  <SelectItem value="Community Clinic A">Community Clinic A</SelectItem>
                  <SelectItem value="Regional Warehouse">Regional Warehouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase opacity-50">Review Proposed Items</Label>
              <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                {selectedMedicines.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-white/5">
                    <span className="text-sm font-bold">{m.name}</span>
                    <Badge variant="destructive" className="text-[10px] uppercase font-black tracking-tighter">OUT OF STOCK</Badge>
                  </div>
                ))}
              </div>
            </div>
            <Button className="w-full h-11 font-bold uppercase tracking-widest text-xs" onClick={submitTransfer}>
              Confirm Transfers to Supabase
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isReorderDialogOpen} onOpenChange={setIsReorderDialogOpen}>
        <DialogContent className="max-w-xl bg-slate-900 text-white border-slate-800">
          <DialogHeader>
            <DialogTitle>AI Reorder Analysis</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-500 uppercase tracking-tight">Replenishment Priority</p>
                <p className="text-xs text-white/70 font-medium">The following items are critically low. Adding to reorder queue will notify the procurement department.</p>
              </div>
            </div>
            <div className="space-y-2">
              {selectedMedicines.map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-white/5">
                  <div>
                    <p className="text-sm font-bold">{m.name}</p>
                    <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">Curr: {m.current_stock} / Threshold: {m.min_threshold}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-primary">+{m.min_threshold * 2}</p>
                    <p className="text-[8px] opacity-50 uppercase font-black">Suggested</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full h-11 font-bold uppercase tracking-widest text-xs bg-amber-600 hover:bg-amber-700" onClick={submitReorder}>
              Process Reorder Entries
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
