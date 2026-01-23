"use client"

import type React from "react"

import { AuthProvider } from "./providers/auth-context"
import { EmergencyProvider } from "./providers/emergency-context"
import { EmergencyOverlay } from "../components/dashboard/emergency-overlay"
import { SearchProvider } from "@/app/providers/search-context"
import { ThemeProvider } from "../components/theme-provider"
import { Toaster } from "sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <EmergencyProvider>
          <SearchProvider>
            {children}
            <EmergencyOverlay />
            <Toaster richColors position="top-right" />
          </SearchProvider>
        </EmergencyProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
