"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, Eye, EyeOff, LogIn, Clock, ShieldX } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { toast } from "sonner"
import { useAuth } from "@/app/providers/auth-context"
import { useEffect } from "react"

export function LoginForm() {
  const router = useRouter()
  const { user, profile, signOut, isAuthenticated, isLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [showActiveSession, setShowActiveSession] = useState(false)

  // Manual Session Handover Protocol
  // Redirection is now manually triggered via the control hub to ensure situational awareness.
  const [showPassword, setShowPassword] = useState(false)
  const [pendingApproval, setPendingApproval] = useState(false)
  const [suspended, setSuspended] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setPendingApproval(false)
    setSuspended(false)

    try {
      const supabase = createClient()

      // 1. Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw authError

      // Start redirection protocol immediately to prevent session card flash
      setIsRedirecting(true)

      // 2. Check if user is approved in the profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_approved, account_status, role")
        .eq("id", authData.user.id)
        .single()

      if (profileError) {
        // Profile doesn't exist yet — sign out and show pending
        await supabase.auth.signOut()
        setPendingApproval(true)
        setIsRedirecting(false)
        setLoading(false)
        return
      }

      // 3. Check if suspended
      if (profile.account_status === "suspended") {
        await supabase.auth.signOut()
        setSuspended(true)
        setIsRedirecting(false)
        setLoading(false)
        return
      }

      // 4. Check if NOT approved — block login
      if (!profile.is_approved || profile.account_status !== "active") {
        await supabase.auth.signOut()
        setPendingApproval(true)
        setIsRedirecting(false)
        setLoading(false)
        return
      }

      // 5. Approved! Redirect based on role
      if (profile.role === "admin") {
        toast.success("Executive Authority Verified", {
          description: "Initializing secure administrative session in Sector-G."
        })
        router.push("/admin")
      } else {
        toast.success("Signed in successfully!")
        router.push("/dashboard/user")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in")
      setLoading(false)
      setIsRedirecting(false)
    }
  }

  // Situational Guard: Only show the active session card if the user has been on the page 
  // for more than 1 second while already authenticated. This prevents flashing during login.
  // We also check for 'logged_out' param to keep it HIDDEN after a termination protocol.
  useEffect(() => {
    const isRecentlyLoggedOut = window.location.search.includes('logged_out=true')

    if (!isLoading && isAuthenticated && user && !loading && !isRedirecting && !isRecentlyLoggedOut) {
      const timer = setTimeout(() => setShowActiveSession(true), 1000)
      return () => clearTimeout(timer)
    } else {
      setShowActiveSession(false)
    }
  }, [isAuthenticated, user, isLoading, loading, isRedirecting])

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in with Google")
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    toast.info("Decommissioning Identity Session...", {
      description: "Executing executive logout protocol."
    })

    // Fail-safe: Force redirect after 1.5s regardless of session state
    const failSafeId = setTimeout(() => {
      // Clear all possible local auth data
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = "/login?logged_out=true"
    }, 1500)

    try {
      await signOut()
      clearTimeout(failSafeId)

      // Force clear all local states before official landing
      localStorage.clear()
      sessionStorage.clear()

      // Use a query param to ensure the terminal knows we just logged out
      window.location.href = "/login?logged_out=true"
    } catch (err) {
      console.error("Logout error:", err)
      localStorage.clear()
      window.location.href = "/login?logged_out=true"
    }
  }

  // Show "Pending Approval" message
  if (pendingApproval) {
    return (
      <Card className="border-border bg-card shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Clock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground">Account Pending Approval</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your account has been created but is <strong>awaiting admin approval</strong>.
              You will be able to log in once an administrator verifies and activates your account.
            </p>
            <p className="text-xs text-muted-foreground">
              This typically takes 24-48 hours. If you need urgent access, please contact the system administrator.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setPendingApproval(false)}
            >
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show "Suspended" message
  if (suspended) {
    return (
      <Card className="border-border bg-card shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <ShieldX className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground">Account Suspended</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your account has been <strong>suspended</strong> by an administrator.
              Please contact the system administrator for more information.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSuspended(false)}
            >
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show "Executive Handover" loading state during redirection
  // This prevents the "Active Session Detected" card from flashing before the page transition completes
  if (isRedirecting || (isAuthenticated && user && loading)) {
    return (
      <Card className="border-primary/20 bg-primary/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center p-12 space-y-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-xl shadow-primary/20" />
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary italic">Executive Authority Verified</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 animate-pulse">Initializing Direct Secure Handover...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show "Already Logged In" message
  // Suppressed during active login redirects, initial auth setup, submitting, or mounting guard
  if (!isLoading && isAuthenticated && user && !loading && !isRedirecting && showActiveSession) {
    return (
      <Card className="border-primary/20 bg-primary/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
        <div className="absolute -right-10 -bottom-10 h-64 w-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl text-card-foreground font-black uppercase tracking-tight flex items-center gap-2">
            <ShieldX className="h-5 w-5 text-primary" />
            Active Session Detected
          </CardTitle>
          <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-50">Authorized Identity: {user?.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xl">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase tracking-tight">{profile?.full_name || 'Authorized Node'}</span>
              <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest leading-none mt-1">Role: {profile?.role || 'User'} Rank</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button asChild variant="outline" className="font-black uppercase text-[10px] tracking-widest h-12 border-primary/20 hover:bg-primary/10">
              <Link href={profile?.role === 'admin' ? '/admin' : '/dashboard/user'}>Continue to Dashboard</Link>
            </Button>
            <Button
              onClick={handleSignOut}
              className="font-black uppercase text-[10px] tracking-widest h-12 bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
            >
              Terminate Previous Session
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl text-card-foreground">Sign In</CardTitle>
        <CardDescription>Enter your credentials to access the system</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full gap-2 bg-primary text-primary-foreground" disabled={loading}>
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
