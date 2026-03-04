"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "sonner"
import { useAuth } from "@/app/providers/auth-context"
import { useSupabase } from "@/hooks/useSupabase"
import {
  Check,
  X,
  Crown,
  Building2,
  Shield,
  CreditCard,
  Calendar,
  Lock,
  Server,
  Award,
  Settings,
  Mail,
  Phone,
  AlertTriangle,
  RefreshCw,
  XCircle,
  Loader2,
  HeadphonesIcon
} from "lucide-react"

// Plan Data
const plans = [
  {
    id: "Starter",
    name: "Starter",
    description: "Perfect for small facilities getting started",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ["1 Facility", "Up to 500 medicines", "Basic alerts", "Email support"],
    cta: "Start Free",
    ctaVariant: "outline" as const,
  },
  {
    id: "Pro",
    name: "Pro",
    description: "For growing facilities that need more power",
    monthlyPrice: 4990,
    yearlyPrice: 39990,
    popular: true,
    features: ["Up to 5 Facilities", "Unlimited medicines", "Advanced alerts & AI", "Transfer Protocol"],
    cta: "Upgrade to Pro",
    ctaVariant: "default" as const,
  },
  {
    id: "Enterprise",
    name: "Enterprise",
    description: "For large organizations with custom needs",
    monthlyPrice: null,
    yearlyPrice: null,
    features: ["Unlimited Facilities", "Custom AI models", "24/7 support", "SLA Guarantee"],
    cta: "Contact Sales",
    ctaVariant: "secondary" as const,
  },
]

export default function SubscriptionPage() {
  const { userProfile, refreshProfile } = useAuth()
  const { update } = useSupabase("profiles")

  const [isYearly, setIsYearly] = useState(false)
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async (plan: any) => {
    if (plan.id === "Enterprise") {
      toast.info("Sales team notified. We will reach out shortly.")
      return
    }
    setSelectedPlan(plan)
    setIsUpgradeDialogOpen(true)
  }

  const confirmUpgrade = async () => {
    if (!userProfile) return
    setLoading(true)
    try {
      await update(userProfile.id, {
        plan: selectedPlan.id,
        next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      })
      await refreshProfile()
      toast.success(`Welcome to ${selectedPlan.name}!`)
      setIsUpgradeDialogOpen(false)
    } catch (e) {
      toast.error("Subscription update failed.")
    } finally {
      setLoading(false)
    }
  }

  const currentPlan = userProfile?.plan || "Starter"

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Pricing & Licensing" subtitle="Scale your medical supply capabilities" hideSearch />

        <main className="flex-1 overflow-y-auto px-8 pb-12 scrollbar-thin scrollbar-thumb-primary/10">
          <div className="max-w-6xl mx-auto space-y-12 py-12">

            {/* Hero */}
            <div className="text-center space-y-4">
              <Badge variant="outline" className="px-4 py-1 text-[10px] font-black uppercase tracking-widest border-primary/30 text-primary">Licensing Tier Selection</Badge>
              <h1 className="text-5xl font-black uppercase tracking-tighter">Choose your operational scale</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">From individual clinics to national health infrastructure. Select the protocol that fits your facility density.</p>

              <div className="flex items-center justify-center gap-4 pt-6">
                <span className={!isYearly ? "font-black text-sm" : "opacity-40 text-sm font-bold"}>Monthly</span>
                <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-primary" />
                <span className={isYearly ? "font-black text-sm" : "opacity-40 text-sm font-bold"}>Yearly</span>
                {isYearly && <Badge className="bg-emerald-500 text-white font-black text-[10px] uppercase">SAVE 20%</Badge>}
              </div>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => {
                const isActive = currentPlan === plan.id
                const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
                return (
                  <Card key={plan.id} className={cn(
                    "relative overflow-hidden border-border/50 shadow-2xl transition-all duration-500 hover:scale-[1.02]",
                    plan.popular && "border-primary/50 shadow-primary/10 bg-primary/5",
                    isActive && "ring-2 ring-primary border-primary"
                  )}>
                    {plan.popular && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-primary text-white text-[9px] font-black px-4 py-1 rotate-45 translate-x-4 translate-y-2 uppercase shadow-lg">Popular</div>
                      </div>
                    )}
                    <CardHeader className="pt-10 pb-6 text-center">
                      <CardTitle className="text-2xl font-black uppercase tracking-tight">{plan.name}</CardTitle>
                      <CardDescription className="font-medium h-10">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="text-center">
                        {price !== null ? (
                          <div className="flex flex-col items-center">
                            <span className="text-5xl font-black tracking-tighter">₹{price}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Per {isYearly ? 'Year' : 'Month'}</span>
                          </div>
                        ) : (
                          <div className="h-16 flex items-center justify-center">
                            <span className="text-2xl font-black uppercase tracking-tight">Contract Only</span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="space-y-4 min-h-[160px]">
                        {plan.features.map(f => (
                          <div key={f} className="flex items-center gap-3">
                            <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                              <Check className="h-3 w-3 text-emerald-500" />
                            </div>
                            <span className="text-sm font-bold opacity-80">{f}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        className={cn("w-full h-12 font-black uppercase text-xs tracking-widest", isActive && "bg-emerald-600 hover:bg-emerald-700")}
                        variant={plan.ctaVariant}
                        disabled={isActive || loading}
                        onClick={() => handleUpgrade(plan)}
                      >
                        {isActive ? "Authorized Profile" : plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Trust Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <TrustFact icon={Lock} title="Encrypted Ledger" sub="AES-256 Protocol" />
              <TrustFact icon={Server} title="99.9% Up-time" sub="Zero-Downtime Grid" />
              <TrustFact icon={Award} title="Certified Nodes" sub="WHO/ISO Standard" />
              <TrustFact icon={Shield} title="Data Privacy" sub="HIPAA Compliant" />
            </div>

            {/* Current Billing Summary */}
            <Card className="max-w-md mx-auto border-dashed border-2 bg-muted/20 border-border/50">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Active Provision</p>
                    <p className="text-xl font-black uppercase">{currentPlan} Protocol</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <CreditCard className="h-6 w-6" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 opacity-40" />
                  <span className="text-sm font-bold opacity-70">Next cycle: {userProfile?.next_billing_date ? new Date(userProfile.next_billing_date).toLocaleDateString() : 'N/A'}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-10 text-[9px] font-black uppercase tracking-widest border-border/50">Ledger History</Button>
                  <Button variant="outline" className="h-10 text-[9px] font-black uppercase tracking-widest border-border/50">Config Billing</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
        <DialogContent className="max-w-md bg-slate-950 text-white border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight">System Provisioning</DialogTitle>
            <DialogDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Upgrade your node to {selectedPlan?.name} scale</DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="p-6 bg-slate-900 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Target Plan</p>
                <p className="text-xl font-black uppercase">{selectedPlan?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black tracking-tighter">₹{isYearly ? selectedPlan?.yearlyPrice : selectedPlan?.monthlyPrice}</p>
                <p className="text-[9px] font-black opacity-30 uppercase">/ {isYearly ? 'Year' : 'Month'}</p>
              </div>
            </div>
            <p className="text-xs text-white/50 text-center px-4">By confirming, your facility will be authorized for the new supply chain protocols instantly. Billing will be settled in the next ledger cycle.</p>
          </div>
          <DialogFooter>
            <Button className="w-full h-12 font-black uppercase tracking-widest text-xs" onClick={confirmUpgrade} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Authorize Protocol Activation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TrustFact({ icon: Icon, title, sub }: any) {
  return (
    <div className="flex items-center gap-4 p-4 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100">
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest">{title}</p>
        <p className="text-[9px] font-bold opacity-60 uppercase">{sub}</p>
      </div>
    </div>
  )
}
