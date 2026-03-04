"use client"

import { useState, useMemo } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, CheckCircle, AlertTriangle, Package, Loader2, Hospital, MapPin } from "lucide-react"
import { useSupabase } from "@/hooks/useSupabase"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function TransfersPage() {
  const [localSearch, setLocalSearch] = useState("")
  const { data: transfers, loading, update, remove } = useSupabase<any>("transfers")

  const stats = useMemo(() => {
    if (!transfers) return { total: 0, pending: 0, inTransit: 0, delivered: 0, critical: 0 }
    return {
      total: transfers.length,
      pending: transfers.filter((t: any) => t.status === "requested").length,
      inTransit: transfers.filter((t: any) => t.status === "dispatched").length,
      delivered: transfers.filter((t: any) => t.status === "received").length,
      critical: transfers.filter((t: any) => t.priority === "critical").length,
    }
  }, [transfers])

  const filteredTransfers = useMemo(() => {
    if (!transfers) return []
    return transfers.filter((t: any) =>
      t.medicine_name.toLowerCase().includes(localSearch.toLowerCase()) ||
      t.to_facility?.toLowerCase().includes(localSearch.toLowerCase()) ||
      t.from_facility?.toLowerCase().includes(localSearch.toLowerCase())
    )
  }, [transfers, localSearch])

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await update(id, { status: newStatus })
      toast.success(`Transfer status updated to ${newStatus}`)
    } catch (e) {
      toast.error("Failed to update status")
    }
  }

  const deleteTransfer = async (id: string) => {
    try {
      await remove(id)
      toast.success("Transfer request cancelled.")
    } catch (e) {
      toast.error("Failed to delete.")
    }
  }

  return (
    <AuthGuard requireAdmin>
      <div className="flex h-screen bg-background text-foreground">
        <DashboardSidebar isAdmin />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader
            title="Supply Chain Transfers"
            subtitle="Central dispatch and tracking of medical inventory."
            searchPlaceholder="Search by medicine or facility..."
            searchValue={localSearch}
            onSearchChange={setLocalSearch}
          />

          <main className="flex-1 overflow-y-auto p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <StatCard title="All Transit" value={stats.total} icon={Package} color="primary" />
              <StatCard title="Pending" value={stats.pending} icon={AlertTriangle} color="amber" />
              <StatCard title="In Route" value={stats.inTransit} icon={Truck} color="blue" />
              <StatCard title="Delivered" value={stats.delivered} icon={CheckCircle} color="green" />
              <StatCard title="Critical" value={stats.critical} icon={AlertTriangle} color="red" />
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-muted/50 p-1 mb-6 border gap-2">
                <TabsTrigger value="all" className="px-6 py-2 font-bold uppercase text-[10px] tracking-widest">All Requests</TabsTrigger>
                <TabsTrigger value="pending" className="px-6 py-2 font-bold uppercase text-[10px] tracking-widest">Pending</TabsTrigger>
                <TabsTrigger value="history" className="px-6 py-2 font-bold uppercase text-[10px] tracking-widest">Delivered</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <Card className="border-border shadow-sm overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow>
                        <TableHead className="font-bold text-[10px] uppercase tracking-widest">Priority</TableHead>
                        <TableHead className="font-bold text-[10px] uppercase tracking-widest">Medicine & Batch</TableHead>
                        <TableHead className="font-bold text-[10px] uppercase tracking-widest">Target Facility</TableHead>
                        <TableHead className="font-bold text-[10px] uppercase tracking-widest">Qty</TableHead>
                        <TableHead className="font-bold text-[10px] uppercase tracking-widest text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        [...Array(5)].map((_, i) => (
                          <TableRow key={i}>
                            <TableCell colSpan={5} className="h-16 bg-muted/5 animate-pulse" />
                          </TableRow>
                        ))
                      ) : filteredTransfers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-40 text-center text-muted-foreground italic font-medium">No transfers matching filters.</TableCell>
                        </TableRow>
                      ) : (
                        filteredTransfers.map((t: any) => (
                          <TableRow key={t.id} className="group hover:bg-muted/30 transition-colors">
                            <TableCell>
                              <Badge className={cn(
                                "font-black text-[9px] uppercase tracking-tighter",
                                t.priority === 'critical' ? "bg-red-600 text-white" : "bg-primary/10 text-primary border-primary/20"
                              )}>
                                {t.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-bold text-sm text-foreground">{t.medicine_name}</span>
                                <span className="text-[10px] opacity-50 font-mono">ID: {t.id.slice(0, 8)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded bg-muted">
                                  <MapPin className="h-3 w-3 text-primary" />
                                </div>
                                <span className="text-sm font-medium">{t.to_facility || 'Unknown Facility'}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-black text-primary font-mono">{t.quantity}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {t.status === 'requested' && (
                                  <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase tracking-widest" onClick={() => updateStatus(t.id, 'dispatched')}>
                                    Dispatch
                                  </Button>
                                )}
                                {t.status === 'dispatched' && (
                                  <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase tracking-widest text-green-600" onClick={() => updateStatus(t.id, 'received')}>
                                    Received
                                  </Button>
                                )}
                                <Button size="sm" variant="ghost" className="h-8 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white" onClick={() => deleteTransfer(t.id)}>
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    primary: "border-primary text-primary bg-primary/5 shadow-primary/5",
    amber: "border-amber-500 text-amber-500 bg-amber-500/5 shadow-amber-500/5",
    blue: "border-blue-500 text-blue-500 bg-blue-500/5 shadow-blue-500/5",
    green: "border-green-500 text-green-500 bg-green-500/5 shadow-green-500/5",
    red: "border-red-600 text-red-600 bg-red-600/5 shadow-red-600/5 ring-1 ring-red-600/20"
  }
  return (
    <Card className={cn("border-l-4 shadow-xl transition-all duration-300 hover:scale-105", colors[color])}>
      <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4">
        <Icon className="h-4 w-4 opacity-50" />
        <CardTitle className="text-[10px] font-black uppercase tracking-widest opacity-80">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-3xl font-black tracking-tighter">{value}</div>
      </CardContent>
    </Card>
  )
}
