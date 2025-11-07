"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, X, ArrowRight } from "lucide-react"
import Link from "next/link"

export function WhyShurokkha() {
  const [selectedCategory, setSelectedCategory] = useState("trust")

  const categories = [
    {
      id: "trust",
      title: "Trust & Verification",
      icon: "🔐",
      features: [
        {
          feature: "Document Verification",
          traditional: "Manual, subject to error (50-60% fraud rate)",
          shurokkha: "AI document verification + face matching (99.5% accuracy)",
        },
        {
          feature: "Provider Verification",
          traditional: "Basic background check, rarely updated",
          shurokkha: "Continuous AI verification with real-time updates",
        },
        {
          feature: "Beneficiary Verification",
          traditional: "List-based, prone to duplicates and forgery",
          shurokkha: "NID + satellite imagery + GPS verification",
        },
        {
          feature: "Transparency",
          traditional: "No visibility into donation flow",
          shurokkha: "100% trackable with GPS, SMS, and photo proofs",
        },
      ],
    },
    {
      id: "speed",
      title: "Speed & Efficiency",
      icon: "⚡",
      features: [
        {
          feature: "Crisis Detection",
          traditional: "Manual reporting, 2-3 days to identify",
          shurokkha: "AI satellite detection, <2 hours",
        },
        {
          feature: "Aid Delivery",
          traditional: "45+ days average",
          shurokkha: "5 days average (88% faster)",
        },
        {
          feature: "Verification Speed",
          traditional: "Manual review, 5-7 days",
          shurokkha: "Instant AI verification (0.3 seconds)",
        },
        {
          feature: "Fund Disbursement",
          traditional: "Multiple approval layers, 2-3 weeks",
          shurokkha: "Immediate upon verification confirmation",
        },
      ],
    },
    {
      id: "impact",
      title: "Measurable Impact",
      icon: "📊",
      features: [
        {
          feature: "Fraud Prevention",
          traditional: "20-30% funds lost to fraud",
          shurokkha: "<1% fraud rate with full audit trail",
        },
        {
          feature: "Cost Efficiency",
          traditional: "15-20% overhead, limited transparency",
          shurokkha: "<3% overhead, 100% transparent tracking",
        },
        {
          feature: "Donor Return Rate",
          traditional: "40% average repeat donation rate",
          shurokkha: "85%+ repeat donation rate",
        },
        {
          feature: "Accountability",
          traditional: "Reports delayed by months",
          shurokkha: "Real-time impact metrics and photo proofs",
        },
      ],
    },
    {
      id: "scalability",
      title: "Scalability & Innovation",
      icon: "🚀",
      features: [
        {
          feature: "Fraud Detection",
          traditional: "Manual case-by-case investigation",
          shurokkha: "AI-powered fraud ring detection across network",
        },
        {
          feature: "Provider Network",
          traditional: "Limited to pre-selected organizations",
          shurokkha: "Open network: individuals, NGOs, government",
        },
        {
          feature: "Coverage",
          traditional: "Urban-centric, limited reach",
          shurokkha: "64 districts, villages, remote areas",
        },
        {
          feature: "Technology",
          traditional: "Paper-based with basic digital tools",
          shurokkha: "AI, satellite imagery, blockchain trail",
        },
      ],
    },
  ]

  const currentCategory = categories.find((c) => c.id === selectedCategory)!

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant="secondary" className="mx-auto">
          Why Choose Shurokkha
        </Badge>
        <h2 className="text-3xl font-bold">How We're Different</h2>
        <p className="text-muted-foreground">
          See how Shurokkha's AI-powered approach outperforms traditional charity systems
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 justify-center flex-wrap">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(cat.id)}
            className="gap-2"
          >
            <span>{cat.icon}</span>
            {cat.title}
          </Button>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <div className="space-y-4 min-w-full">
          {currentCategory.features.map((item, idx) => (
            <Card key={idx}>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">{item.feature}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Traditional */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <X className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-red-600">Traditional Charity</span>
                    </div>
                    <p className="text-sm text-muted-foreground bg-red-50 dark:bg-red-950/30 p-3 rounded">
                      {item.traditional}
                    </p>
                  </div>

                  {/* Shurokkha */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-600">Shurokkha</span>
                    </div>
                    <p className="text-sm text-muted-foreground bg-green-50 dark:bg-green-950/30 p-3 rounded">
                      {item.shurokkha}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* The Difference Explained */}
      <Card className="border-2 border-primary/30 bg-linear-to-br from-primary/5 to-transparent">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold text-lg">💡 The Core Difference</h3>
          <div className="space-y-3">
            <p className="text-sm">
              Traditional charities optimize for <span className="font-semibold">trust through reputation</span>. You donate to organizations you've heard of, hoping your money is well-spent.
            </p>
            <p className="text-sm">
              Shurokkha optimizes for <span className="font-semibold">trust through transparency</span>. Every transaction is verified, tracked, and explainable. You don't hope your money reaches people—you know it does.
            </p>
            <div className="border-t pt-3 text-sm text-muted-foreground">
              <p className="mb-2">This is why:</p>
              <ul className="space-y-1 ml-4">
                <li>• Donors feel confident investing larger amounts</li>
                <li>• Aid reaches beneficiaries 88% faster</li>
                <li>• Fraud is prevented before it causes harm</li>
                <li>• Donors return for 85% of future crises</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Numbers Speak */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center space-y-2">
            <div className="text-4xl font-bold text-green-600">99.8%</div>
            <p className="text-sm text-muted-foreground">Fraud prevention rate</p>
            <p className="text-xs text-muted-foreground">vs 20-30% industry average</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center space-y-2">
            <div className="text-4xl font-bold text-blue-600">5d</div>
            <p className="text-sm text-muted-foreground">Average delivery time</p>
            <p className="text-xs text-muted-foreground">vs 45 days traditional</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center space-y-2">
            <div className="text-4xl font-bold text-orange-600">85%</div>
            <p className="text-sm text-muted-foreground">Repeat donation rate</p>
            <p className="text-xs text-muted-foreground">vs 40% industry average</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center space-y-2">
            <div className="text-4xl font-bold text-purple-600">100%</div>
            <p className="text-sm text-muted-foreground">Donation transparency</p>
            <p className="text-xs text-muted-foreground">Complete audit trail</p>
          </CardContent>
        </Card>
      </div>

      {/* Technology Stack Comparison */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold text-lg">Technology Behind the Difference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="font-semibold text-sm text-muted-foreground">Traditional Charity Stack</p>
              <div className="space-y-2">
                <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded text-xs">
                  <p className="font-semibold">Paper & Manual</p>
                  <p className="text-muted-foreground">Forms, letters, meetings</p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded text-xs">
                  <p className="font-semibold">Basic Database</p>
                  <p className="text-muted-foreground">Spreadsheets, basic CRM</p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded text-xs">
                  <p className="font-semibold">Limited Tracking</p>
                  <p className="text-muted-foreground">Monthly reports, delayed updates</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-sm text-muted-foreground">Shurokkha Tech Stack</p>
              <div className="space-y-2">
                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded text-xs">
                  <p className="font-semibold">🤖 AI & ML</p>
                  <p className="text-muted-foreground">
                    Document verification, face matching, fraud rings, impact prediction
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded text-xs">
                  <p className="font-semibold">📡 Real-Time Data</p>
                  <p className="text-muted-foreground">
                    Satellite imagery, GPS tracking, SMS confirmations
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded text-xs">
                  <p className="font-semibold">🔗 Blockchain Trail</p>
                  <p className="text-muted-foreground">
                    Immutable audit trail, cryptographic verification
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stakeholder Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-900">
          <CardContent className="p-6 space-y-3">
            <h3 className="font-bold">👤 For Donors</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>See exactly where your ৳ goes</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>Verified impact with proof</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>Withdraw unused funds anytime</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>Real-time GPS tracking</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30 border-orange-200 dark:border-orange-900">
          <CardContent className="p-6 space-y-3">
            <h3 className="font-bold">🏢 For Providers</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>Build transparent trust score</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>Access more donor funding</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>Reduce operational costs</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>AI-powered matching for efficiency</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-900">
          <CardContent className="p-6 space-y-3">
            <h3 className="font-bold">👥 For Beneficiaries</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>Aid arrives 88% faster</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>Fraud eliminated</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>Distribution verified at their location</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>Direct SMS confirmations</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Final CTA */}
      <Card className="border-2 border-primary/30">
        <CardContent className="p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold">Join the Future of Charitable Giving</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Shurokkha isn't just better technology. It's a new way to think about trust, transparency,
            and impact. One where everyone can see the proof.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap pt-4">
            <Link href="/auth/login?role=donor">
              <Button size="lg" className="gap-2">
                Start Donating <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/crises">
              <Button size="lg" variant="outline">
                See Active Crises
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default WhyShurokkha
