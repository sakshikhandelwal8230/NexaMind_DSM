"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save, X } from "lucide-react"

// Dummy user data
const initialUserData = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  facility: "Central Hospital",
  role: "User",
  avatarUrl: "",
}

export default function EditProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [userData, setUserData] = useState(initialUserData)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(initialUserData.avatarUrl)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check if file is image
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, avatar: 'Please select an image file (jpg, png)' })
        return
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, avatar: 'File size must be less than 5MB' })
        return
      }

      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setErrors({ ...errors, avatar: '' })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setUserData({ ...userData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!userData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      // Log updated data to console
      console.log('Updated profile data:', {
        ...userData,
        avatarFile: selectedFile,
      })

      // In a real app, this would save to backend
      alert('Profile updated successfully! (Check console for logged data)')

      // Navigate back to profile
      router.push('/dashboard/profile')
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/profile')
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <AuthGuard>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader title="Edit Profile" subtitle="Update your account information" />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Profile Picture Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>
                    Upload a new profile picture. Supported formats: JPG, PNG. Max size: 5MB.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-32 w-32 cursor-pointer" onClick={handleAvatarClick}>
                      <AvatarImage src={previewUrl} alt={userData.fullName} />
                      <AvatarFallback className="text-4xl">
                        {userData.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-0 rounded-full"
                      onClick={handleAvatarClick}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {errors.avatar && (
                    <p className="text-sm text-destructive">{errors.avatar}</p>
                  )}
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={userData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className={errors.fullName ? 'border-destructive' : ''}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={userData.email}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facility">Facility</Label>
                      <Input
                        id="facility"
                        value={userData.facility}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Contact Medical Authority to change facility
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={userData.role}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Role is assigned by Medical Authority
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
