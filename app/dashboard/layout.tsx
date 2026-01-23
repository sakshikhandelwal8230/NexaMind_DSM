"use client"

import { AIChatbot } from "@/components/dashboard/ai-chatbot"
import { SearchProvider } from "@/app/providers/search-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SearchProvider>
      <div className="relative min-h-screen">
        {children}

        {/* Floating AI Chatbot */}
        <AIChatbot />
      </div>
    </SearchProvider>
  )
}
