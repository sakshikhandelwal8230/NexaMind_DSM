"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Shield, Building2, CheckCircle, Edit, Settings } from "lucide-react"

// Default user data
const defaultUserData = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  role: "User",
  facility: "Central Hospital",
  accountStatus: "Active",
  avatarUrl: "",
}

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState(defaultUserData)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load saved profile data from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile)
        setUserData({
          ...defaultUserData,
          ...parsed,
        })
      } catch (e) {
        console.error("Failed to parse saved profile:", e)
      }
    }
    setIsLoaded(true)
  }, [])

  const handleGoToSettings = () => {
    router.push("/dashboard/settings")
  }

  return (
    <AuthGuard>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader title="My Profile" subtitle="View and manage your account information" />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Profile Header */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={userData.avatarUrl} alt={userData.fullName} />
                      <AvatarFallback className="text-2xl">
                        {userData.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h2 className="text-2xl font-bold">{userData.fullName}</h2>
                      <p className="text-muted-foreground">{userData.email}</p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" asChild>
                        <Link href="/dashboard/profile/edit">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Link>
                      </Button>
                      <Button onClick={handleGoToSettings}>
                        <Settings className="mr-2 h-4 w-4" />
                        Go to Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Your account details and status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Full Name</p>
                        <p className="text-sm text-muted-foreground">{userData.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{userData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Role</p>
                        <p className="text-sm text-muted-foreground">{userData.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Facility</p>
                        <p className="text-sm text-muted-foreground">{userData.facility}</p>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Account Status</p>
                      <p className="text-sm text-muted-foreground">{userData.accountStatus}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
