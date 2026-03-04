"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/providers/auth-context"
import { Clock, ShieldX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { isAuthenticated, isApproved, isLoading, profile, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  // Show nothing while checking auth state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // User is authenticated but NOT approved
  if (!isApproved) {
    const isSuspended = profile?.account_status === "suspended"

    return (
      <div className="flex h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${isSuspended
            ? "bg-red-100 dark:bg-red-900/30"
            : "bg-amber-100 dark:bg-amber-900/30"
            }`}>
            {isSuspended ? (
              <ShieldX className="h-10 w-10 text-red-600 dark:text-red-400" />
            ) : (
              <Clock className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              {isSuspended ? "Account Suspended" : "Approval Pending"}
            </h2>
            <p className="text-muted-foreground">
              {isSuspended
                ? "Your account has been suspended by an administrator. Please contact support for assistance."
                : "Your account is awaiting admin approval. You'll be able to access the dashboard once approved."}
            </p>
          </div>

          {/* DEBUG INFO - REMOVE AFTER FIXING */}
          <div className="p-3 bg-muted rounded text-[10px] text-left font-mono space-y-1">
            <p className="font-bold border-b pb-1 mb-1 italic">Debug: If this ID doesn't match your DB id, it won't work.</p>
            <p>Auth ID: {profile?.id || "No Profile ID"}</p>
            <p>Role: {profile?.role || "null"}</p>
            <p>Approved: {String(profile?.is_approved)}</p>
            <p>Status: {profile?.account_status || "null"}</p>
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={async () => {
                await signOut()
                router.push("/login")
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Check admin role requirement
  if (requireAdmin && profile?.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center bg-background p-4">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
          <p className="text-muted-foreground">You don't have admin permissions to access this page.</p>
          <Button variant="outline" onClick={() => router.push("/dashboard/user")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
