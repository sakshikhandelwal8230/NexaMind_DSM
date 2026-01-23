"use client"

import type React from "react"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, Package, AlertTriangle, CheckCircle, Search, Bot } from "lucide-react"
import { useSearch } from "@/app/providers/search-context"
import { InventoryAIAssistant } from "@/components/dashboard/inventory-ai-assistant"

interface Medicine {
  id: string
  name: string
  category: "OTC" | "Prescription"
  currentStock: number
  minThreshold: number
  expiryDate: string
  batchNumber: string
}

interface FormFieldProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  error?: string
}

// Move FormField outside component to prevent remounting on each parent render
const FormField = (props: FormFieldProps) => (
  <div className="grid gap-2">
    <Label htmlFor={props.id}>{props.label}</Label>
    <Input
      id={props.id}
      type={props.type || "text"}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
      className={props.error ? "border-destructive" : ""}
      min={props.type === "number" ? 0 : undefined}
    />
    {props.error && <p className="text-xs text-destructive">{props.error}</p>}
  </div>
)

const initialMedicines: Medicine[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    category: "OTC",
    currentStock: 1500,
    minThreshold: 200,
    expiryDate: "2027-06-15",
    batchNumber: "PCM-2024-001",
  },
  {
    id: "2",
    name: "Amoxicillin 250mg",
    category: "Prescription",
    currentStock: 45,
    minThreshold: 100,
    expiryDate: "2026-03-20",
    batchNumber: "AMX-2024-045",
  },
  {
    id: "3",
    name: "Ibuprofen 400mg",
    category: "OTC",
    currentStock: 890,
    minThreshold: 150,
    expiryDate: "2027-09-10",
    batchNumber: "IBU-2024-112",
  },
  {
    id: "4",
    name: "Metformin 500mg",
    category: "Prescription",
    currentStock: 15,
    minThreshold: 50,
    expiryDate: "2026-12-01",
    batchNumber: "MET-2024-089",
  },
  {
    id: "5",
    name: "Cetirizine 10mg",
    category: "OTC",
    currentStock: 320,
    minThreshold: 100,
    expiryDate: "2027-04-25",
    batchNumber: "CET-2024-056",
  },
  {
    id: "6",
    name: "Omeprazole 20mg",
    category: "Prescription",
    currentStock: 0,
    minThreshold: 75,
    expiryDate: "2026-08-18",
    batchNumber: "OMP-2024-033",
  },
  {
    id: "7",
    name: "Aspirin 100mg",
    category: "OTC",
    currentStock: 2200,
    minThreshold: 300,
    expiryDate: "2027-11-30",
    batchNumber: "ASP-2024-078",
  },
  {
    id: "8",
    name: "Ciprofloxacin 500mg",
    category: "Prescription",
    currentStock: 28,
    minThreshold: 60,
    expiryDate: "2026-05-12",
    batchNumber: "CIP-2024-019",
  },
]

function getStockStatus(current: number, threshold: number): "available" | "low" | "critical" {
  if (current === 0) return "critical"
  if (current < threshold) return "low"
  return "available"
}

function getStatusBadge(status: "available" | "low" | "critical") {
  switch (status) {
    case "available":
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
          <CheckCircle className="mr-1 h-3 w-3" />
          Available
        </Badge>
      )
    case "low":
      return (
        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Low Stock
        </Badge>
      )
    case "critical":
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Critical
        </Badge>
      )
  }
}

function InventoryContent() {
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const { searchQuery } = useSearch()
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false)
  const [highlightedMedicines, setHighlightedMedicines] = useState<Medicine[]>([])

  const [formData, setFormData] = useState({
    name: "",
    category: "OTC" as "OTC" | "Prescription",
    currentStock: "",
    minThreshold: "",
    expiryDate: "",
    batchNumber: "",
  })

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.currentStock !== "" &&
    formData.minThreshold !== "" &&
    formData.expiryDate !== "" &&
    formData.batchNumber.trim() !== "" &&
    !isNaN(Number(formData.currentStock)) &&
    !isNaN(Number(formData.minThreshold)) &&
    Number(formData.currentStock) >= 0 &&
    Number(formData.minThreshold) >= 0

  const resetForm = () => {
    setFormData({
      name: "",
      category: "OTC",
      currentStock: "",
      minThreshold: "",
      expiryDate: "",
      batchNumber: "",
    })
  }

  const handleAddMedicine = () => {
    if (!isFormValid) return
    const newMedicine: Medicine = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      currentStock: Number.parseInt(formData.currentStock) || 0,
      minThreshold: Number.parseInt(formData.minThreshold) || 0,
      expiryDate: formData.expiryDate,
      batchNumber: formData.batchNumber,
    }
    setMedicines([...medicines, newMedicine])
    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEditMedicine = () => {
    if (!editingMedicine || !isFormValid) return
    const updatedMedicines = medicines.map((med) =>
      med.id === editingMedicine.id
        ? {
            ...med,
            name: formData.name,
            category: formData.category,
            currentStock: Number.parseInt(formData.currentStock) || 0,
            minThreshold: Number.parseInt(formData.minThreshold) || 0,
            expiryDate: formData.expiryDate,
            batchNumber: formData.batchNumber,
          }
        : med,
    )
    setMedicines(updatedMedicines)
    resetForm()
    setIsEditDialogOpen(false)
    setEditingMedicine(null)
  }

  const handleDeleteMedicine = (id: string) => {
    setMedicines(medicines.filter((med) => med.id !== id))
  }

  const openEditDialog = (medicine: Medicine) => {
    setEditingMedicine(medicine)
    setFormData({
      name: medicine.name,
      category: medicine.category,
      currentStock: medicine.currentStock.toString(),
      minThreshold: medicine.minThreshold.toString(),
      expiryDate: medicine.expiryDate,
      batchNumber: medicine.batchNumber,
    })
    setIsEditDialogOpen(true)
  }

  const filteredMedicines = medicines.filter((med) => {
    const matchesCategory = filterCategory === "all" || med.category === filterCategory
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase())
    const status = getStockStatus(med.currentStock, med.minThreshold)
    const matchesStatus = filterStatus === "all" || status === filterStatus
    return matchesCategory && matchesSearch && matchesStatus
  })

  const stats = {
    total: medicines.length,
    available: medicines.filter((m) => getStockStatus(m.currentStock, m.minThreshold) === "available").length,
    low: medicines.filter((m) => getStockStatus(m.currentStock, m.minThreshold) === "low").length,
    critical: medicines.filter((m) => getStockStatus(m.currentStock, m.minThreshold) === "critical").length,
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader title="My Inventory" subtitle="Manage and view your medicine stock" />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Summary Cards */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Medicines</CardTitle>
                <Package className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Registered items</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">{stats.available}</div>
                <p className="text-xs text-muted-foreground">Stock above threshold</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">{stats.low}</div>
                <p className="text-xs text-muted-foreground">Below threshold</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{stats.critical}</div>
                <p className="text-xs text-muted-foreground">Out of stock</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters + Add Button */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="OTC">OTC</SelectItem>
                <SelectItem value="Prescription">Prescription</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => setIsAiDialogOpen(true)} variant="outline" className="mr-2">
              <Bot className="mr-2 h-4 w-4" />
              AI Assistant
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="ml-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Medicine
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                  <DialogTitle>Add New Medicine</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new medicine. All fields are required.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <FormField
                    id="name"
                    label="Medicine Name *"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Paracetamol 500mg"
                  />
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: "OTC" | "Prescription") =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OTC">OTC (Over The Counter)</SelectItem>
                        <SelectItem value="Prescription">Prescription Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      id="stock"
                      label="Quantity *"
                      type="number"
                      value={formData.currentStock}
                      onChange={(e) => setFormData((prev) => ({ ...prev, currentStock: e.target.value }))}
                      placeholder="0"
                    />
                    <FormField
                      id="threshold"
                      label="Min Threshold *"
                      type="number"
                      value={formData.minThreshold}
                      onChange={(e) => setFormData((prev) => ({ ...prev, minThreshold: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <FormField
                    id="expiry"
                    label="Expiry Date *"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
                  />
                  <FormField
                    id="batch"
                    label="Batch Number *"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, batchNumber: e.target.value }))}
                    placeholder="e.g., PCM-2024-001"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddMedicine} disabled={!isFormValid}>
                    Save Medicine
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                  <DialogTitle>Edit Medicine</DialogTitle>
                  <DialogDescription>
                    Update the details for this medicine. All fields are required.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <FormField
                    id="edit-name"
                    label="Medicine Name *"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Paracetamol 500mg"
                  />
                  <div className="grid gap-2">
                    <Label htmlFor="edit-category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: "OTC" | "Prescription") =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OTC">OTC (Over The Counter)</SelectItem>
                        <SelectItem value="Prescription">Prescription Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      id="edit-stock"
                      label="Quantity *"
                      type="number"
                      value={formData.currentStock}
                      onChange={(e) => setFormData((prev) => ({ ...prev, currentStock: e.target.value }))}
                      placeholder="0"
                    />
                    <FormField
                      id="edit-threshold"
                      label="Min Threshold *"
                      type="number"
                      value={formData.minThreshold}
                      onChange={(e) => setFormData((prev) => ({ ...prev, minThreshold: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <FormField
                    id="edit-expiry"
                    label="Expiry Date *"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
                  />
                  <FormField
                    id="edit-batch"
                    label="Batch Number *"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, batchNumber: e.target.value }))}
                    placeholder="e.g., PCM-2024-001"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditMedicine} disabled={!isFormValid}>
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Inventory Table */}
          <Card className="bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-muted/50">
              <CardTitle className="text-lg text-slate-700 dark:text-slate-200">Medicine Inventory</CardTitle>
              <p className="text-sm text-muted-foreground">
                Showing {filteredMedicines.length} of {medicines.length} medicines
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-slate-700 dark:text-slate-200">Medicine Name</TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-200">Category</TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-200">Batch No.</TableHead>
                    <TableHead className="text-right text-slate-700 dark:text-slate-200">Current Stock</TableHead>
                    <TableHead className="text-right text-slate-700 dark:text-slate-200">Min Threshold</TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-200">Expiry Date</TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-200">Status</TableHead>
                    <TableHead className="text-right text-slate-700 dark:text-slate-200">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedicines.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        {searchQuery ? "No medicines found matching your search." : "No medicines found."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMedicines.map((med) => {
                      const isHighlighted = highlightedMedicines.some(h => h.id === med.id)
                      const status = getStockStatus(med.currentStock, med.minThreshold)
                      let highlightClass = "hover:bg-slate-100 dark:hover:bg-slate-800"

                      if (isHighlighted) {
                        switch (status) {
                          case "critical":
                            highlightClass = "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30"
                            break
                          case "low":
                            highlightClass = "border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                            break
                          default:
                            highlightClass = "border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                            break
                        }
                      }

                      return (
                        <TableRow key={med.id} className={highlightClass}>
                          <TableCell className="text-slate-800 dark:text-slate-100 font-bold">{med.name}</TableCell>
                          <TableCell className="text-slate-800 dark:text-slate-100">{med.category}</TableCell>
                          <TableCell className="text-slate-800 dark:text-slate-100">{med.batchNumber}</TableCell>
                          <TableCell className="text-right text-slate-800 dark:text-slate-100">{med.currentStock}</TableCell>
                          <TableCell className="text-right text-slate-800 dark:text-slate-100">{med.minThreshold}</TableCell>
                          <TableCell className="text-slate-800 dark:text-slate-100">{med.expiryDate}</TableCell>
                          <TableCell>{getStatusBadge(status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => openEditDialog(med)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDeleteMedicine(med.id)}
                              >
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
            </CardContent>
          </Card>
        </main>
      </div>

      <InventoryAIAssistant
        medicines={medicines}
        isOpen={isAiDialogOpen}
        onOpenChange={setIsAiDialogOpen}
        onHighlightMedicines={setHighlightedMedicines}
      />
    </div>
  )
}

export default InventoryContent
