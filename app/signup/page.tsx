import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { SignupForm } from "@/components/auth/signup-form"
import { Pill } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center bg-muted px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <Pill className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Create an Account</h1>
            <p className="mt-2 text-muted-foreground">Register your healthcare facility</p>
          </div>

          <SignupForm />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
