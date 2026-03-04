import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground space-y-6">
            <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <ShieldAlert className="h-10 w-10 text-destructive" />
            </div>
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-black uppercase tracking-tighter">Access Denied</h1>
                <p className="text-muted-foreground font-medium max-w-md">
                    Your credentials do not carry the administrative clearance required to access this protocol hub.
                </p>
            </div>
            <div className="flex gap-4">
                <Button asChild variant="outline">
                    <Link href="/dashboard">Return to Dashboard</Link>
                </Button>
                <Button asChild>
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
        </div>
    )
}
