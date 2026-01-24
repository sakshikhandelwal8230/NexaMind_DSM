"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "sonner"
import {
  Check,
  X,
  Crown,
  Zap,
  Building2,
  Shield,
  Clock,
  HeadphonesIcon,
  FileText,
  CreditCard,
  Calendar,
  Sparkles,
  Lock,
  Server,
  Award,
  Users,
  Settings,
  Mail,
  Phone,
  AlertTriangle,
  RefreshCw,
  XCircle,
} from "lucide-react"

// Types
interface PlanFeature {
  name: string
  starter: boolean | string
  pro: boolean | string
  enterprise: boolean | string
}

interface Plan {
  id: string
  name: string
  description: string
  monthlyPrice: number | null
  yearlyPrice: number | null
  popular?: boolean
  features: string[]
  cta: string
  ctaVariant: "default" | "outline" | "secondary"
}

// Plan Data
const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small facilities getting started",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "1 Facility",
      "Up to 500 medicines",
      "Basic alerts",
      "Email support",
      "7-day data retention",
      "Basic reports",
    ],
    cta: "Start Free",
    ctaVariant: "outline",
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing facilities that need more power",
    monthlyPrice: 499,
    yearlyPrice: 3999,
    popular: true,
    features: [
      "Up to 5 Facilities",
      "Unlimited medicines",
      "Advanced alerts & AI insights",
      "Priority support",
      "1-year data retention",
      "Advanced analytics",
      "Inter-facility transfers",
      "Custom reports",
      "API access",
    ],
    cta: "Upgrade to Pro",
    ctaVariant: "default",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with custom needs",
    monthlyPrice: null,
    yearlyPrice: null,
    features: [
      "Unlimited Facilities",
      "Unlimited medicines",
      "Custom AI models",
      "24/7 dedicated support",
      "Unlimited data retention",
      "White-label options",
      "Custom integrations",
      "SLA guarantee",
      "On-premise deployment",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    ctaVariant: "secondary",
  },
]

// Comparison Features
const comparisonFeatures: PlanFeature[] = [
  { name: "Number of Facilities", starter: "1", pro: "Up to 5", enterprise: "Unlimited" },
  { name: "Medicine Tracking", starter: "500", pro: "Unlimited", enterprise: "Unlimited" },
  { name: "Real-time Alerts", starter: true, pro: true, enterprise: true },
  { name: "AI-powered Insights", starter: false, pro: true, enterprise: true },
  { name: "Inter-facility Transfers", starter: false, pro: true, enterprise: true },
  { name: "Custom Reports", starter: false, pro: true, enterprise: true },
  { name: "API Access", starter: false, pro: true, enterprise: true },
  { name: "Data Retention", starter: "7 days", pro: "1 year", enterprise: "Unlimited" },
  { name: "Support", starter: "Email", pro: "Priority", enterprise: "24/7 Dedicated" },
  { name: "SLA Guarantee", starter: false, pro: false, enterprise: true },
  { name: "White-label Options", starter: false, pro: false, enterprise: true },
  { name: "On-premise Deployment", starter: false, pro: false, enterprise: true },
]

// FAQ Data
const faqItems = [
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period. No questions asked.",
  },
  {
    question: "What is your refund policy?",
    answer: "We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied within the first 14 days, contact us for a full refund.",
  },
  {
    question: "How does billing work?",
    answer: "You'll be billed at the start of each billing cycle (monthly or yearly). Yearly plans are billed once per year with a 20% discount.",
  },
  {
    question: "Is my data secure and private?",
    answer: "Absolutely. We use industry-standard encryption (AES-256) and comply with healthcare data regulations. Your data is never shared with third parties.",
  },
  {
    question: "Can I manage multiple facilities?",
    answer: "Yes! Pro plans support up to 5 facilities, and Enterprise plans offer unlimited facilities with centralized management.",
  },
  {
    question: "Do you provide GST invoices?",
    answer: "Yes, we provide GST-compliant invoices for all paid subscriptions. You can download them from your billing dashboard.",
  },
  {
    question: "What kind of support do you offer?",
    answer: "Starter plans get email support, Pro plans get priority support with faster response times, and Enterprise plans get 24/7 dedicated support with a dedicated account manager.",
  },
  {
    question: "Is there a free trial for Pro features?",
    answer: "Yes! You can try Pro features free for 14 days. No credit card required. Students and demo accounts get extended access.",
  },
]

// Mock user state
const mockUserState = {
  currentPlan: "Pro" as "Starter" | "Pro" | "Enterprise",
  nextBillingDate: "2026-02-24",
  email: "user@facility.com",
}

// Pricing Card Component
function PricingCard({
  plan,
  isYearly,
  currentPlan,
  onUpgrade,
}: {
  plan: Plan
  isYearly: boolean
  currentPlan: string
  onUpgrade: (plan: Plan) => void
}) {
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
  const isCurrentPlan = currentPlan.toLowerCase() === plan.id

  return (
    <Card
      className={`relative flex flex-col ${
        plan.popular
          ? "border-2 border-primary shadow-lg scale-105"
          : "border-border"
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-1">
            <Crown className="mr-1 h-3 w-3" /> Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pt-8">
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription className="text-sm">{plan.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="text-center mb-6">
          {price !== null ? (
            <>
              <span className="text-4xl font-bold">₹{price}</span>
              <span className="text-muted-foreground">/{isYearly ? "year" : "month"}</span>
              {isYearly && plan.monthlyPrice && plan.monthlyPrice > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  Save ₹{(plan.monthlyPrice * 12) - (plan.yearlyPrice || 0)} per year
                </p>
              )}
            </>
          ) : (
            <span className="text-3xl font-bold">Custom Pricing</span>
          )}
        </div>

        <ul className="space-y-3 flex-1">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          {isCurrentPlan ? (
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          ) : (
            <Button
              variant={plan.ctaVariant}
              className="w-full"
              onClick={() => onUpgrade(plan)}
            >
              {plan.cta}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Feature Row Component for Comparison Table
function FeatureRow({ feature }: { feature: PlanFeature }) {
  const renderValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-green-500 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-muted-foreground/40 mx-auto" />
      )
    }
    return <span className="text-sm">{value}</span>
  }

  return (
    <tr className="border-b border-border">
      <td className="py-3 px-4 text-sm font-medium">{feature.name}</td>
      <td className="py-3 px-4 text-center">{renderValue(feature.starter)}</td>
      <td className="py-3 px-4 text-center bg-primary/5">{renderValue(feature.pro)}</td>
      <td className="py-3 px-4 text-center">{renderValue(feature.enterprise)}</td>
    </tr>
  )
}

// Trust Badge Component
function TrustBadge({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export default function SubscriptionPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false)
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [localSearch, setLocalSearch] = useState("")
  const [userState, setUserState] = useState(mockUserState)

  const handleUpgrade = (plan: Plan) => {
    if (plan.id === "enterprise") {
      toast.success("Our sales team will contact you shortly!", {
        description: "We'll reach out within 24 hours.",
      })
      return
    }
    setSelectedPlan(plan)
    setIsUpgradeDialogOpen(true)
  }

  const confirmUpgrade = () => {
    if (selectedPlan) {
      // Update user plan state
      setUserState({ 
        ...userState, 
        currentPlan: selectedPlan.name as "Starter" | "Pro" | "Enterprise" 
      })
      toast.success(`Successfully upgraded to ${selectedPlan.name}!`, {
        description: "Your new features are now active.",
      })
      setIsUpgradeDialogOpen(false)
      setSelectedPlan(null)
    }
  }

  const handleExportInvoice = () => {
    toast.success("Invoice downloaded!", {
      description: "Check your downloads folder for the PDF invoice.",
    })
  }

  const handleUpdateBillingInfo = () => {
    toast.success("Billing information updated!", {
      description: "Your billing details have been saved.",
    })
    setIsManageDialogOpen(false)
  }

  const handleUpdatePaymentMethod = () => {
    toast.success("Payment method updated!", {
      description: "Your new payment method is now active.",
    })
    setIsManageDialogOpen(false)
  }

  const handleCancelSubscription = () => {
    toast.success("Subscription cancelled", {
      description: "Your subscription will remain active until the end of your billing period.",
    })
    setIsManageDialogOpen(false)
  }

  const handleContactSupport = () => {
    toast.success("Support ticket created!", {
      description: "Our team will reach out within 24 hours.",
    })
    setIsManageDialogOpen(false)
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          title="Subscription"
          subtitle="Manage your plan and billing"
          searchValue={localSearch}
          onSearchChange={setLocalSearch}
          hideSearch
        />
        <main className="flex-1 overflow-y-auto">
          {/* Hero Section */}
          <div className="bg-gradient-to-b from-primary/5 to-background px-6 py-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Choose a plan that fits your facility
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Scale your medicine supply management with the right tools. All plans include core features.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <span className={`text-sm ${!isYearly ? "font-medium" : "text-muted-foreground"}`}>
                Monthly
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
              />
              <span className={`text-sm ${isYearly ? "font-medium" : "text-muted-foreground"}`}>
                Yearly
              </span>
              {isYearly && (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                  Save 20%
                </Badge>
              )}
            </div>
          </div>

          <div className="px-6 py-8 max-w-7xl mx-auto">
            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  isYearly={isYearly}
                  currentPlan={userState.currentPlan}
                  onUpgrade={handleUpgrade}
                />
              ))}
            </div>

            {/* Trust Strip */}
            <div className="mb-16">
              <Card>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border">
                    <TrustBadge
                      icon={Lock}
                      title="Bank-grade Security"
                      description="AES-256 encryption"
                    />
                    <TrustBadge
                      icon={Server}
                      title="99.9% Uptime"
                      description="Reliable infrastructure"
                    />
                    <TrustBadge
                      icon={Award}
                      title="Compliance"
                      description="Healthcare standards"
                    />
                    <TrustBadge
                      icon={HeadphonesIcon}
                      title="Expert Support"
                      description="Always here to help"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Plan Card */}
            <div className="mb-8 max-w-md mx-auto">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Current Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{userState.currentPlan}</span>
                    <Badge variant="outline">{userState.currentPlan === "Starter" ? "Free" : "Active"}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Next billing: {userState.nextBillingDate}</span>
                  </div>
                  <Separator />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={handleExportInvoice}>
                      <FileText className="mr-1 h-3 w-3" />
                      Invoice
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => setIsManageDialogOpen(true)}>
                      <Settings className="mr-1 h-3 w-3" />
                      Manage
                    </Button>
                  </div>
                  {userState.currentPlan !== "Starter" && (
                    <>
                      <Separator />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setIsCancelDialogOpen(true)}
                      >
                        <XCircle className="mr-1 h-3 w-3" />
                        Cancel Subscription
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Comparison Table */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-center mb-2">Compare Plans</h2>
              <p className="text-muted-foreground text-center mb-8">
                See which plan is right for your facility
              </p>
              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="py-4 px-4 text-left font-semibold">Features</th>
                        <th className="py-4 px-4 text-center font-semibold">Starter</th>
                        <th className="py-4 px-4 text-center font-semibold bg-primary/10">
                          <div className="flex items-center justify-center gap-1">
                            Pro <Crown className="h-4 w-4 text-primary" />
                          </div>
                        </th>
                        <th className="py-4 px-4 text-center font-semibold">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonFeatures.map((feature, index) => (
                        <FeatureRow key={index} feature={feature} />
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-center mb-2">Frequently Asked Questions</h2>
              <p className="text-muted-foreground text-center mb-8">
                Everything you need to know about our plans
              </p>
              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Upgrade Confirmation Dialog */}
      <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Upgrade to {selectedPlan?.name}</DialogTitle>
            <DialogDescription>
              Review your upgrade details before confirming.
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{selectedPlan.name} Plan</p>
                  <p className="text-sm text-muted-foreground">
                    {isYearly ? "Billed yearly" : "Billed monthly"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    ₹{isYearly ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    /{isYearly ? "year" : "month"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">What you'll get:</p>
                <ul className="space-y-1">
                  {selectedPlan.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                  {selectedPlan.features.length > 4 && (
                    <li className="text-sm text-muted-foreground">
                      + {selectedPlan.features.length - 4} more features
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpgradeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmUpgrade}>
              <CreditCard className="mr-2 h-4 w-4" />
              Confirm Upgrade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Subscription Dialog */}
      <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Manage Subscription
            </DialogTitle>
            <DialogDescription>
              Update your billing information and subscription settings.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Current Plan Info */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">{userState.currentPlan} Plan</p>
                <p className="text-sm text-muted-foreground">
                  {userState.currentPlan === "Starter" ? "Free Forever" : "Renews on " + userState.nextBillingDate}
                </p>
              </div>
              <Badge variant="outline">
                {userState.currentPlan === "Starter" ? "Free" : "Active"}
              </Badge>
            </div>

            {/* Management Options */}
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-3"
                onClick={handleUpdateBillingInfo}
              >
                <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium">Update Billing Information</p>
                  <p className="text-xs text-muted-foreground">Change email, address, or GST details</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto py-3"
                onClick={handleUpdatePaymentMethod}
              >
                <CreditCard className="mr-3 h-4 w-4 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium">Update Payment Method</p>
                  <p className="text-xs text-muted-foreground">Add or change card, UPI, or bank account</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto py-3"
                onClick={handleContactSupport}
              >
                <Phone className="mr-3 h-4 w-4 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium">Contact Support</p>
                  <p className="text-xs text-muted-foreground">Get help with billing or subscription issues</p>
                </div>
              </Button>

              <Separator className="my-3" />

              {userState.currentPlan !== "Starter" && (
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-3 border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleCancelSubscription}
                >
                  <AlertTriangle className="mr-3 h-4 w-4 text-destructive" />
                  <div className="text-left">
                    <p className="font-medium text-destructive">Cancel Subscription</p>
                    <p className="text-xs text-muted-foreground">Downgrade to Starter plan at end of billing cycle</p>
                  </div>
                </Button>
              )}

              {userState.currentPlan === "Starter" && (
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 text-sm">
                    <RefreshCw className="h-4 w-4 text-primary" />
                    <span className="font-medium">Upgrade for more features</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get unlimited medicines, AI insights, and priority support with Pro.
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManageDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Cancel Subscription
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <p className="font-medium text-sm">What happens when you cancel:</p>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  Your subscription will remain active until {userState.nextBillingDate}
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  You'll be downgraded to the Starter (Free) plan
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  You'll lose access to Pro features like AI insights, unlimited medicines, and priority support
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  Data beyond 7 days will be archived
                </li>
              </ul>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">Having issues?</p>
              <p className="text-xs text-muted-foreground mt-1">
                Contact our support team before cancelling. We may be able to help resolve any problems or offer a discount.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setIsCancelDialogOpen(false)
                  toast.success("Support ticket created!", {
                    description: "Our team will reach out within 24 hours.",
                  })
                }}
              >
                <HeadphonesIcon className="mr-2 h-3 w-3" />
                Contact Support Instead
              </Button>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setIsCancelDialogOpen(false)
                setUserState({ ...userState, currentPlan: "Starter" })
                toast.success("Subscription cancelled", {
                  description: `Your subscription has been cancelled. You are now on the Starter plan.`,
                })
              }}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
