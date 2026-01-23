import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {
  Shield,
  UserCheck,
  FileCheck,
  Lock,
  Eye,
  Server,
  KeyRound,
  ShieldCheck,
  Building2,
  Pill,
  CheckCircle2,
  AlertTriangle,
  ClipboardCheck,
  History,
  Users,
  Database,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const roleAccess = [
  {
    role: "Medical Authority",
    icon: Shield,
    color: "bg-blue-600",
    description: "Full system access for government health officials with complete oversight capabilities.",
    permissions: [
      "View all facilities and inventory across the region",
      "Approve or reject new facility registrations",
      "Access comprehensive analytics and reports",
      "Configure system-wide settings and thresholds",
      "Activate Emergency Mode during shortages",
    ],
  },
  {
    role: "Hospital",
    icon: Building2,
    color: "bg-emerald-600",
    description: "Hospital-level inventory management with real-time stock tracking capabilities.",
    permissions: [
      "Manage own hospital medicine inventory",
      "Receive and respond to shortage alerts",
      "Update stock levels and expiry dates",
      "Generate facility-specific reports",
      "Request emergency supply transfers",
    ],
  },
  {
    role: "Pharmacy",
    icon: Pill,
    color: "bg-purple-600",
    description: "Pharmacy inventory and prescription medicine tracking with compliance monitoring.",
    permissions: [
      "Manage pharmacy medicine stock levels",
      "Track prescription medicine dispensing",
      "Update inventory data in real-time",
      "View local area shortage alerts",
      "Submit regulatory compliance reports",
    ],
  },
]

const verificationSteps = [
  {
    step: 1,
    title: "Registration Submission",
    description:
      "Healthcare facility submits registration with organization details, government license, and official documentation.",
    icon: FileCheck,
  },
  {
    step: 2,
    title: "Document Verification",
    description:
      "Our verification team validates the authenticity of the submitted license and organizational credentials.",
    icon: ClipboardCheck,
  },
  {
    step: 3,
    title: "Background Check",
    description:
      "Cross-reference with government healthcare databases to confirm facility registration and compliance status.",
    icon: Database,
  },
  {
    step: 4,
    title: "Account Activation",
    description:
      "Upon successful verification, the account is activated and the facility receives email confirmation with login details.",
    icon: CheckCircle2,
  },
]

const prescriptionRules = [
  {
    icon: FileCheck,
    title: "Prescription Tracking",
    description:
      "All prescription medicines are tracked with patient-anonymous identifiers for compliance monitoring and audit purposes.",
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
  },
  {
    icon: AlertTriangle,
    title: "Controlled Substance Monitoring",
    description:
      "Special tracking protocols for controlled substances with enhanced reporting requirements and regulatory oversight.",
    color: "text-amber-600",
    bgColor: "bg-amber-600/10",
  },
  {
    icon: UserCheck,
    title: "Dispensing Verification",
    description:
      "Multi-level verification for prescription dispensing to prevent unauthorized distribution and ensure patient safety.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-600/10",
  },
  {
    icon: Eye,
    title: "Complete Audit Trail",
    description:
      "Comprehensive audit trail maintained for all prescription-related activities to meet regulatory compliance standards.",
    color: "text-purple-600",
    bgColor: "bg-purple-600/10",
  },
]

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All data is encrypted using AES-256 encryption both in transit (TLS 1.3) and at rest.",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description: "Hosted on government-certified secure cloud infrastructure with SOC 2 Type II compliance.",
  },
  {
    icon: KeyRound,
    title: "Multi-Factor Authentication",
    description: "Optional MFA support for enhanced account security using TOTP or hardware security keys.",
  },
  {
    icon: ShieldCheck,
    title: "Regular Security Audits",
    description: "Quarterly security assessments and penetration testing by CERT-certified security firms.",
  },
]

const auditFeatures = [
  {
    icon: History,
    title: "Activity Logging",
    description:
      "Every action is logged with timestamps, user identification, and IP addresses for complete traceability.",
  },
  {
    icon: Users,
    title: "Access Monitoring",
    description: "Real-time monitoring of user access patterns with alerts for suspicious activities.",
  },
  {
    icon: ClipboardCheck,
    title: "Compliance Reports",
    description: "Automated generation of compliance reports for regulatory submissions and audits.",
  },
  {
    icon: Database,
    title: "Data Retention",
    description: "Secure data retention policies aligned with healthcare regulations and government mandates.",
  },
]

export default function SecurityPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-accent text-accent-foreground">Government Certified Platform</Badge>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent">
              <Shield className="h-10 w-10 text-accent-foreground" />
            </div>
            <h1 className="mb-4 text-balance text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
              Security & Compliance
            </h1>
            <p className="mx-auto max-w-2xl text-pretty text-lg text-primary-foreground/80">
              Built with enterprise-grade security and full regulatory compliance to protect sensitive healthcare data
              and ensure patient safety.
            </p>
          </div>
        </section>

        {/* Role-Based Access Control */}
        <section className="bg-background py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-4">
                Access Control
              </Badge>
              <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">Role-Based Access Control</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Different access levels ensure users only see what they need, maintaining data security, operational
                efficiency, and regulatory compliance.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {roleAccess.map((role) => (
                <Card key={role.role} className="border-border bg-card overflow-hidden">
                  <div className={`h-2 ${role.color}`} />
                  <CardHeader>
                    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${role.color}`}>
                      <role.icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl text-card-foreground">{role.role}</CardTitle>
                    <CardDescription className="text-sm">{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Permissions
                    </p>
                    <ul className="space-y-2">
                      {role.permissions.map((permission) => (
                        <li key={permission} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          <span>{permission}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* License Verification Flow */}
        <section className="bg-muted py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-4">
                Verification Process
              </Badge>
              <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">License Verification Process</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                A rigorous multi-step verification process ensures only authorized and licensed healthcare facilities
                can access the platform.
              </p>
            </div>

            <div className="mx-auto max-w-4xl">
              <div className="relative">
                {verificationSteps.map((step, index) => (
                  <div key={step.step} className="relative flex gap-6 pb-10 last:pb-0">
                    {/* Connector Line */}
                    {index < verificationSteps.length - 1 && (
                      <div className="absolute left-7 top-16 h-full w-0.5 bg-primary/30" />
                    )}

                    {/* Step Icon */}
                    <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
                      <step.icon className="h-6 w-6 text-primary-foreground" />
                    </div>

                    {/* Content Card */}
                    <Card className="flex-1">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-primary text-primary-foreground">Step {step.step}</Badge>
                          <CardTitle className="text-lg text-card-foreground">{step.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{step.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Prescription Safety Rules */}
        <section className="bg-background py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-4">
                Safety Protocols
              </Badge>
              <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">Prescription Safety Rules</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Strict protocols ensure prescription medicines are tracked and dispensed safely, meeting all regulatory
                requirements.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {prescriptionRules.map((rule) => (
                <Card key={rule.title} className="border-border bg-card transition-shadow hover:shadow-lg">
                  <CardHeader className="flex flex-row items-start gap-4">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${rule.bgColor}`}>
                      <rule.icon className={`h-7 w-7 ${rule.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-card-foreground">{rule.title}</CardTitle>
                      <CardDescription className="mt-2">{rule.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Data Security Highlights */}
        <section className="bg-primary py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <Badge className="mb-4 bg-accent text-accent-foreground">Data Protection</Badge>
              <h2 className="mb-4 text-2xl font-bold text-primary-foreground md:text-3xl">Data Security Highlights</h2>
              <p className="mx-auto max-w-2xl text-primary-foreground/80">
                Enterprise-grade security measures protect all healthcare data on our platform with industry-leading
                standards.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {securityFeatures.map((feature) => (
                <Card
                  key={feature.title}
                  className="border-primary-foreground/20 bg-primary-foreground/10 text-center backdrop-blur-sm"
                >
                  <CardHeader>
                    <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                      <feature.icon className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-lg text-primary-foreground">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-primary-foreground/80">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-4">
                Accountability
              </Badge>
              <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">Audit & Accountability</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Comprehensive audit capabilities ensure complete transparency and accountability for all platform
                activities.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {auditFeatures.map((feature) => (
                <Card key={feature.title} className="border-border bg-card text-center">
                  <CardHeader>
                    <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-base text-card-foreground">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance Badges */}
        <section className="bg-background py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-4">
                Certifications
              </Badge>
              <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">Compliance & Certifications</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Our platform meets all major healthcare and data protection compliance standards required by government
                regulations.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6">
              {[
                { name: "HIPAA Compliant", description: "Healthcare data privacy" },
                { name: "SOC 2 Type II", description: "Security controls" },
                { name: "ISO 27001", description: "Information security" },
                { name: "GDPR Ready", description: "Data protection" },
                { name: "FDA Registered", description: "Drug tracking" },
              ].map((cert) => (
                <Card
                  key={cert.name}
                  className="flex items-center gap-4 border-border bg-card px-6 py-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">{cert.name}</p>
                    <p className="text-xs text-muted-foreground">{cert.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
