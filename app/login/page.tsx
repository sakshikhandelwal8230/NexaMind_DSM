import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { LoginForm } from "@/components/auth/login-form"
import { Pill } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center bg-muted px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <Pill className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="mt-2 text-muted-foreground">Sign in to access your dashboard</p>
          </div>

          <div className="mb-4 text-center">
            <span className="text-xs text-muted-foreground">
              Demo Email:{" "}
              <span className="font-semibold">demo@nexaamind.com</span>
              <br />
              Demo Password:{" "}
              <span className="font-semibold">demo1234</span>
            </span>
          </div>

          <LoginForm />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
