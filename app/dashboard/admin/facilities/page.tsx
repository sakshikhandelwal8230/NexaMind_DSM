"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Building2, CheckCircle, AlertTriangle, Package, Eye, Truck, MessageSquare, MapPin, Users, Shield } from "lucide-react"

// Mock data
const facilities = [
  {
    id: 1,
    name: "City General Hospital",
    type: "Hospital",
    zone: "North",
    verificationStatus: "Verified",
    stockHealth: "Healthy",
    lastActivity: "2024-01-15",
    trusted: true,
    excessStock: false,
    criticalShortage: false,
    stock: 50,
    threshold: 100,
  },
  {
    id: 2,
    name: "Downtown Pharmacy",
    type: "Pharmacy",
    zone: "Central",
    verificationStatus: "Verified",
    stockHealth: "Low",
    lastActivity: "2024-01-14",
    trusted: false,
    excessStock: true,
    criticalShortage: false,
    stock: 80,
    threshold: 150,
  },
  {
    id: 3,
    name: "Regional Medical Center",
    type: "Hospital",
    zone: "South",
    verificationStatus: "Pending",
    stockHealth: "Critical",
    lastActivity: "2024-01-13",
    trusted: true,
    excessStock: false,
    criticalShortage: true,
    stock: 10,
    threshold: 200,
  },
  {
    id: 4,
    name: "Central Warehouse",
    type: "Warehouse",
    zone: "East",
    verificationStatus: "Verified",
    stockHealth: "Healthy",
    lastActivity: "2024-01-16",
    trusted: true,
    excessStock: true,
    criticalShortage: false,
    stock: 300,
    threshold: 250,
  },
]

const overviewStats = [
  {
    title: "Total Facilities",
    value: facilities.length.toString(),
    icon: Building2,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    title: "Verified Facilities",
    value: facilities.filter(f => f.verificationStatus === "Verified").length.toString(),
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    title: "Facilities with Excess Stock",
    value: facilities.filter(f => f.excessStock).length.toString(),
    icon: Package,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    title: "Facilities with Critical Shortage",
    value: facilities.filter(f => f.criticalShortage).length.toString(),
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-100",
  },
]

export default function FacilitiesPage() {
  const [filters, setFilters] = useState({
    zone: "all",
    type: "all",
    stockHealth: "all",
  })

  const [sendUnits, setSendUnits] = useState<Record<number, number>>({})

  const filteredFacilities = facilities.filter(facility => {
    if (filters.zone !== "all" && facility.zone !== filters.zone) return false
    if (filters.type !== "all" && facility.type !== filters.type) return false
    if (filters.stockHealth !== "all" && facility.stockHealth !== filters.stockHealth) return false
    return true
  })

  const getStockHealthColor = (health: string) => {
    switch (health) {
      case "Healthy": return "bg-green-500"
      case "Low": return "bg-yellow-500"
      case "Critical": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const centralStock = 500 // Mock central stock

  const getNeed = (facility: any) => {
    return Math.max(0, facility.threshold - facility.stock)
  }

  const getNeedStatus = (need: number) => {
    if (need === 0) return { label: "No need", className: "bg-green-100 text-green-800" }
    if (need <= 50) return { label: "Low need", className: "bg-yellow-100 text-yellow-800" }
    return { label: "High need", className: "bg-red-100 text-red-800" }
  }

  const getRemainingStock = (facilityId: number) => {
    const units = sendUnits[facilityId] || 0
    return Math.max(0, centralStock - units)
  }

  const getRemainingStatus = (remaining: number) => {
    if (remaining >= 100) return { label: "Safe", className: "bg-green-100 text-green-800" }
    if (remaining >= 30) return { label: "Low", className: "bg-yellow-100 text-yellow-800" }
    return { label: "Critical", className: "bg-red-100 text-red-800" }
  }

  const isValidSendUnits = (facilityId: number) => {
    const units = sendUnits[facilityId] || 0
    return units >= 0 && units <= centralStock
  }

  return (
    <AuthGuard>
      <div className="flex h-screen bg-background">
        <DashboardSidebar isAdmin />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader
            title="Facilities Management"
            subtitle="Manage hospitals, pharmacies, and medical facilities participating in drug supply transfers"
          />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Overview Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {overviewStats.map((stat) => (
                  <Card key={stat.title} className="border-border bg-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-card-foreground">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Select value={filters.zone} onValueChange={(value) => setFilters({...filters, zone: value})}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select Zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Zones</SelectItem>
                        <SelectItem value="North">North</SelectItem>
                        <SelectItem value="Central">Central</SelectItem>
                        <SelectItem value="South">South</SelectItem>
                        <SelectItem value="East">East</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Hospital">Hospital</SelectItem>
                        <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                        <SelectItem value="Warehouse">Warehouse</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filters.stockHealth} onValueChange={(value) => setFilters({...filters, stockHealth: value})}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select Stock Health" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Stock Health</SelectItem>
                        <SelectItem value="Healthy">Healthy</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Facilities Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Facilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Facility Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Zone</TableHead>
                        <TableHead>Verification Status</TableHead>
                        <TableHead>Stock Health</TableHead>
                        <TableHead>Last Activity</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFacilities.map((facility) => (
                        <TableRow key={facility.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {facility.name}
                              {facility.trusted && (
                                <Badge variant="secondary" className="text-xs">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Trusted Facility
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{facility.type}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {facility.zone}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={facility.verificationStatus === "Verified" ? "default" : "secondary"}>
                              {facility.verificationStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`h-3 w-3 rounded-full ${getStockHealthColor(facility.stockHealth)}`} />
                              {facility.stockHealth}
                            </div>
                          </TableCell>
                          <TableCell>{facility.lastActivity}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    View Inventory
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>{facility.name} - Inventory</DialogTitle>
                                  </DialogHeader>
                                  <div className="p-4 space-y-4">
                                    <p>Mock inventory data for {facility.name}</p>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">Need:</span>
                                      <Badge className={getNeedStatus(getNeed(facility)).className}>
                                        {getNeedStatus(getNeed(facility)).label}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">If we send {sendUnits[facility.id] || 0} units to this facility, Remaining stock at our side will be {getRemainingStock(facility.id)} units</span>
                                      <Badge className={getRemainingStatus(getRemainingStock(facility.id)).className}>
                                        {getRemainingStatus(getRemainingStock(facility.id)).label}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <label htmlFor={`send-units-${facility.id}`} className="font-medium">Send Units:</label>
                                      <Input
                                        id={`send-units-${facility.id}`}
                                        type="number"
                                        value={sendUnits[facility.id] || 0}
                                        onChange={(e) => setSendUnits({...sendUnits, [facility.id]: parseInt(e.target.value) || 0})}
                                        className="w-20"
                                      />
                                      {!isValidSendUnits(facility.id) && (
                                        <span className="text-red-500 text-sm">Invalid units</span>
                                      )}
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Truck className="h-4 w-4 mr-1" />
                                    Initiate Transfer
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Initiate Transfer from {facility.name}</DialogTitle>
                                  </DialogHeader>
                                  <div className="p-4">
                                    <p>Mock transfer initiation for {facility.name}</p>
                                    {/* Add transfer form here */}
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button variant="outline" size="sm" onClick={() => alert(`Contacting ${facility.name}`)}>
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Contact
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
