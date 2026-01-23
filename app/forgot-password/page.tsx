import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { Pill } from "lucide-react"

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center bg-muted px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <Pill className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Forgot Password?</h1>
            <p className="mt-2 text-muted-foreground">
              Enter your email address and we&apos;ll send you a link to reset your password
            </p>
          </div>

          <ForgotPasswordForm />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
