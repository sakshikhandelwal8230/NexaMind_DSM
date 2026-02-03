import Link from "next/link"
import { Pill, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                <Pill className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-lg font-bold">Drug Supply Monitor</span>
            </Link>
            <p className="text-sm text-primary-foreground/70">
              A government initiative to ensure medicine availability across healthcare facilities nationwide.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-primary-foreground/70 transition-colors hover:text-primary-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/login"
                  className="text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/admin"
                  className="text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Medical Authority Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/user"
                  className="text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  User Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Mail className="h-4 w-4" />
                <span>support@drugsupplymonitor.gov</span>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Phone className="h-4 w-4" />
                <span>1800-XXX-XXXX (Toll Free)</span>
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Ministry of Health & Family Welfare, New Delhi</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} Drug Supply Monitor. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-primary-foreground/60 transition-colors hover:text-primary-foreground">
                Privacy Policy
              </Link>
              <Link href="#" className="text-primary-foreground/60 transition-colors hover:text-primary-foreground">
                Terms of Service
              </Link>
              <Link href="#" className="text-primary-foreground/60 transition-colors hover:text-primary-foreground">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
