"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Users, UserCheck, Shield, Eye, Edit, UserX, Key, Activity, AlertTriangle, Copy, MessageSquare, TrendingUp, TrendingDown, Search, Filter } from "lucide-react"

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  facilityName: string;
  zone: string;
  verificationStatus: string;
  lastLogin: string;
  accountStatus: string;
  createdAt: string;
  transfersInitiated: number;
  alertsRaised: number;
  inventoryUpdates: number;
}

// Mock data
const initialUsers: User[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@hospital.com",
    phone: "+1-555-0101",
    role: "Medical Authority",
    facilityName: "City General Hospital",
    zone: "North",
    verificationStatus: "Verified",
    lastLogin: "2024-01-15",
    accountStatus: "Active",
    createdAt: "2023-06-01",
    transfersInitiated: 45,
    alertsRaised: 12,
    inventoryUpdates: 78,
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike.chen@regional.com",
    phone: "+1-555-0102",
    role: "Hospital Staff",
    facilityName: "Regional Medical Center",
    zone: "South",
    verificationStatus: "Verified",
    lastLogin: "2024-01-14",
    accountStatus: "Active",
    createdAt: "2023-07-15",
    transfersInitiated: 23,
    alertsRaised: 5,
    inventoryUpdates: 34,
  },
  {
    id: 3,
    name: "Lisa Rodriguez",
    email: "lisa.rodriguez@pharmacy.com",
    phone: "+1-555-0103",
    role: "Pharmacist",
    facilityName: "Downtown Pharmacy",
    zone: "East",
    verificationStatus: "Pending",
    lastLogin: "2024-01-10",
    accountStatus: "Suspended",
    createdAt: "2023-08-20",
    transfersInitiated: 67,
    alertsRaised: 8,
    inventoryUpdates: 92,
  },
  {
    id: 4,
    name: "John Smith",
    email: "john.smith@hospital.com",
    phone: "+1-555-0104",
    role: "Hospital Staff",
    facilityName: "City General Hospital",
    zone: "North",
    verificationStatus: "Verified",
    lastLogin: "2024-01-16",
    accountStatus: "Active",
    createdAt: "2023-09-10",
    transfersInitiated: 18,
    alertsRaised: 3,
    inventoryUpdates: 25,
  },
  {
    id: 5,
    name: "Emma Davis",
    email: "emma.davis@clinic.com",
    phone: "+1-555-0105",
    role: "Pharmacist",
    facilityName: "Suburban Clinic",
    zone: "West",
    verificationStatus: "Verified",
    lastLogin: "2024-01-13",
    accountStatus: "Active",
    createdAt: "2023-10-05",
    transfersInitiated: 31,
    alertsRaised: 7,
    inventoryUpdates: 45,
  },
  {
    id: 6,
    name: "Robert Wilson",
    email: "robert.wilson@admin.com",
    phone: "+1-555-0106",
    role: "Medical Authority",
    facilityName: "Central Admin Office",
    zone: "Central",
    verificationStatus: "Verified",
    lastLogin: "2024-01-16",
    accountStatus: "Active",
    createdAt: "2023-05-01",
    transfersInitiated: 89,
    alertsRaised: 25,
    inventoryUpdates: 156,
  },
  {
    id: 7,
    name: "Maria Garcia",
    email: "maria.garcia@staff.com",
    phone: "+1-555-0107",
    role: "Hospital Staff",
    facilityName: "Regional Medical Center",
    zone: "South",
    verificationStatus: "Pending",
    lastLogin: "2024-01-12",
    accountStatus: "Active",
    createdAt: "2023-11-15",
    transfersInitiated: 12,
    alertsRaised: 2,
    inventoryUpdates: 18,
  },
  {
    id: 8,
    name: "David Brown",
    email: "david.brown@pharm.com",
    phone: "+1-555-0108",
    role: "Pharmacist",
    facilityName: "Downtown Pharmacy",
    zone: "East",
    verificationStatus: "Verified",
    lastLogin: "2024-01-11",
    accountStatus: "Suspended",
    createdAt: "2023-12-01",
    transfersInitiated: 54,
    alertsRaised: 9,
    inventoryUpdates: 67,
  },
  {
    id: 9,
    name: "Jennifer Lee",
    email: "jennifer.lee@clinic.com",
    phone: "+1-555-0109",
    role: "Hospital Staff",
    facilityName: "Suburban Clinic",
    zone: "West",
    verificationStatus: "Verified",
    lastLogin: "2024-01-14",
    accountStatus: "Active",
    createdAt: "2023-10-20",
    transfersInitiated: 27,
    alertsRaised: 4,
    inventoryUpdates: 38,
  },
  {
    id: 10,
    name: "Christopher Taylor",
    email: "chris.taylor@admin.com",
    phone: "+1-555-0110",
    role: "Medical Authority",
    facilityName: "Central Admin Office",
    zone: "Central",
    verificationStatus: "Verified",
    lastLogin: "2024-01-15",
    accountStatus: "Active",
    createdAt: "2023-04-15",
    transfersInitiated: 102,
    alertsRaised: 31,
    inventoryUpdates: 203,
  },
]

export default function UsersPage() {
  const [localSearch, setLocalSearch] = useState("")
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false)
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [newRole, setNewRole] = useState("")
  const [tempPassword, setTempPassword] = useState("")

  const [roleFilter, setRoleFilter] = useState("all")
  const [verificationFilter, setVerificationFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(localSearch.toLowerCase()) ||
                         user.email.toLowerCase().includes(localSearch.toLowerCase()) ||
                         user.facilityName.toLowerCase().includes(localSearch.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesVerification = verificationFilter === "all" || user.verificationStatus === verificationFilter
    const matchesStatus = statusFilter === "all" || user.accountStatus === statusFilter
    return matchesSearch && matchesRole && matchesVerification && matchesStatus
  })

  const allUsers = filteredUsers
  const pendingUsers = filteredUsers.filter(u => u.verificationStatus === "Pending")
  const suspendedUsers = filteredUsers.filter(u => u.accountStatus === "Suspended")

  const overviewStats = [
    {
      title: "Total Users",
      value: users.length.toString(),
      trend: "+2 this week",
      trendUp: true,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Active Users",
      value: users.filter(u => u.accountStatus === "Active").length.toString(),
      trend: "+1 this week",
      trendUp: true,
      icon: UserCheck,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Medical Authorities",
      value: users.filter(u => u.role === "Admin").length.toString(),
      trend: "No change",
      trendUp: null,
      icon: Shield,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Pending Verifications",
      value: users.filter(u => u.verificationStatus === "Pending").length.toString(),
      trend: "-1 this week",
      trendUp: false,
      icon: AlertTriangle,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ]

  const userInsights = {
    Admin: users.filter(u => u.role === "Admin").length,
    Pharmacist: users.filter(u => u.role === "Pharmacist").length,
    "Hospital Staff": users.filter(u => u.role === "Hospital Staff").length,
  }

  const handleViewProfile = (user: User) => {
    setSelectedUser(user)
    setIsViewProfileOpen(true)
  }

  const handleChangeRole = () => {
    if (selectedUser && newRole) {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, role: newRole } : u))
      toast({
        title: "Role Updated",
        description: `${selectedUser.name}'s role has been changed to ${newRole}`,
      })
      setIsChangeRoleOpen(false)
      setNewRole("")
    }
  }

  const handleStatusChange = (user: User, newStatus: string) => {
    setUsers(users.map(u => u.id === user.id ? { ...u, accountStatus: newStatus } : u))
    toast({
      title: "Status Updated",
      description: `${user.name} has been ${newStatus.toLowerCase()}`,
    })
  }

  const handleResetPassword = () => {
    const password = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12).toUpperCase()
    setTempPassword(password)
    toast({
      title: "Temporary Password Generated",
      description: "A temporary password has been created for the user",
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Password copied to clipboard",
    })
  }

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    toast({
      title: "Copied",
      description: "Email copied to clipboard",
    })
  }

  return (
    <AuthGuard>
      <div className="flex h-screen bg-background">
        <DashboardSidebar isAdmin />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader
            title="Users Management"
            subtitle="Medical Authority can manage system users (hospital staff, pharmacists, medical authorities)"
            searchPlaceholder="Search users..."
            searchValue={localSearch}
            onSearchChange={setLocalSearch}
          />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Overview Stats */}
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
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        {stat.trendUp === true && <TrendingUp className="h-3 w-3 mr-1 text-green-500" />}
                        {stat.trendUp === false && <TrendingDown className="h-3 w-3 mr-1 text-red-500" />}
                        {stat.trend}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-4">
                  {/* Quick Filters */}
                  <Card className="mb-6">
                    <CardContent className="pt-6">
                      <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Global Search Active</span>
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Filter by Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="Admin">Medical Authority</SelectItem>
                            <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                            <SelectItem value="Hospital Staff">Hospital Staff</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Verification" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Verified">Verified</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tabs */}
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="all">All Users ({allUsers.length})</TabsTrigger>
                      <TabsTrigger value="pending">Pending Verification ({pendingUsers.length})</TabsTrigger>
                      <TabsTrigger value="suspended">Suspended ({suspendedUsers.length})</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">
                      <UsersTable users={allUsers} onViewProfile={handleViewProfile} onChangeRole={(user) => { setSelectedUser(user); setIsChangeRoleOpen(true) }} onStatusChange={handleStatusChange} onResetPassword={(user) => { setSelectedUser(user); setIsResetPasswordOpen(true) }} />
                    </TabsContent>
                    <TabsContent value="pending">
                      <UsersTable users={pendingUsers} onViewProfile={handleViewProfile} onChangeRole={(user) => { setSelectedUser(user); setIsChangeRoleOpen(true) }} onStatusChange={handleStatusChange} onResetPassword={(user) => { setSelectedUser(user); setIsResetPasswordOpen(true) }} />
                    </TabsContent>
                    <TabsContent value="suspended">
                      <UsersTable users={suspendedUsers} onViewProfile={handleViewProfile} onChangeRole={(user) => { setSelectedUser(user); setIsChangeRoleOpen(true) }} onStatusChange={handleStatusChange} onResetPassword={(user) => { setSelectedUser(user); setIsResetPasswordOpen(true) }} />
                    </TabsContent>
                  </Tabs>
                </div>

                {/* User Insights - Below the table, full width */}
                <div className="lg:col-span-4 mt-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">User Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-6">
                        {Object.entries(userInsights).map(([role, count]) => (
                          <div key={role} className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{role}:</span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* View Profile Dialog */}
      <Dialog open={isViewProfileOpen} onOpenChange={setIsViewProfileOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              {selectedUser?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    {selectedUser.email}
                    <Button variant="ghost" size="sm" onClick={() => copyEmail(selectedUser.email)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Role</Label>
                  <Badge>{selectedUser.role === "Admin" ? "Medical Authority" : selectedUser.role}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Facility</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.facilityName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Zone</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.zone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Verification Status</Label>
                  <Badge variant={selectedUser.verificationStatus === "Verified" ? "default" : "secondary"}>
                    {selectedUser.verificationStatus}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Account Status</Label>
                  <Badge variant={selectedUser.accountStatus === "Active" ? "default" : "destructive"}>
                    {selectedUser.accountStatus}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Login</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.lastLogin}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created At</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.createdAt}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Activity Summary</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{selectedUser.transfersInitiated}</div>
                    <div className="text-xs text-muted-foreground">Transfers Initiated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{selectedUser.alertsRaised}</div>
                    <div className="text-xs text-muted-foreground">Alerts Raised</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{selectedUser.inventoryUpdates}</div>
                    <div className="text-xs text-muted-foreground">Inventory Updates</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={isChangeRoleOpen} onOpenChange={setIsChangeRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>
              Change the role for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="role">New Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Medical Authority</SelectItem>
                  <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                  <SelectItem value="Hospital Staff">Hospital Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleChangeRole} disabled={!newRole}>
              Update Role
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Generate a temporary password for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
            </div>
            {!tempPassword ? (
              <Button onClick={handleResetPassword}>
                Generate Temporary Password
              </Button>
            ) : (
              <div className="space-y-2">
                <Label>Temporary Password</Label>
                <div className="flex gap-2">
                  <Input value={tempPassword} readOnly />
                  <Button variant="outline" onClick={() => copyToClipboard(tempPassword)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AuthGuard>
  )
}

function UsersTable({ users, onViewProfile, onChangeRole, onStatusChange, onResetPassword }: {
  users: User[];
  onViewProfile: (user: User) => void;
  onChangeRole: (user: User) => void;
  onStatusChange: (user: User, newStatus: string) => void;
  onResetPassword: (user: User) => void;
}) {
  return (
    <Card>
      <CardContent className="pt-6 p-0">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[18%]">User Name</TableHead>
                <TableHead className="w-[12%]">Role</TableHead>
                <TableHead className="w-[18%]">Facility</TableHead>
                <TableHead className="w-[12%]">Verification</TableHead>
                <TableHead className="w-[10%]">Status</TableHead>
                <TableHead className="w-[30%]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.role === "Admin" ? "Medical Authority" : user.role}</TableCell>
                  <TableCell>{user.facilityName}</TableCell>
                  <TableCell>
                    <Badge variant={user.verificationStatus === "Verified" ? "default" : "secondary"}>
                      {user.verificationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.accountStatus === "Active" ? "default" : "destructive"}>
                      {user.accountStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => onViewProfile(user)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onChangeRole(user)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Role
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            {user.accountStatus === "Active" ? (
                              <>
                                <UserX className="h-4 w-4 mr-1" />
                                Suspend
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-1" />
                                Activate
                              </>
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {user.accountStatus === "Active" ? "Suspend User" : "Activate User"}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to {user.accountStatus === "Active" ? "suspend" : "activate"} {user.name}?
                              {user.accountStatus === "Active" && " This will prevent them from accessing the system."}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onStatusChange(user, user.accountStatus === "Active" ? "Suspended" : "Active")}>
                              {user.accountStatus === "Active" ? "Suspend" : "Activate"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button variant="outline" size="sm" onClick={() => onResetPassword(user)}>
                        <Key className="h-4 w-4 mr-1" />
                        Reset
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
  )
}
