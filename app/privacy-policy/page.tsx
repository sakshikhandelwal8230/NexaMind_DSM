import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
            <p className="mt-2 text-muted-foreground">Last updated: January 23, 2026</p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-8 text-foreground">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold">1. Introduction</h2>
              <p className="mt-4 text-foreground/80">
                The Drug Monitor System ("DMS", "we", "our", or "us") is committed to protecting your privacy. This
                Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
                Service, including our website and application. Please read this Privacy Policy carefully. If you do not
                agree with our policies and practices, please do not use our Service.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
              <h3 className="mt-4 text-xl font-semibold">2.1 Information You Provide Directly</h3>
              <ul className="mt-2 list-inside list-disc space-y-2 text-foreground/80">
                <li>Facility name, address, and contact information</li>
                <li>License number and certification documents</li>
                <li>Email address and password</li>
                <li>User account information and profile details</li>
                <li>Inventory data and medicine information</li>
                <li>Emergency contact information</li>
              </ul>

              <h3 className="mt-6 text-xl font-semibold">2.2 Automatically Collected Information</h3>
              <ul className="mt-2 list-inside list-disc space-y-2 text-foreground/80">
                <li>IP address and device information</li>
                <li>Browser type and operating system</li>
                <li>Pages visited and time spent on DMS</li>
                <li>Referral sources</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            {/* Use of Information */}
            <section>
              <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
              <p className="mt-4 text-foreground/80">
                We use the information we collect for the following purposes:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-2 text-foreground/80">
                <li>Account creation and management</li>
                <li>Providing and improving our Service</li>
                <li>Processing transactions and sending notifications</li>
                <li>Verifying your facility's credentials and compliance</li>
                <li>Detecting and preventing fraudulent activity</li>
                <li>Compliance with legal and regulatory requirements</li>
                <li>Providing customer support</li>
                <li>Sending marketing communications (with your consent)</li>
                <li>Conducting analytics and system improvements</li>
              </ul>
            </section>

            {/* Data Protection and Security */}
            <section>
              <h2 className="text-2xl font-semibold">4. Data Protection and Security</h2>
              <p className="mt-4 text-foreground/80">
                DMS implements comprehensive security measures to protect your data, including:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-2 text-foreground/80">
                <li>Encryption of data in transit using SSL/TLS protocols</li>
                <li>Encryption of sensitive data at rest</li>
                <li>Role-based access control and authentication</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Firewalls and intrusion detection systems</li>
                <li>Compliance with healthcare data protection standards</li>
              </ul>
              <p className="mt-4 text-foreground/80">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we
                strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            {/* HIPAA Compliance */}
            <section>
              <h2 className="text-2xl font-semibold">5. HIPAA Compliance</h2>
              <p className="mt-4 text-foreground/80">
                DMS is designed to comply with the Health Insurance Portability and Accountability Act (HIPAA) as
                applicable. We implement administrative, physical, and technical safeguards to protect Protected Health
                Information (PHI). Access to PHI is restricted to authorized personnel on a need-to-know basis.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold">6. Data Retention</h2>
              <p className="mt-4 text-foreground/80">
                We retain your information for as long as necessary to:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-2 text-foreground/80">
                <li>Maintain your account and provide services</li>
                <li>Comply with legal and regulatory obligations</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Conduct audits and investigations</li>
              </ul>
              <p className="mt-4 text-foreground/80">
                You may request deletion of your account and associated data, subject to legal requirements and
                regulatory holds.
              </p>
            </section>

            {/* Sharing of Information */}
            <section>
              <h2 className="text-2xl font-semibold">7. Sharing of Information</h2>
              <p className="mt-4 text-foreground/80">
                We do not sell, trade, or rent your personal information to third parties. We may share information:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-2 text-foreground/80">
                <li>With service providers and vendors who assist in operating DMS</li>
                <li>With law enforcement and regulatory authorities when required by law</li>
                <li>To protect against fraud and illegal activity</li>
                <li>To enforce our Terms of Service and other agreements</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            {/* Third-Party Links */}
            <section>
              <h2 className="text-2xl font-semibold">8. Third-Party Links and Services</h2>
              <p className="mt-4 text-foreground/80">
                DMS may contain links to third-party websites and services. We are not responsible for the privacy
                practices of these third parties. We encourage you to review their privacy policies before providing
                personal information.
              </p>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className="text-2xl font-semibold">9. Cookies and Tracking Technologies</h2>
              <p className="mt-4 text-foreground/80">
                We use cookies and similar technologies to enhance your experience, remember preferences, and analyze
                usage patterns. You can control cookie settings through your browser. However, disabling cookies may
                affect some functionality of DMS.
              </p>
            </section>

            {/* User Rights */}
            <section>
              <h2 className="text-2xl font-semibold">10. Your Rights and Choices</h2>
              <p className="mt-4 text-foreground/80">
                Depending on your jurisdiction, you may have the following rights:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-2 text-foreground/80">
                <li>Right to access your personal information</li>
                <li>Right to correct inaccurate data</li>
                <li>Right to request deletion of your data</li>
                <li>Right to restrict processing of your information</li>
                <li>Right to data portability</li>
                <li>Right to opt-out of marketing communications</li>
              </ul>
              <p className="mt-4 text-foreground/80">
                To exercise any of these rights, please contact us using the information provided in Section 14.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold">11. Children's Privacy</h2>
              <p className="mt-4 text-foreground/80">
                DMS is not intended for use by individuals under 18 years old. We do not knowingly collect personal
                information from children. If we become aware that we have collected information from a child, we will
                take steps to delete such information promptly.
              </p>
            </section>

            {/* International Data Transfers */}
            <section>
              <h2 className="text-2xl font-semibold">12. International Data Transfers</h2>
              <p className="mt-4 text-foreground/80">
                Your information may be transferred to, stored in, and processed in countries other than your country of
                residence. These countries may have data protection laws that differ from your home country. By using
                DMS, you consent to the transfer of your information to countries outside your country of residence.
              </p>
            </section>

            {/* Updates to This Policy */}
            <section>
              <h2 className="text-2xl font-semibold">13. Updates to This Privacy Policy</h2>
              <p className="mt-4 text-foreground/80">
                DMS may update this Privacy Policy from time to time. We will notify you of significant changes via email
                or through the Service. Your continued use of DMS after modifications constitutes acceptance of the
                updated Privacy Policy.
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl font-semibold">14. Contact Us</h2>
              <p className="mt-4 text-foreground/80">
                If you have questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="mt-4 space-y-2 text-foreground/80">
                <p>Email: privacy@drugmonitorsystem.com</p>
                <p>Address: Healthcare Compliance Center, Medical District, Your City</p>
                <p>Phone: +1 (800) MONITOR-1</p>
              </div>
            </section>

            {/* Data Protection Officer */}
            <section>
              <h2 className="text-2xl font-semibold">15. Data Protection Officer</h2>
              <p className="mt-4 text-foreground/80">
                For privacy-related inquiries and to exercise your data rights, you may also contact our Data Protection
                Officer:
              </p>
              <div className="mt-4 space-y-2 text-foreground/80">
                <p>Email: dpo@drugmonitorsystem.com</p>
                <p>Office: Data Protection Office, Healthcare Compliance Center</p>
              </div>
            </section>
          </div>

          {/* Back Button */}
          <div className="mt-12 flex justify-center">
            <Link href="/signup">
              <Button>Back to Sign Up</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
