"use client"

import { useEffect, useState } from "react"
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, Package, AlertTriangle, Save, X } from "lucide-react"

interface Medicine {
  id: string
  name: string
  dosage: string
  quantity: number
  expiryDate: any
  manufacturer: string
  batchNumber: string
  price: number
  category: string
}

export default function FirebaseInventoryPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    quantity: "",
    manufacturer: "",
    batchNumber: "",
    price: "",
    category: ""
  })

  // Set up real-time listener for medicines
  useEffect(() => {
    setLoading(true)
    const medicinesRef = collection(db, "medicines")
    
    const unsubscribe = onSnapshot(
      medicinesRef,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Medicine[]
        
        setMedicines(data)
        console.log("🔄 Real-time update - Medicines:", data)
        setLoading(false)
      },
      (error) => {
        console.error("Error setting up real-time listener:", error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const handleAddMedicine = async () => {
    try {
      const medicinesRef = collection(db, "medicines")
      
      if (editingId) {
        await updateDoc(doc(db, "medicines", editingId), {
          name: formData.name,
          dosage: formData.dosage,
          quantity: parseInt(formData.quantity),
          manufacturer: formData.manufacturer,
          batchNumber: formData.batchNumber,
          price: parseFloat(formData.price),
          category: formData.category,
          updatedAt: Timestamp.now()
        })
        console.log("✏️ Medicine updated in Firebase:", editingId)
        setEditingId(null)
      } else {
        await addDoc(medicinesRef, {
          name: formData.name,
          dosage: formData.dosage,
          quantity: parseInt(formData.quantity),
          manufacturer: formData.manufacturer,
          batchNumber: formData.batchNumber,
          price: parseFloat(formData.price),
          category: formData.category,
          createdAt: Timestamp.now()
        })
        console.log("✅ Medicine added to Firebase")
      }
      
      setFormData({ name: "", dosage: "", quantity: "", manufacturer: "", batchNumber: "", price: "", category: "" })
      setOpen(false)
    } catch (error) {
      console.error("Error saving medicine:", error)
      alert("Error saving medicine. Please try again.")
    }
  }

  const handleEditMedicine = (medicine: Medicine) => {
    setEditingId(medicine.id)
    setFormData({
      name: medicine.name,
      dosage: medicine.dosage,
      quantity: medicine.quantity.toString(),
      manufacturer: medicine.manufacturer,
      batchNumber: medicine.batchNumber,
      price: medicine.price.toString(),
      category: medicine.category
    })
    setOpen(true)
  }

  const handleDeleteMedicine = async (id: string) => {
    if (confirm("Delete this medicine?")) {
      try {
        await deleteDoc(doc(db, "medicines", id))
        console.log("🗑️ Medicine deleted from Firebase:", id)
      } catch (error) {
        console.error("Error deleting medicine:", error)
        alert("Error deleting medicine. Please try again.")
      }
    }
  }

  const handleCloseDialog = () => {
    setOpen(false)
    setEditingId(null)
    setFormData({ name: "", dosage: "", quantity: "", manufacturer: "", batchNumber: "", price: "", category: "" })
  }

  const getStockColor = (quantity: number) => {
    if (quantity <= 25) return "bg-red-50"
    if (quantity <= 50) return "bg-yellow-50"
    return ""
  }

  const getStockBadge = (quantity: number) => {
    if (quantity <= 25) {
      return <Badge variant="destructive">Critical</Badge>
    }
    if (quantity <= 50) {
      return <Badge variant="secondary">Low</Badge>
    }
    return <Badge>Healthy</Badge>
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Firebase Inventory" subtitle="Manage medicines with real-time sync" />
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8 flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Inventory Management</h1>
                <p className="text-muted-foreground">
                  ✨ Real-time sync: Changes here update Firebase instantly, and Firebase changes appear here immediately
                </p>
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Medicine
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingId ? "Edit Medicine" : "Add New Medicine"}</DialogTitle>
                    <DialogDescription>Enter medicine details</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Medicine name"
                      />
                    </div>
                    <div>
                      <Label>Dosage</Label>
                      <Input
                        value={formData.dosage}
                        onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                        placeholder="e.g., 500mg"
                      />
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Manufacturer</Label>
                      <Input
                        value={formData.manufacturer}
                        onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                        placeholder="Manufacturer name"
                      />
                    </div>
                    <div>
                      <Label>Batch Number</Label>
                      <Input
                        value={formData.batchNumber}
                        onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                        placeholder="Batch number"
                      />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Category"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleAddMedicine}>{editingId ? "Update" : "Add"} Medicine</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Medicines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{medicines.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${(medicines.reduce((sum, m) => sum + (m.price * m.quantity), 0)).toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Low Stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {medicines.filter(m => m.quantity <= 25).length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Units</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {medicines.reduce((sum, m) => sum + m.quantity, 0)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Medicines Table */}
            <Card>
              <CardHeader>
                <CardTitle>Medicines Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medicine</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Manufacturer</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {medicines.map((medicine) => (
                        <TableRow key={medicine.id} className={getStockColor(medicine.quantity)}>
                          <TableCell className="font-medium">{medicine.name}</TableCell>
                          <TableCell>{medicine.dosage}</TableCell>
                          <TableCell className="font-bold">{medicine.quantity}</TableCell>
                          <TableCell>${medicine.price.toFixed(2)}</TableCell>
                          <TableCell>{medicine.manufacturer}</TableCell>
                          <TableCell>{medicine.batchNumber}</TableCell>
                          <TableCell>{getStockBadge(medicine.quantity)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditMedicine(medicine)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteMedicine(medicine.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
