"use client"

import { DigitalTrustNarrative } from "./digital-trust-narrative"
import { TrustScoreSimulator } from "./trust-score-simulator"
import { LiveFraudDetectionShowcase } from "./live-fraud-detection"
import { ImpactMetricsDashboard } from "./impact-metrics-dashboard"
import { WhyShurokkha } from "./why-shurokkha"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

/**
 * This is an example of how to integrate the new homepage components
 * into your app/page.tsx or create a dedicated /homepage route
 */

export function HomepageShowcase() {
  return (
    <div className="w-full">
      {/* Hero Section (Keep existing or replace with this) */}
      <section className="min-h-screen bg-linear-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl text-center space-y-6">
          <Badge variant="secondary" className="mx-auto">
            AI-Powered Transparent Charity
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter">
            Donate with Proof,
            <br />
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Not Just Faith
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See exactly where your donation goes. AI verifies every step. Fraud is caught before it causes harm.
            Real transparency. Real impact.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap pt-6">
            <Link href="/auth/login?role=donor">
              <Button size="lg">Start Donating</Button>
            </Link>
            <Link href="/crises">
              <Button size="lg" variant="outline">
                See Active Crises
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 1: The Digital Trust Story */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <DigitalTrustNarrative />
        </div>
      </section>

      {/* Section 2: Interactive Trust Score Demo */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <TrustScoreSimulator />
        </div>
      </section>

      {/* Section 3: Live Fraud Detection Showcase */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <LiveFraudDetectionShowcase />
        </div>
      </section>

      {/* Section 4: Impact Metrics Dashboard */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <ImpactMetricsDashboard />
        </div>
      </section>

      {/* Section 5: Why Shurokkha Comparison */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <WhyShurokkha />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-linear-to-r from-primary/10 to-secondary/10">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to Make a Difference?</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of donors who are transforming charitable aid through transparency and verified impact.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/auth/login?role=donor">
              <Button size="lg">Donate Now</Button>
            </Link>
            <Link href="/auth/login?role=provider">
              <Button size="lg" variant="outline">
                Become a Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomepageShowcase
