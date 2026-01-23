"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Pill,
  LayoutDashboard,
  Package,
  AlertTriangle,
  Settings,
  Shield,
  LogOut,
  Building2,
  ChevronLeft,
  ChevronRight,
  Users,
  Truck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  isAdmin?: boolean
}

export function DashboardSidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Check if current path is transfers or its sub-sections
  const isTransfersSection = pathname === "/transfers" || 
    pathname === "/dashboard/admin/facilities" || 
    pathname === "/dashboard/admin/users"

  const adminLinks = [
    { href: "/dashboard/user", label: "Overview", icon: LayoutDashboard },
    { href: "/inventory", label: "Inventory", icon: Package },
    { href: "/alerts", label: "Alerts", icon: AlertTriangle },
    { href: "/transfers", label: "Transfers", icon: Truck, hasChildren: true },
    { href: "/dashboard/admin/facilities", label: "Facilities", icon: Building2, isChild: true, parent: "/transfers" },
    { href: "/dashboard/admin/users", label: "Users", icon: Users, isChild: true, parent: "/transfers" },
    { href: "/security", label: "Security", icon: Shield },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  const userLinks = [
    { href: "/dashboard/user", label: "Overview", icon: LayoutDashboard },
    { href: "/inventory", label: "My Inventory", icon: Package },
    { href: "/alerts", label: "Alerts", icon: AlertTriangle },
    { href: "/transfers", label: "Transfers", icon: Truck },
    { href: "/security", label: "Security", icon: Shield },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  const links = isAdmin ? adminLinks : userLinks

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <Pill className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">DSM</span>
          </Link>
        )}
        {isCollapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Pill className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {links.map((link: any) => {
            const isActive = pathname === link.href
            const isChildLink = link.isChild
            const showChild = isChildLink && isTransfersSection

            // Hide child links when not in transfers section
            if (isChildLink && !isTransfersSection) {
              return null
            }

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    // Indent child items
                    isChildLink && !isCollapsed && "ml-4 pl-4 border-l-2 border-sidebar-border",
                  )}
                  title={isCollapsed ? link.label : undefined}
                >
                  <link.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span>{link.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full justify-center text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!isCollapsed && <span className="ml-2">Collapse</span>}
        </Button>
      </div>

      {/* User Section */}
      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/login"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
            isCollapsed && "justify-center",
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </Link>
      </div>
    </aside>
  )
}
