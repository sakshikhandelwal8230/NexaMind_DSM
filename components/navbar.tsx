"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/app/providers/auth-context"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const pathname = usePathname()

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#how-it-works", label: "How It Works" },
  ]

  const isSecurityPage = pathname.includes("security")

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-primary text-primary-foreground">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
            <Pill className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">Drug Supply Monitor</span>
        </Link>

        {!isSecurityPage && (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-1 text-sm font-medium text-primary-foreground/80 transition-all duration-300 hover:bg-black/10 dark:hover:bg-black/50 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <ThemeToggle />
              <Button variant="ghost" className="text-primary-foreground hover:bg-black/10 dark:hover:bg-black/50 dark:hover:text-white transition-all duration-300 px-3 py-1 rounded-md" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-accent text-accent-foreground hover:bg-black/10 dark:hover:bg-black/50 dark:hover:text-white transition-all duration-300 px-3 py-1 rounded-md" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </>
        )}

        {isSecurityPage && (
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {!isSecurityPage && isMenuOpen && (
        <div className="border-t border-primary-foreground/10 bg-primary md:hidden">
          <nav className="container mx-auto flex flex-col gap-2 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-1 text-sm font-medium text-primary-foreground/80 transition-all duration-300 hover:bg-black/10 dark:hover:bg-black/50 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-primary-foreground/10 pt-4">
              <Button
                variant="ghost"
                className="justify-start text-primary-foreground hover:bg-black/10 dark:hover:bg-black/50 dark:hover:text-white transition-all duration-300 px-3 py-1 rounded-md"
                asChild
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-accent text-accent-foreground hover:bg-black/10 dark:hover:bg-black/50 dark:hover:text-white transition-all duration-300 px-3 py-1 rounded-md" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
