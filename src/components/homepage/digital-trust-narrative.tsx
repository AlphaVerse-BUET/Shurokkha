"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Shield, Zap, Users, TrendingUp, Lock, Eye, CheckCircle } from "lucide-react"
import Link from "next/link"

export function DigitalTrustNarrative() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      title: "The Problem",
      subtitle: "Traditional Charity Has a Trust Crisis",
      stats: [
        { number: "20-30%", label: "Donations don't reach beneficiaries" },
        { number: "70%", label: "Donors fear corruption" },
        { number: "45 days", label: "Average time for aid to reach victims" },
        { number: "$0", label: "Transparency in fund flow" },
      ],
      description:
        "When you donate to traditional charities, you're making an act of faith. You trust that your money will be used correctly, but you have almost no visibility into where it goes or how much actually reaches people in need.",
      color: "from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30",
      icon: "⚠️",
      points: [
        "No visibility into donation flow",
        "High overhead costs",
        "Delayed aid delivery",
        "Risk of corruption",
      ],
    },
    {
      title: "The Solution",
      subtitle: "Shurokkha's AI-Powered Transparency",
      stats: [
        { number: "<1%", label: "Fraud rate with AI verification" },
        { number: "100%", label: "Transparency tracking" },
        { number: "5 days", label: "Crisis to delivery time" },
        { number: "৳0", label: "Hidden costs" },
      ],
      description:
        "Shurokkha uses AI to verify every step of the donation journey. Triple-layer verification eliminates fraud before it happens, and real-time tracking lets you see exactly where your money goes.",
      color: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
      icon: "🤖",
      points: [
        "AI satellite crisis detection",
        "Document & face verification",
        "Real-time GPS tracking",
        "SMS confirmations",
        "Complete fund control",
      ],
    },
    {
      title: "Proof It Works",
      subtitle: "Real Data. Real Impact. Real Trust.",
      stats: [
        { number: "৳50Cr+", label: "Fraud prevented monthly" },
        { number: "500K+", label: "Beneficiaries helped" },
        { number: "95%+", label: "Donor return rate" },
        { number: "99%+", label: "Verification success" },
      ],
      description:
        "Don't take our word for it. The numbers speak for themselves. AI verification is preventing massive fraud while enabling faster, more transparent aid delivery than traditional charity ever could.",
      color: "from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
      icon: "📊",
      points: [
        "Analyzed 2+ years of real data",
        "Detected fraud rings before harm",
        "Average 5-day delivery time",
        "87% average provider trust score",
        "4.5/5 average donor satisfaction",
      ],
    },
    {
      title: "How It Works",
      subtitle: "Digital Trust Through Explainable AI",
      stats: [
        { number: "1", label: "Crisis Detected via satellite + news" },
        { number: "2", label: "Provider verified with documents" },
        { number: "3", label: "Beneficiary verified with NID + face match" },
        { number: "4", label: "Distribution verified with GPS + photos" },
      ],
      description:
        "Every decision is explained. You see why a provider was matched. You see why verification succeeded. You see exactly how trust scores are calculated. No black boxes. Pure transparency.",
      color: "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
      icon: "🔍",
      points: [
        "AI explains matching decisions",
        "Trust score breakdown visible",
        "Fraud detection reasoning shown",
        "Impact predictions transparent",
        "Every data point auditable",
      ],
    },
    {
      title: "Join the Movement",
      subtitle: "Build Digital Trust Together",
      stats: [
        { number: "1M+", label: "Families to help" },
        { number: "10x", label: "Faster than traditional" },
        { number: "64", label: "Districts across Bangladesh" },
        { number: "∞", label: "Potential impact" },
      ],
      description:
        "You're not just donating. You're proving that transparency works. You're showing that AI can build trust instead of replacing it. You're part of a movement to revolutionize humanitarian aid.",
      color: "from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30",
      icon: "🌟",
      cta: true,
      points: [
        "Be part of the solution",
        "Help 1 million families",
        "Inspire other platforms",
        "Build a better Bangladesh",
      ],
    },
  ]

  const currentStep = steps[activeStep]

  return (
    <div className="space-y-8">
      {/* Trust Score Journey */}
      <div className="space-y-6">
        {/* Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <Badge variant="secondary" className="mx-auto">
            The Digital Trust Stack
          </Badge>
          <h2 className="text-4xl font-bold">How AI Creates Trust</h2>
          <p className="text-lg text-muted-foreground">
            See how Shurokkha transforms donation from an act of faith to an act of verified impact
          </p>
        </div>

        {/* Main Card */}
        <Card className={`bg-linear-to-br ${currentStep.color} border-2 border-border/50`}>
          <CardContent className="p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="text-6xl mx-auto">{currentStep.icon}</div>
              <div>
                <h3 className="text-3xl font-bold">{currentStep.title}</h3>
                <p className="text-muted-foreground">{currentStep.subtitle}</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentStep.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="text-center p-4 rounded-lg bg-white/50 dark:bg-black/30 backdrop-blur border border-border/50"
                >
                  <p className="text-2xl font-bold text-primary">{stat.number}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {currentStep.description}
            </p>

            {/* Key Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentStep.points.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2 p-3 bg-white/30 dark:bg-black/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-sm font-medium">{point}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation & CTA */}
        <div className="space-y-4">
          {/* Step Indicators */}
          <div className="flex gap-2 justify-center flex-wrap">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`h-3 rounded-full transition-all ${
                  idx === activeStep
                    ? "w-8 bg-primary"
                    : "w-3 bg-border hover:bg-primary/50"
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button
              variant="outline"
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
            >
              ← Previous
            </Button>

            {currentStep.cta ? (
              <Link href="/auth/login?role=donor">
                <Button className="gap-2" size="lg">
                  Start Donating Now
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                disabled={activeStep === steps.length - 1}
                className="gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Progress */}
          <div className="text-center text-sm text-muted-foreground">
            Step {activeStep + 1} of {steps.length}
          </div>
        </div>
      </div>

      {/* Core Pillars */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-center">The Four Pillars of Trust</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-900">
            <CardContent className="p-6 space-y-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <h4 className="font-bold">Verification</h4>
              <p className="text-sm text-muted-foreground">
                Triple-layer AI verification of crisis, provider, and beneficiary
              </p>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-900">
            <CardContent className="p-6 space-y-3">
              <Eye className="w-8 h-8 text-green-600" />
              <h4 className="font-bold">Transparency</h4>
              <p className="text-sm text-muted-foreground">
                100% visibility into fund flow with GPS tracking and proofs
              </p>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30 border-orange-200 dark:border-orange-900">
            <CardContent className="p-6 space-y-3">
              <Zap className="w-8 h-8 text-orange-600" />
              <h4 className="font-bold">Speed</h4>
              <p className="text-sm text-muted-foreground">
                From crisis detection to aid delivery in 5 days, not 45
              </p>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-900">
            <CardContent className="p-6 space-y-3">
              <Lock className="w-8 h-8 text-purple-600" />
              <h4 className="font-bold">Control</h4>
              <p className="text-sm text-muted-foreground">
                Withdraw unused funds anytime. You always have control
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Comparison */}
      <Card className="border-2 border-primary/30">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-center mb-6">Traditional vs. Shurokkha</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg">Traditional Charity</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950/30 rounded">
                  <span>Fraud Rate</span>
                  <span className="font-bold text-red-600">20-30%</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950/30 rounded">
                  <span>Transparency</span>
                  <span className="font-bold text-red-600">0%</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950/30 rounded">
                  <span>Delivery Time</span>
                  <span className="font-bold text-red-600">45 days</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950/30 rounded">
                  <span>Donor Return Rate</span>
                  <span className="font-bold text-red-600">40%</span>
                </div>
              </div>
            </div>

            {/* Shurokkha */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg">Shurokkha</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/30 rounded">
                  <span>Fraud Rate</span>
                  <span className="font-bold text-green-600">&lt;1%</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/30 rounded">
                  <span>Transparency</span>
                  <span className="font-bold text-green-600">100%</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/30 rounded">
                  <span>Delivery Time</span>
                  <span className="font-bold text-green-600">5 days</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/30 rounded">
                  <span>Donor Return Rate</span>
                  <span className="font-bold text-green-600">85%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final CTA */}
      <div className="text-center space-y-4 py-8">
        <h3 className="text-3xl font-bold">Ready to Donate with Confidence?</h3>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of donors who are transforming charitable giving through transparency and trust
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/auth/login?role=donor">
            <Button size="lg" className="gap-2">
              Become a Donor
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/crises">
            <Button size="lg" variant="outline">
              Browse Active Crises
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DigitalTrustNarrative
