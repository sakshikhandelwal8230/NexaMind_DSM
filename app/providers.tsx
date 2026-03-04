"use client"

import type React from "react"

import { AuthProvider } from "./providers/auth-context"
import { EmergencyProvider } from "./providers/emergency-context"
import { EmergencyOverlay } from "@/components/dashboard/emergency-overlay"
import { SearchProvider } from "@/app/providers/search-context"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster richColors position="top-right" />
      <AuthProvider>
        <EmergencyProvider>
          <SearchProvider>
            {children}
            <EmergencyOverlay />
          </SearchProvider>
        </EmergencyProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
