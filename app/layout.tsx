import "./globals.css"
import type { Metadata } from "next"
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "Drug Supply Monitor",
  description: "Government-authorized platform to prevent drug shortages",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
