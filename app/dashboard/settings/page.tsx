"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import { useAuth } from "@/app/providers/auth-context"
import { Key, Mail, Shield, Bell, Palette, LogOut, Loader2, CheckCircle, XCircle } from "lucide-react"

export default function SettingsPage() {
  const { logout } = useAuth()
  const { theme, setTheme } = useTheme()

  // State for toggles
  const [emailPreferences, setEmailPreferences] = useState(true)
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [lowStockAlerts, setLowStockAlerts] = useState(true)
  const [criticalAlerts, setCriticalAlerts] = useState(true)
  const [expiryAlerts, setExpiryAlerts] = useState(true)

  // State for change password form
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState("")
  const [passwordMessageType, setPasswordMessageType] = useState<"success" | "error">("success")

  const handleLogoutAll = () => {
    // Implement logout from all devices logic
    logout()
  }

  const handleChangePassword = async () => {
    // Reset message
    setPasswordMessage("")
    setPasswordMessageType("success")

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage("All fields are required")
      setPasswordMessageType("error")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New password and confirmation do not match")
      setPasswordMessageType("error")
      return
    }

    if (newPassword.length < 6) {
      setPasswordMessage("New password must be at least 6 characters long")
      setPasswordMessageType("error")
      return
    }

    setIsChangingPassword(true)

    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setPasswordMessage("Password changed successfully!")
        setPasswordMessageType("success")
        // Clear form
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setPasswordMessage(data.message || "Failed to change password")
        setPasswordMessageType("error")
      }
    } catch (error) {
      setPasswordMessage("An error occurred. Please try again.")
      setPasswordMessageType("error")
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <AuthGuard>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader title="Settings" subtitle="Manage your account and preferences" />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl space-y-6">
              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account security and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Change Password Section */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Change Password</h4>
                      <p className="text-sm text-muted-foreground">
                        Update your account password
                      </p>
                    </div>

                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                        />
                      </div>

                      {passwordMessage && (
                        <div className={`flex items-center gap-2 text-sm ${
                          passwordMessageType === "success"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}>
                          {passwordMessageType === "success" ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          {passwordMessage}
                        </div>
                      )}

                      <Button
                        onClick={handleChangePassword}
                        disabled={isChangingPassword}
                        className="w-full"
                      >
                        {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Change Password
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Preferences</p>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications
                      </p>
                    </div>
                    <Switch
                      checked={emailPreferences}
                      onCheckedChange={setEmailPreferences}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security
                      </p>
                    </div>
                    <Switch
                      checked={twoFactorAuth}
                      onCheckedChange={setTwoFactorAuth}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>
                    Configure your alert preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Low Stock Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when inventory is low
                      </p>
                    </div>
                    <Switch
                      checked={lowStockAlerts}
                      onCheckedChange={setLowStockAlerts}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Critical Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Receive critical system notifications
                      </p>
                    </div>
                    <Switch
                      checked={criticalAlerts}
                      onCheckedChange={setCriticalAlerts}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Expiry Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Alerts for expiring medicines
                      </p>
                    </div>
                    <Switch
                      checked={expiryAlerts}
                      onCheckedChange={setExpiryAlerts}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Theme & Appearance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Theme & Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize the look and feel of your dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Theme Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Choose your preferred theme
                      </p>
                    </div>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Active Sessions</p>
                      <p className="text-sm text-muted-foreground">
                        View and manage your active sessions
                      </p>
                    </div>
                    <Button variant="outline">View Sessions</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Logout from All Devices</p>
                      <p className="text-sm text-muted-foreground">
                        Sign out from all devices
                      </p>
                    </div>
                    <Button variant="destructive" onClick={handleLogoutAll}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout All
                    </Button>
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
