"use client"

import { useState, useMemo } from "react"
import { useSupabase } from "@/hooks/useSupabase"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  AlertTriangle,
  Save,
  X,
  CheckCircle,
  Bot,
  Loader2,
  Filter,
  ArrowUpDown
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { InventoryAIAssistant } from "@/components/dashboard/inventory-ai-assistant"
import { cn } from "@/lib/utils"

interface Medicine {
  id: string
  name: string
  category: string
  current_stock: number
  min_threshold: number
  expiry_date: string
  batch_number: string
  manufacturer?: string
}

export default function InventoryPage() {
  const { data: medicines, loading, insert, update, remove } = useSupabase<Medicine>("medicines")

  const [localSearch, setLocalSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    category: "OTC",
    current_stock: "",
    min_threshold: "",
    expiry_date: "",
    batch_number: "",
    manufacturer: ""
  })

  const stats = useMemo(() => {
    return {
      total: medicines.length,
      low: medicines.filter(m => m.current_stock > 0 && m.current_stock <= m.min_threshold).length,
      critical: medicines.filter(m => m.current_stock === 0).length,
      available: medicines.filter(m => m.current_stock > m.min_threshold).length
    }
  }, [medicines])

  const filteredMedicines = useMemo(() => {
    return medicines.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(localSearch.toLowerCase()) ||
        m.batch_number.toLowerCase().includes(localSearch.toLowerCase())
      const matchesCategory = filterCategory === "all" || m.category === filterCategory
      const status = m.current_stock === 0 ? "critical" : m.current_stock <= m.min_threshold ? "low" : "available"
      const matchesStatus = filterStatus === "all" || status === filterStatus

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [medicines, localSearch, filterCategory, filterStatus])

  const handleEdit = (med: Medicine) => {
    setEditingId(med.id)
    setFormData({
      name: med.name,
      category: med.category,
      current_stock: med.current_stock.toString(),
      min_threshold: med.min_threshold.toString(),
      expiry_date: med.expiry_date,
      batch_number: med.batch_number,
      manufacturer: med.manufacturer || ""
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this medicine item?")) {
      try {
        await remove(id)
        toast.success("Medicine deleted from Supabase.")
      } catch (e) {
        toast.error("Failed to delete item.")
      }
    }
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        current_stock: parseInt(formData.current_stock),
        min_threshold: parseInt(formData.min_threshold),
        expiry_date: formData.expiry_date,
        batch_number: formData.batch_number,
        manufacturer: formData.manufacturer
      }

      if (editingId) {
        await update(editingId, payload)
        toast.success("Medicine updated in real-time.")
      } else {
        await insert(payload)
        toast.success("New medicine added to database.")
      }
      setIsFormOpen(false)
      setEditingId(null)
    } catch (e) {
      toast.error("Error saving medicine.")
    }
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <DashboardHeader
          title="Global Inventory"
          subtitle="Real-time pharmaceutical surveillance"
          searchPlaceholder="Search medicines or batches..."
          searchValue={localSearch}
          onSearchChange={setLocalSearch}
        />

        <main className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-primary/10">
          {/* Dashboard Header UI */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" className="h-10 border-primary/20 bg-primary/5 text-primary font-bold uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all" onClick={() => setIsAiDialogOpen(true)}>
                <Bot className="mr-2 h-4 w-4" />
                NexaView AI Analysis
              </Button>
              <div className="h-4 w-[1px] bg-border mx-2" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px] h-10 border-none bg-muted/50 font-bold uppercase text-[10px] tracking-widest">
                  <Filter className="mr-2 h-3 w-3 opacity-50" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Global View</SelectItem>
                  <SelectItem value="available">Stable Stock</SelectItem>
                  <SelectItem value="low">Low Warning</SelectItem>
                  <SelectItem value="critical">Critical Short</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="h-10 px-6 font-black uppercase text-[11px] tracking-tighter shadow-lg shadow-primary/20" onClick={() => { setEditingId(null); setFormData({ name: "", category: "OTC", current_stock: "", min_threshold: "", expiry_date: "", batch_number: "", manufacturer: "" }); }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Provision New Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-slate-950 text-white border-white/10 shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="font-black uppercase tracking-tight text-xl">{editingId ? 'Modify Inventory Entry' : 'New Supply Provision'}</DialogTitle>
                  <DialogDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Database entry will update instantly across all nodes.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Medicine Name</Label>
                    <Input className="bg-slate-900 border-white/10 h-11" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Category</Label>
                      <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                        <SelectTrigger className="bg-slate-900 border-white/10 h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                          <SelectItem value="OTC">OTC</SelectItem>
                          <SelectItem value="Prescription">Prescription</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Batch ID</Label>
                      <Input className="bg-slate-900 border-white/10 h-11" value={formData.batch_number} onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Current Qty</Label>
                      <Input type="number" className="bg-slate-900 border-white/10 h-11" value={formData.current_stock} onChange={(e) => setFormData({ ...formData, current_stock: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Threshold</Label>
                      <Input type="number" className="bg-slate-900 border-white/10 h-11" value={formData.min_threshold} onChange={(e) => setFormData({ ...formData, min_threshold: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Expiry Date</Label>
                    <Input type="date" className="bg-slate-900 border-white/10 h-11" value={formData.expiry_date} onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button className="w-full h-12 font-black uppercase tracking-widest text-xs" onClick={handleSubmit}>
                    <Save className="mr-2 h-4 w-4" />
                    Commit to Supabase Ledger
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <SummaryCard title="Digital Assets" value={stats.total} icon={Package} trend="+2 new" color="primary" />
            <SummaryCard title="Stable Inventory" value={stats.available} icon={CheckCircle} trend="Satisfactory" color="emerald" />
            <SummaryCard title="Shortage Warnings" value={stats.low} icon={AlertTriangle} trend="Action Required" color="amber" />
            <SummaryCard title="Critical Breaches" value={stats.critical} icon={AlertTriangle} trend="Emergency" color="red" />
          </div>

          {/* Table Container */}
          <Card className="border-border shadow-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
            <Table>
              <TableHeader className="bg-muted/40 border-b">
                <TableRow>
                  <TableHead className="font-black h-14 text-[10px] uppercase tracking-widest pl-6">Medicine & ID</TableHead>
                  <TableHead className="font-black h-14 text-[10px] uppercase tracking-widest">Classification</TableHead>
                  <TableHead className="font-black h-14 text-[10px] uppercase tracking-widest">Batch Reference</TableHead>
                  <TableHead className="font-black h-14 text-[10px] uppercase tracking-widest text-right">
                    <div className="flex items-center justify-end gap-2">
                      Current Stock
                      <ArrowUpDown className="h-3 w-3 opacity-30" />
                    </div>
                  </TableHead>
                  <TableHead className="font-black h-14 text-[10px] uppercase tracking-widest">Expiration</TableHead>
                  <TableHead className="font-black h-14 text-[10px] uppercase tracking-widest">Status</TableHead>
                  <TableHead className="font-black h-14 text-[10px] uppercase tracking-widest text-right pr-6">Operational Control</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell colSpan={7} className="h-16 border-b border-border/10" />
                    </TableRow>
                  ))
                ) : filteredMedicines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-40 text-center text-muted-foreground italic font-bold">No surveillance data found matching current filters.</TableCell>
                  </TableRow>
                ) : (
                  filteredMedicines.map((med) => {
                    const status = med.current_stock === 0 ? "critical" : med.current_stock <= med.min_threshold ? "low" : "available"
                    return (
                      <TableRow key={med.id} className="group border-b border-border/30 hover:bg-muted/30 transition-all duration-300">
                        <TableCell className="pl-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-black text-sm uppercase tracking-tight text-foreground">{med.name}</span>
                            <span className="text-[9px] opacity-40 font-mono mt-0.5">DB_UUID: {med.id.slice(0, 12)}...</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-muted/50 border-border/50 rounded-sm">
                            {med.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs opacity-70 tracking-tighter">
                          {med.batch_number}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <span className={cn(
                              "text-lg font-black tracking-tighter",
                              status === 'critical' ? 'text-red-500' : status === 'low' ? 'text-amber-500' : 'text-primary'
                            )}>
                              {med.current_stock}
                            </span>
                            <span className="text-[8px] font-bold opacity-30 uppercase tracking-widest">Threshold: {med.min_threshold}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-bold opacity-70">
                          {new Date(med.expiry_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric', day: 'numeric' })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "h-2 w-2 rounded-full",
                              status === 'available' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                status === 'low' ? 'bg-amber-500' : 'bg-red-500 animate-pulse'
                            )} />
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-widest",
                              status === 'available' ? 'text-emerald-500' :
                                status === 'low' ? 'text-amber-500' : 'text-red-500'
                            )}>
                              {status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" className="h-9 w-9 bg-muted/50 text-foreground hover:bg-primary hover:text-white transition-all" onClick={() => handleEdit(med)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-9 w-9 bg-muted/50 text-red-500 hover:bg-red-500 hover:text-white transition-all" onClick={() => handleDelete(med.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </main>
      </div>

      <InventoryAIAssistant
        isOpen={isAiDialogOpen}
        onOpenChange={setIsAiDialogOpen}
        medicines={medicines}
      />
    </div>
  )
}

function SummaryCard({ title, value, icon: Icon, trend, color }: any) {
  const colors: any = {
    primary: "border-primary text-primary bg-primary/5",
    emerald: "border-emerald-500 text-emerald-500 bg-emerald-500/5",
    amber: "border-amber-500 text-amber-500 bg-amber-500/5",
    red: "border-red-500 text-red-500 bg-red-500/5"
  }

  return (
    <Card className={cn("border-l-4 shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center p-6 gap-6", colors[color])}>
      <div className={cn("p-4 rounded-xl", color === 'primary' ? 'bg-primary/10' : color === 'emerald' ? 'bg-emerald-500/10' : color === 'amber' ? 'bg-amber-500/10' : 'bg-red-500/10')}>
        <Icon className="h-8 w-8" />
      </div>
      <div className="flex flex-col">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{title}</p>
        <p className="text-3xl font-black tracking-tighter text-foreground">{value}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[9px] font-black uppercase">{trend}</span>
        </div>
      </div>
    </Card>
  )
}