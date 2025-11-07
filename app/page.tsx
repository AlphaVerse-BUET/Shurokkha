"use client"

import { useAppStore } from "@/store/app-store"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Shield, Zap, TrendingUp, Users, Globe } from "lucide-react"
import { DigitalTrustNarrative } from "@/components/homepage/digital-trust-narrative"
import { TrustScoreSimulator } from "@/components/homepage/trust-score-simulator"
import { LiveFraudDetectionShowcase } from "@/components/homepage/live-fraud-detection"
import { ImpactMetricsDashboard } from "@/components/homepage/impact-metrics-dashboard"
import { WhyShurokkha } from "@/components/homepage/why-shurokkha"
import { useCurrency } from "@/contexts/currency-context"

export default function Home() {
  const { isAuthenticated } = useAppStore()
  const { formatAbbreviated } = useCurrency()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 w-full">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-16 md:py-20">
        <div className="text-center space-y-4 md:space-y-6 mb-12 md:mb-16">
          <Badge variant="secondary" className="inline-flex mb-2 md:mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Transparent Donation Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Donate with Confidence.
            <br />
            <span className="text-primary">Track with Precision.</span>
            <br />
            Impact with Certainty.
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Shurokkha uses triple-layer AI verification to connect donors with verified providers, ensuring every taka
            reaches genuine crisis-affected people in Bangladesh with complete transparency.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-12 md:mb-20">
          <Link href="/auth/login?role=donor" className="group">
            <Card className="p-4 md:p-6 hover:shadow-xl hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary h-full">
              <div className="text-3xl md:text-4xl mb-3">💰</div>
              <h3 className="font-bold text-lg md:text-xl mb-2 group-hover:text-primary transition">Donate Now</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Make transparent impact on crises with AI tracking</p>
            </Card>
          </Link>
          <Link href="/auth/login?role=provider" className="group">
            <Card className="p-4 md:p-6 hover:shadow-xl hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary h-full">
              <div className="text-3xl md:text-4xl mb-3">🏢</div>
              <h3 className="font-bold text-lg md:text-xl mb-2 group-hover:text-primary transition">Join as Provider</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Distribute verified aid with complete accountability</p>
            </Card>
          </Link>
          <Link href="/auth/login?role=beneficiary" className="group">
            <Card className="p-4 md:p-6 hover:shadow-xl hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary h-full">
              <div className="text-3xl md:text-4xl mb-3">🙏</div>
              <h3 className="font-bold text-lg md:text-xl mb-2 group-hover:text-primary transition">Get Help</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Apply for crisis relief with dignity and privacy</p>
            </Card>
          </Link>
          <Link href="/crises" className="group">
            <Card className="p-4 md:p-6 hover:shadow-xl hover:scale-105 transition-all cursor-pointer border-2 hover:border-primary h-full">
              <div className="text-3xl md:text-4xl mb-3">🆘</div>
              <h3 className="font-bold text-lg md:text-xl mb-2 group-hover:text-primary transition">View Crises</h3>
              <p className="text-xs md:text-sm text-muted-foreground">See active crises detected by AI</p>
            </Card>
          </Link>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-12 md:mb-20">
          <Card className="p-6 md:p-8 bg-linear-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200">
            <Shield className="w-8 md:w-12 h-8 md:h-12 text-green-600 mb-3 md:mb-4" />
            <h3 className="font-bold text-lg md:text-2xl mb-2 md:mb-3">100% Transparency</h3>
            <p className="text-xs md:text-base text-muted-foreground leading-relaxed">
              Track every taka from donation to distribution with AI verification, GPS tracking, and photo proof at
              every step.
            </p>
          </Card>
          <Card className="p-6 md:p-8 bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
            <Sparkles className="w-8 md:w-12 h-8 md:h-12 text-blue-600 mb-3 md:mb-4" />
            <h3 className="font-bold text-lg md:text-2xl mb-2 md:mb-3">&lt;1% Fraud Rate</h3>
            <p className="text-xs md:text-base text-muted-foreground leading-relaxed">
              Triple-layer AI verification eliminates fake claims through document verification, face matching, and
              fraud pattern detection.
            </p>
          </Card>
          <Card className="p-6 md:p-8 bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200">
            <Zap className="w-8 md:w-12 h-8 md:h-12 text-purple-600 mb-3 md:mb-4" />
            <h3 className="font-bold text-lg md:text-2xl mb-2 md:mb-3">5-Day Delivery</h3>
            <p className="text-xs md:text-base text-muted-foreground leading-relaxed">
              Crisis detection to aid delivery in 5-7 days average versus 45 days traditional charity distribution.
            </p>
          </Card>
        </div>

        {/* Stats Section */}
        <Card className="p-6 md:p-12 bg-linear-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20 mb-12 md:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
            <div>
              <TrendingUp className="w-6 md:w-8 h-6 md:h-8 mx-auto mb-2 md:mb-3 text-primary" />
              <div className="text-2xl md:text-4xl font-bold text-primary mb-1 md:mb-2">{formatAbbreviated(500000000)}</div>
              <div className="text-xs md:text-base text-muted-foreground">Distributed Transparently</div>
            </div>
            <div>
              <Users className="w-6 md:w-8 h-6 md:h-8 mx-auto mb-2 md:mb-3 text-secondary" />
              <div className="text-2xl md:text-4xl font-bold text-secondary mb-1 md:mb-2">50,000+</div>
              <div className="text-xs md:text-base text-muted-foreground">Families Helped</div>
            </div>
            <div>
              <Globe className="w-6 md:w-8 h-6 md:h-8 mx-auto mb-2 md:mb-3 text-accent" />
              <div className="text-2xl md:text-4xl font-bold text-accent mb-1 md:mb-2">64/64</div>
              <div className="text-xs md:text-base text-muted-foreground">Districts Covered</div>
            </div>
          </div>
        </Card>

        {/* How It Works */}
        <div className="mb-12 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">How Shurokkha Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                step: "1",
                title: "AI Detects Crisis",
                desc: "Satellite imagery + news monitoring identifies disasters in real-time",
              },
              {
                step: "2",
                title: "Donors Contribute",
                desc: "Choose crisis, set preferences, funds locked in escrow with money-back guarantee",
              },
              {
                step: "3",
                title: "Smart Matching",
                desc: "AI matches donors with verified providers based on trust score and preferences",
              },
              {
                step: "4",
                title: "Verified Distribution",
                desc: "GPS-tagged photos, face matching, beneficiary SMS confirmation, complete transparency",
              },
            ].map((item) => (
              <Card key={item.step} className="p-4 md:p-6 relative overflow-hidden group hover:shadow-lg transition">
                <div className="absolute top-0 right-0 text-6xl md:text-8xl font-bold text-primary/5 group-hover:text-primary/10 transition">
                  {item.step}
                </div>
                <div className="relative">
                  <Badge className="mb-2 md:mb-3 text-xs md:text-sm">Step {item.step}</Badge>
                  <h3 className="font-bold text-sm md:text-lg mb-2 md:mb-3">{item.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Championship Components Sections */}
      <section className="w-full py-12 md:py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <DigitalTrustNarrative />
        </div>
      </section>

      <section className="w-full py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <TrustScoreSimulator />
        </div>
      </section>

      <section className="w-full py-12 md:py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <LiveFraudDetectionShowcase />
        </div>
      </section>

      <section className="w-full py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <ImpactMetricsDashboard />
        </div>
      </section>

      <section className="w-full py-12 md:py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <WhyShurokkha />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-12 md:py-20">
        <Card className="p-6 md:p-12 bg-linear-to-r from-primary to-secondary text-primary-foreground">
          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-4xl font-bold">Ready to Make a Difference?</h2>
            <p className="text-base md:text-xl opacity-90">Join thousands of donors creating transparent impact</p>
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
              <Link href="/auth/login?role=donor">
                <Button size="lg" variant="secondary" className="w-full md:w-auto text-base md:text-lg px-6 md:px-8">
                  Start Donating
                </Button>
              </Link>
              <Link href="/crises">
                <Button size="lg" variant="outline" className="w-full md:w-auto text-base md:text-lg px-6 md:px-8 bg-white/10 hover:bg-white/20">
                  View Active Crises
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </main>
  )
}
