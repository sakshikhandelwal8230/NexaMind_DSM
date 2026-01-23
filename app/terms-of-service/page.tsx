import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-foreground">Terms of Service</h1>
            <p className="mt-2 text-muted-foreground">Last updated: January 23, 2026</p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-8 text-foreground">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold">1. Introduction</h2>
              <p className="mt-4 text-foreground/80">
                Welcome to the Drug Monitor System (DMS). These Terms of Service ("Terms") govern your access to and use
                of the DMS platform, website, and services (collectively, the "Service"). By accessing or using DMS, you
                agree to be bound by these Terms. If you do not agree to any part of these Terms, please do not use the
                Service.
              </p>
            </section>

            {/* User Eligibility */}
            <section>
              <h2 className="text-2xl font-semibold">2. User Eligibility</h2>
              <p className="mt-4 text-foreground/80">
                To use DMS, you must:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-2 text-foreground/80">
                <li>Be at least 18 years old</li>
                <li>Be a licensed healthcare facility, medical authority, hospital, or pharmacy</li>
                <li>Have proper legal authorization to operate in your jurisdiction</li>
                <li>Provide accurate and complete information during registration</li>
              </ul>
            </section>

            {/* Account Registration */}
            <section>
              <h2 className="text-2xl font-semibold">3. Account Registration</h2>
              <p className="mt-4 text-foreground/80">
                When you create an account, you agree to:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-2 text-foreground/80">
                <li>Provide truthful and accurate information</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of unauthorized access or suspicious activity</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            {/* License Verification */}
            <section>
              <h2 className="text-2xl font-semibold">4. License Verification</h2>
              <p className="mt-4 text-foreground/80">
                DMS reserves the right to verify your facility's license and credentials. We may:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-2 text-foreground/80">
                <li>Request additional documentation for verification</li>
                <li>Conduct background checks and compliance audits</li>
                <li>Suspend or terminate accounts that fail verification</li>
                <li>Reject registrations for facilities with compliance violations</li>
              </ul>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="text-2xl font-semibold">5. Acceptable Use Policy</h2>
              <p className="mt-4 text-foreground/80">
                You agree not to use DMS for any unlawful or prohibited purposes, including but not limited to:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-2 text-foreground/80">
                <li>Illegal drug distribution or trafficking</li>
                <li>Falsifying inventory records or medicine data</li>
                <li>Unauthorized access to other users' accounts</li>
                <li>Interfering with system functionality or security</li>
                <li>Violating HIPAA, GDPR, or other healthcare privacy laws</li>
                <li>Harassing or threatening other users</li>
                <li>Uploading malware or harmful code</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold">6. Intellectual Property Rights</h2>
              <p className="mt-4 text-foreground/80">
                All content, features, and functionality of DMS are owned by DMS, its licensors, or other providers of
                such material and are protected by international copyright, trademark, and other intellectual property
                laws. You are granted a limited, non-exclusive, non-transferable license to use DMS for lawful purposes
                only.
              </p>
            </section>

            {/* Data and Privacy */}
            <section>
              <h2 className="text-2xl font-semibold">7. Data and Privacy</h2>
              <p className="mt-4 text-foreground/80">
                Your use of DMS is also governed by our Privacy Policy. Please review our Privacy Policy to understand
                our practices regarding data collection, usage, and protection. You consent to the collection and use of
                your information as outlined in the Privacy Policy.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold">8. Limitation of Liability</h2>
              <p className="mt-4 text-foreground/80">
                To the fullest extent permitted by law, DMS and its affiliates shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages, including loss of profits, data, or use, even
                if advised of the possibility of such damages. Our total liability for any claim shall not exceed the
                amount paid by you, if any, for accessing DMS.
              </p>
            </section>

            {/* Disclaimer of Warranties */}
            <section>
              <h2 className="text-2xl font-semibold">9. Disclaimer of Warranties</h2>
              <p className="mt-4 text-foreground/80">
                DMS is provided "AS IS" without warranty of any kind, express or implied, including but not limited to
                warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant
                that DMS will be error-free, uninterrupted, or secure.
              </p>
            </section>

            {/* Third-Party Content */}
            <section>
              <h2 className="text-2xl font-semibold">10. Third-Party Content</h2>
              <p className="mt-4 text-foreground/80">
                DMS may include links to third-party websites or services. We are not responsible for the content,
                accuracy, or practices of third-party sites. Your use of third-party services is at your own risk and
                subject to their terms and policies.
              </p>
            </section>

            {/* Modification of Terms */}
            <section>
              <h2 className="text-2xl font-semibold">11. Modification of Terms</h2>
              <p className="mt-4 text-foreground/80">
                DMS reserves the right to modify these Terms at any time. We will notify you of significant changes via
                email or through the Service. Your continued use of DMS after such modifications constitutes acceptance
                of the updated Terms.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-semibold">12. Termination</h2>
              <p className="mt-4 text-foreground/80">
                DMS may suspend or terminate your account at any time if:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-2 text-foreground/80">
                <li>You violate these Terms</li>
                <li>Your facility loses its operational license</li>
                <li>You engage in unlawful activities</li>
                <li>We receive complaints about your account</li>
              </ul>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold">13. Governing Law</h2>
              <p className="mt-4 text-foreground/80">
                These Terms are governed by and construed in accordance with the laws of the jurisdiction in which DMS
                is operated, without regard to its conflict of law provisions. You agree to submit to the exclusive
                jurisdiction of the courts located in that jurisdiction.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold">14. Contact Us</h2>
              <p className="mt-4 text-foreground/80">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 space-y-2 text-foreground/80">
                <p>Email: support@drugmonitorsystem.com</p>
                <p>Address: Healthcare Compliance Center, Medical District, Your City</p>
                <p>Phone: +1 (800) MONITOR-1</p>
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
