"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, Plus, CheckCircle, XCircle, AlertTriangle, MapPin, Package, Eye, Inbox } from "lucide-react"
import { useSearch } from "@/app/providers/search-context"
import { getTransferRequests, updateTransferRequestStatus, subscribeTransferRequests, emitTransferUpdated, type TransferRequest, type TransferStatus } from "@/lib/dms-storage"

// Display format for the table
interface DisplayTransfer {
  id: string
  date: string
  medicine: string
  quantity: number
  fromFacility: string
  toFacility: string
  zone: string
  status: string
  priority: string
  ETA: string
  notes: string
}

// ---------------- MOCK DATA ----------------
const mockFacilities = [
  { id: 1, name: "Central Hospital", zone: "North", verified: true },
  { id: 2, name: "City Pharmacy", zone: "North", verified: true },
  { id: 3, name: "Regional Clinic", zone: "South", verified: true },
  { id: 4, name: "Downtown Medical Center", zone: "East", verified: true },
  { id: 5, name: "Suburban Health Hub", zone: "West", verified: false },
]

const mockTransfers = [
  {
    id: "TRF-001",
    date: "2023-10-01",
    medicine: "Paracetamol",
    quantity: 100,
    fromFacility: "Central Hospital",
    toFacility: "City Pharmacy",
    zone: "North",
    status: "Requested",
    priority: "Normal",
    ETA: "2023-10-05",
    notes: "Standard supply request",
  },
  {
    id: "TRF-002",
    date: "2023-10-02",
    medicine: "Ibuprofen",
    quantity: 50,
    fromFacility: "Regional Clinic",
    toFacility: "Downtown Medical Center",
    zone: "South",
    status: "Approved",
    priority: "Urgent",
    ETA: "2023-10-04",
    notes: "Emergency stock needed",
  },
  {
    id: "TRF-003",
    date: "2023-10-03",
    medicine: "Aspirin",
    quantity: 75,
    fromFacility: "City Pharmacy",
    toFacility: "Suburban Health Hub",
    zone: "North",
    status: "Dispatched",
    priority: "Normal",
    ETA: "2023-10-06",
    notes: "Routine transfer",
  },
  {
    id: "TRF-004",
    date: "2023-09-28",
    medicine: "Amoxicillin",
    quantity: 200,
    fromFacility: "Central Hospital",
    toFacility: "Regional Clinic",
    zone: "North",
    status: "Received",
    priority: "Urgent",
    ETA: "2023-10-02",
    notes: "Delivered on time",
  },
  {
    id: "TRF-005",
    date: "2023-10-04",
    medicine: "Insulin",
    quantity: 30,
    fromFacility: "Downtown Medical Center",
    toFacility: "City Pharmacy",
    zone: "East",
    status: "Requested",
    priority: "Critical",
    ETA: "2023-10-05",
    notes: "Critical diabetic supply",
  },
]

// ---------------- STYLES ----------------
const statusColors = {
  Requested: "bg-yellow-100 text-yellow-800",
  Approved: "bg-blue-100 text-blue-800",
  Dispatched: "bg-purple-100 text-purple-800",
  Received: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
}

const priorityColors = {
  Normal: "bg-gray-100 text-gray-800",
  Urgent: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-800",
}

export default function TransfersPage() {
  const { searchQuery } = useSearch()
  const [isAdmin] = useState(true)
  const [transfers, setTransfers] = useState<DisplayTransfer[]>([])
  const [mockTransfersData] = useState(mockTransfers) // Keep for fallback

  const [zoneFilter, setZoneFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const [selectedMedicine, setSelectedMedicine] = useState("")
  const [sourceFacility, setSourceFacility] = useState("")
  const [destinationFacility, setDestinationFacility] = useState("")
  const [quantity, setQuantity] = useState("")
  const [priority, setPriority] = useState("Normal")
  const [notes, setNotes] = useState("")
  const [isNewTransferDialogOpen, setIsNewTransferDialogOpen] = useState(false)
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  // Load transfer requests from localStorage on mount and subscribe to updates
  useEffect(() => {
    const loadTransfers = () => {
      const storedRequests = getTransferRequests()
      if (storedRequests.length > 0) {
        // Convert TransferRequest format to the expected format for the table
        const formattedRequests = storedRequests.map(req => ({
          id: req.id,
          date: new Date(req.createdAt).toISOString().split('T')[0],
          medicine: req.items.length > 1 ? `${req.items[0].name} +${req.items.length - 1} more` : req.items[0].name,
          quantity: req.items.reduce((sum, item) => sum + item.requestedQty, 0), // Sum quantities
          fromFacility: req.from,
          toFacility: req.to,
          zone: "Unknown", // Could be enhanced to determine zone
          status: req.status,
          priority: req.priority,
          ETA: "", // Could be calculated based on priority
          notes: req.notes || "",
          rawRequest: req // Keep original for details dialog
        }))
        setTransfers(formattedRequests)
      } else {
        // Fallback to mock data if no stored requests
        setTransfers(mockTransfersData)
      }
    }

    // Load initially
    loadTransfers()

    // Subscribe to updates
    const unsubscribe = subscribeTransferRequests(loadTransfers)

    return unsubscribe
  }, [mockTransfersData])

  const filteredTransfers = transfers.filter(t => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.medicine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.fromFacility.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.toFacility.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false
    if (zoneFilter !== "all" && t.zone !== zoneFilter) return false
    if (statusFilter !== "all" && t.status !== statusFilter) return false
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false
    return true
  })

  const activeTransfers = filteredTransfers.filter(t => t.status !== "Received")
  const deliveredTransfers = filteredTransfers.filter(t => t.status === "Received")

  const kpiData = {
    total: transfers.length,
    requested: transfers.filter(t => t.status === "Requested").length,
    inTransit: transfers.filter(t => t.status === "Dispatched").length,
    delivered: transfers.filter(t => t.status === "Received").length,
    critical: transfers.filter(t => t.priority === "Critical").length,
  }

  const availableMedicines = ["Paracetamol", "Ibuprofen", "Aspirin", "Amoxicillin", "Insulin"]

  const handleNewTransfer = () => {
    const newTransfer = {
      id: `TRF-${String(transfers.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      medicine: selectedMedicine,
      quantity: parseInt(quantity),
      fromFacility: sourceFacility,
      toFacility: destinationFacility,
      zone: mockFacilities.find(f => f.name === sourceFacility)?.zone || "Unknown",
      status: "Requested",
      priority,
      ETA: "", // Demo, not calculated
      notes,
    }
    setTransfers([...transfers, newTransfer])
    setSelectedMedicine("")
    setSourceFacility("")
    setDestinationFacility("")
    setQuantity("")
    setPriority("Normal")
    setNotes("")
    setIsNewTransferDialogOpen(false)
  }

  const openDetailsDialog = (transfer: any) => {
    setSelectedTransfer(transfer)
    setIsDetailsDialogOpen(true)
  }

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        <DashboardSidebar isAdmin={isAdmin} />

        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader title="Inter-Facility Transfers" searchPlaceholder="Search transfers..." />

          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Transfers</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpiData.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Requested</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpiData.requested}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpiData.inTransit}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpiData.delivered}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Critical</CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpiData.critical}</div>
                </CardContent>
              </Card>
            </div>

            {/* FILTERS */}
            <div className="flex gap-4">
              <Select value={zoneFilter} onValueChange={setZoneFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Zones</SelectItem>
                  <SelectItem value="North">North</SelectItem>
                  <SelectItem value="South">South</SelectItem>
                  <SelectItem value="East">East</SelectItem>
                  <SelectItem value="West">West</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Requested">Requested</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Dispatched">Dispatched</SelectItem>
                  <SelectItem value="Received">Received</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>

              <Dialog open={isNewTransferDialogOpen} onOpenChange={setIsNewTransferDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Transfer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Transfer</DialogTitle>
                    <DialogDescription>Fill in the details for the new transfer request.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="medicine" className="text-right">Medicine</Label>
                      <Select value={selectedMedicine} onValueChange={setSelectedMedicine}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select medicine" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableMedicines.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="quantity" className="text-right">Quantity</Label>
                      <Input id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="from" className="text-right">From Facility</Label>
                      <Select value={sourceFacility} onValueChange={setSourceFacility}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select facility" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockFacilities.map(f => <SelectItem key={f.id} value={f.name}>{f.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="to" className="text-right">To Facility</Label>
                      <Select value={destinationFacility} onValueChange={setDestinationFacility}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select facility" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockFacilities.map(f => <SelectItem key={f.id} value={f.name}>{f.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="priority" className="text-right">Priority</Label>
                      <Select value={priority} onValueChange={setPriority}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="notes" className="text-right">Notes</Label>
                      <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="col-span-3" />
                    </div>
                  </div>
                  <Button onClick={handleNewTransfer}>Create Transfer</Button>
                </DialogContent>
              </Dialog>
            </div>

            {/* TABS */}
            <Tabs defaultValue="active" className="w-full">
              <TabsList>
                <TabsTrigger value="active">Active / Pending Transfers</TabsTrigger>
                <TabsTrigger value="delivered">Delivered (History)</TabsTrigger>
              </TabsList>
              <TabsContent value="active">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Transfers</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead className="w-[100px]">Date</TableHead>
                            <TableHead className="min-w-[120px]">Medicine</TableHead>
                            <TableHead className="w-[60px] text-center">Qty</TableHead>
                            <TableHead className="min-w-[130px]">From</TableHead>
                            <TableHead className="min-w-[130px]">To</TableHead>
                            <TableHead className="w-[100px]">Status</TableHead>
                            <TableHead className="w-[90px]">Priority</TableHead>
                            <TableHead className="w-[120px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activeTransfers.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={9} className="text-center py-4">
                                No results found
                              </TableCell>
                            </TableRow>
                          ) : (
                            activeTransfers.map(t => (
                              <TableRow key={t.id}>
                                <TableCell className="font-mono text-sm">{t.id}</TableCell>
                                <TableCell className="text-sm">{t.date}</TableCell>
                                <TableCell className="font-medium">{t.medicine}</TableCell>
                                <TableCell className="text-center">{t.quantity}</TableCell>
                                <TableCell className="text-sm">{t.fromFacility}</TableCell>
                                <TableCell className="text-sm">{t.toFacility}</TableCell>
                                <TableCell>
                                  <Badge className={statusColors[t.status as keyof typeof statusColors]}>
                                    {t.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={priorityColors[t.priority as keyof typeof priorityColors]}>
                                    {t.priority}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm" onClick={() => openDetailsDialog(t)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="delivered">
                <Card>
                  <CardHeader>
                    <CardTitle>Delivered Transfers</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead className="w-[100px]">Date</TableHead>
                            <TableHead className="min-w-[120px]">Medicine</TableHead>
                            <TableHead className="w-[60px] text-center">Qty</TableHead>
                            <TableHead className="min-w-[130px]">From</TableHead>
                            <TableHead className="min-w-[130px]">To</TableHead>
                            <TableHead className="w-[100px]">Status</TableHead>
                            <TableHead className="w-[90px]">Priority</TableHead>
                            <TableHead className="w-[120px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {deliveredTransfers.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={9} className="text-center py-4">
                                No results found
                              </TableCell>
                            </TableRow>
                          ) : (
                            deliveredTransfers.map(t => (
                              <TableRow key={t.id}>
                                <TableCell className="font-mono text-sm">{t.id}</TableCell>
                                <TableCell className="text-sm">{t.date}</TableCell>
                                <TableCell className="font-medium">{t.medicine}</TableCell>
                                <TableCell className="text-center">{t.quantity}</TableCell>
                                <TableCell className="text-sm">{t.fromFacility}</TableCell>
                                <TableCell className="text-sm">{t.toFacility}</TableCell>
                                <TableCell>
                                  <Badge className={statusColors[t.status as keyof typeof statusColors]}>
                                    {t.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={priorityColors[t.priority as keyof typeof priorityColors]}>
                                    {t.priority}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm" onClick={() => openDetailsDialog(t)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* DETAILS DIALOG */}
            <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle>Transfer Details</DialogTitle>
                </DialogHeader>

                {selectedTransfer && selectedTransfer.rawRequest && (
                  <div className="flex-1 overflow-y-auto space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>ID</Label>
                        <p className="font-mono text-sm">{selectedTransfer.rawRequest.id}</p>
                      </div>
                      <div>
                        <Label>Created At</Label>
                        <p>{new Date(selectedTransfer.rawRequest.createdAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <Label>From Facility</Label>
                        <p>{selectedTransfer.rawRequest.from}</p>
                      </div>
                      <div>
                        <Label>To Facility</Label>
                        <p>{selectedTransfer.rawRequest.to}</p>
                      </div>
                      <div>
                        <Label>Priority</Label>
                        <Badge className={priorityColors[selectedTransfer.rawRequest.priority as keyof typeof priorityColors]}>
                          {selectedTransfer.rawRequest.priority}
                        </Badge>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select
                          value={selectedTransfer.rawRequest.status}
                          onValueChange={(value: TransferStatus) => {
                            updateTransferRequestStatus(selectedTransfer.rawRequest.id, value)
                            emitTransferUpdated()
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Requested">Requested</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="In Transit">In Transit</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2">
                      <Label>Medicines Requested</Label>
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Medicine</TableHead>
                              <TableHead>Batch No</TableHead>
                              <TableHead>Requested Qty</TableHead>
                              <TableHead>Current Stock</TableHead>
                              <TableHead>Threshold</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedTransfer.rawRequest.items.map((item: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell className="font-mono text-sm">{item.batchNo || "N/A"}</TableCell>
                                <TableCell>{item.requestedQty}</TableCell>
                                <TableCell>{item.currentQty}</TableCell>
                                <TableCell>{item.threshold}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Notes */}
                    {selectedTransfer.rawRequest.notes && (
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm">{selectedTransfer.rawRequest.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Empty State */}
                {selectedTransfer && !selectedTransfer.rawRequest && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Inbox className="h-12 w-12 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">Transfer details not available</p>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
