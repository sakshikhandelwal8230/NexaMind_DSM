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

export default function InventoryPage() {
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

  // ✨ REAL-TIME SYNC: Listen for changes in Firebase
  useEffect(() => {
    setLoading(true)
    const medicinesRef = collection(db, "medicines")
    
    // onSnapshot: Updates component whenever Firebase data changes
    // This is bidirectional - Firebase changes appear here instantly
    const unsubscribe = onSnapshot(
      medicinesRef,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Medicine[]
        
        setMedicines(data)
        console.log("🔄 Real-time update from Firebase:", data)
        setLoading(false)
      },
      (error) => {
        console.error("❌ Error setting up real-time listener:", error)
        setLoading(false)
      }
    )

    // Cleanup listener when component unmounts
    return () => unsubscribe()
  }, [])

  // Handle Add/Update of medicines
  const handleAddMedicine = async () => {
    if (!formData.name || !formData.dosage || !formData.quantity) {
      alert("Please fill in all required fields")
      return
    }

    try {
      if (editingId) {
        // UPDATE: Changes appear instantly in Firebase AND on this page
        await updateDoc(doc(db, "medicines", editingId), {
          name: formData.name,
          dosage: formData.dosage,
          quantity: parseInt(formData.quantity),
          manufacturer: formData.manufacturer,
          batchNumber: formData.batchNumber,
          price: parseFloat(formData.price) || 0,
          category: formData.category,
          updatedAt: Timestamp.now()
        })
        console.log("✏️ Medicine UPDATED in Firebase - Page updates automatically!")
        setEditingId(null)
      } else {
        // ADD: New medicine saved to Firebase and appears here automatically
        await addDoc(collection(db, "medicines"), {
          name: formData.name,
          dosage: formData.dosage,
          quantity: parseInt(formData.quantity),
          manufacturer: formData.manufacturer,
          batchNumber: formData.batchNumber,
          price: parseFloat(formData.price) || 0,
          category: formData.category,
          createdAt: Timestamp.now()
        })
        console.log("✅ Medicine ADDED to Firebase - Page updates automatically!")
      }
      
      setFormData({ name: "", dosage: "", quantity: "", manufacturer: "", batchNumber: "", price: "", category: "" })
      setOpen(false)
    } catch (error) {
      console.error("❌ Error saving medicine:", error)
      alert("Error saving medicine. Please try again.")
    }
  }

  // Edit an existing medicine
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

  // DELETE: Remove medicine from Firebase (updates page automatically)
  const handleDeleteMedicine = async (id: string) => {
    if (confirm("Delete this medicine?")) {
      try {
        await deleteDoc(doc(db, "medicines", id))
        console.log("🗑️ Medicine DELETED from Firebase - Page updates automatically!")
      } catch (error) {
        console.error("❌ Error deleting medicine:", error)
        alert("Error deleting medicine. Please try again.")
      }
    }
  }

  const handleCloseDialog = () => {
    setOpen(false)
    setEditingId(null)
    setFormData({ name: "", dosage: "", quantity: "", manufacturer: "", batchNumber: "", price: "", category: "" })
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Firebase Sync Inventory" subtitle="Real-time synchronization with Firestore" />
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Inventory Management</h1>
              <p className="text-muted-foreground text-lg">
                ✨ <span className="font-semibold">Real-time Sync:</span> Add/edit/delete medicines here and they sync to Firebase instantly. Firebase changes appear here automatically!
              </p>
            </div>

            {/* KPI Cards - Real-time updates */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Total Medicines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{medicines.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Low Stock Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {medicines.filter(m => m.quantity <= 50).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Units</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {medicines.reduce((sum, m) => sum + m.quantity, 0)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${medicines.reduce((sum, m) => sum + m.price * m.quantity, 0).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Add/Edit Medicine Dialog */}
            <div className="mb-6">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    {editingId ? "Edit Medicine" : "Add Medicine"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingId ? "Edit Medicine" : "Add New Medicine"}</DialogTitle>
                    <DialogDescription>
                      {editingId
                        ? "Update medicine details. Changes sync to Firebase instantly."
                        : "Enter medicine details. It will be added to Firebase and appear here immediately."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Medicine Name *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Aspirin"
                      />
                    </div>
                    <div>
                      <Label>Dosage *</Label>
                      <Input
                        value={formData.dosage}
                        onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                        placeholder="e.g., 500mg"
                      />
                    </div>
                    <div>
                      <Label>Quantity *</Label>
                      <Input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        placeholder="e.g., 100"
                      />
                    </div>
                    <div>
                      <Label>Manufacturer</Label>
                      <Input
                        value={formData.manufacturer}
                        onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                        placeholder="e.g., Bayer"
                      />
                    </div>
                    <div>
                      <Label>Batch Number</Label>
                      <Input
                        value={formData.batchNumber}
                        onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                        placeholder="e.g., BATCH001"
                      />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="e.g., 5.50"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g., Painkillers"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCloseDialog}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleAddMedicine}>
                      <Save className="w-4 h-4 mr-2" />
                      {editingId ? "Update Medicine" : "Add Medicine"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Medicines Table - Updates in real-time */}
            {loading ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">🔄 Loading medicines from Firebase in real-time...</p>
                </CardContent>
              </Card>
            ) : medicines.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No medicines found. Add one to get started!</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Medicines List (Real-time Sync with Firebase)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Manufacturer</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {medicines.map((medicine) => (
                        <TableRow key={medicine.id}>
                          <TableCell className="font-medium">{medicine.name}</TableCell>
                          <TableCell>{medicine.dosage}</TableCell>
                          <TableCell>{medicine.quantity}</TableCell>
                          <TableCell>{medicine.manufacturer}</TableCell>
                          <TableCell>{medicine.batchNumber}</TableCell>
                          <TableCell>${medicine.price.toFixed(2)}</TableCell>
                          <TableCell>{medicine.category}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                medicine.quantity <= 25
                                  ? "destructive"
                                  : medicine.quantity <= 50
                                    ? "secondary"
                                    : "default"
                              }
                            >
                              {medicine.quantity <= 25
                                ? "Critical"
                                : medicine.quantity <= 50
                                  ? "Low"
                                  : "Healthy"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditMedicine(medicine)}
                                title="Edit and sync to Firebase"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteMedicine(medicine.id)}
                                title="Delete from Firebase"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
