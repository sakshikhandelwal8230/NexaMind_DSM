"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Search, Filter, Download, ChevronDown, ChevronRight, Phone, AlertTriangle, Info, Upload } from "lucide-react"
import * as XLSX from 'xlsx'
import { useEmergency } from "@/app/providers/emergency-context"

type StatusType = "adequate" | "low" | "critical"
type CategoryType = "OTC" | "Prescription"

interface ActivityLog {
  id: string
  timestamp: string
  action: string
  user: string
  details: string
}

interface InventoryItem {
  id: number
  name: string
  category: CategoryType
  quantity: number
  threshold: number
  status: StatusType
  expiryDate: string
  batchNumber: string
  activityLogs: ActivityLog[]
}

const inventoryData: InventoryItem[] = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "OTC",
    quantity: 2500,
    threshold: 500,
    status: "adequate",
    expiryDate: "2024-12-15",
    batchNumber: "BATCH-001",
    activityLogs: [],
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    category: "Prescription",
    quantity: 15,
    threshold: 100,
    status: "critical",
    expiryDate: "2024-01-05",
    batchNumber: "BATCH-002",
    activityLogs: [],
  },
  {
    id: 3,
    name: "Metformin 500mg",
    category: "Prescription",
    quantity: 120,
    threshold: 200,
    status: "low",
    expiryDate: "2024-08-20",
    batchNumber: "BATCH-003",
    activityLogs: [],
  },
]

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  adequate: { label: "Adequate", className: "bg-green-100 text-green-800 border-green-200" },
  low: { label: "Low Stock", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  critical: { label: "Critical", className: "bg-red-100 text-red-800 border-red-200" },
}

/* ================= INSIGHTS FUNCTION ================= */

const generateInsight = (item: InventoryItem): string | null => {
  if (item.status === "adequate") return null

  if (item.quantity === 0) {
    return "Out of stock detected. Immediate redistribution required."
  }

  if (item.quantity < item.threshold) {
    return "Stock dropped rapidly below minimum threshold."
  }

  if (item.status === "critical") {
    return "High demand observed for this medicine."
  }

  return null
}

export function UserInventoryTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  const { isEmergencyMode } = useEmergency()
  const itemsPerPage = 5

  /* ✅ EXPORT FUNCTION — ERROR FIXED */
  const exportToCSV = (data: InventoryItem[]) => {
    if (!data.length) return

    const headers = [
      "Medicine",
      "Category",
      "Quantity",
      "Threshold",
      "Status",
      "Expiry Date",
      "Batch",
    ]

    const rows = data.map(item => [
      item.name,
      item.category,
      item.quantity,
      item.threshold,
      statusConfig[item.status].label,
      item.expiryDate,
      item.batchNumber,
    ])

    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = "my-inventory.csv"
    link.click()
  }

  /* IMPORT FUNCTION */
  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv,.xlsx'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const data = e.target?.result
        if (!data) return

        let parsedData: any[] = []
        if (file.name.endsWith('.csv')) {
          const csv = data as string
          parsedData = csv.split('\n').map(row => row.split(','))
        } else {
          const workbook = XLSX.read(data, { type: 'binary' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        }

        console.log('Imported data:', parsedData)
      }
      reader.readAsBinaryString(file)
    }
    input.click()
  }

  const toggleRowExpansion = (id: number) => {
    const set = new Set(expandedRows)
    set.has(id) ? set.delete(id) : set.add(id)
    setExpandedRows(set)
  }

  const getExpiryRisk = (date: string) => {
    const diff = Math.ceil(
      (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    if (diff < 3) return { label: "Critical Expiry", className: "bg-red-100 text-red-800" }
    if (diff < 7) return { label: "Expiring Soon", className: "bg-orange-100 text-orange-800" }
    return { label: "Safe", className: "bg-green-100 text-green-800" }
  }

  const filteredData = inventoryData.filter(item =>
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === "all" || item.status === statusFilter) &&
    (categoryFilter === "all" || item.category === categoryFilter)
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, categoryFilter])

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Inventory</CardTitle>
        <CardDescription>Personal medicine stock overview</CardDescription>

        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Search medicine or batch..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            disabled={isEmergencyMode}
          />

          <Button
            variant="outline"
            onClick={() => exportToCSV(filteredData)}
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>

          <Button
            variant="outline"
            onClick={handleImport}
          >
            <Upload className="h-4 w-4 mr-1" />
            Import
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Medicine</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Expiry</TableHead>
              <TableHead className="text-center">Insights</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.map(item => {
              const expiry = getExpiryRisk(item.expiryDate)
              const open = expandedRows.has(item.id)

              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRowExpansion(item.id)}
                    >
                      {open ? <ChevronDown /> : <ChevronRight />}
                    </Button>
                  </TableCell>

                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.batchNumber}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={statusConfig[item.status].className}>
                      {statusConfig[item.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={expiry.className}>{expiry.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
