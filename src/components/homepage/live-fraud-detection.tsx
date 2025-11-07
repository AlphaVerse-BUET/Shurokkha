"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Clock, Users, TrendingUp, Zap } from "lucide-react"

interface FraudDetectionEvent {
  id: string
  type: "suspicious_pattern" | "document_mismatch" | "rapid_withdrawal" | "prevented"
  severity: "high" | "medium" | "low"
  title: string
  description: string
  timestamp: Date
  amount?: number
  actionTaken: string
}

export function LiveFraudDetectionShowcase() {
  const [events, setEvents] = useState<FraudDetectionEvent[]>([])
  const [totalPrevented, setTotalPrevented] = useState(4250000)
  const [autoplay, setAutoplay] = useState(true)

  // Simulate fraud detection events
  useEffect(() => {
    if (!autoplay) return

    const mockEvents: FraudDetectionEvent[] = [
      {
        id: "1",
        type: "document_mismatch",
        severity: "high",
        title: "Document Verification Failed",
        description: "Face on NID doesn't match satellite imagery profile. Multiple red flags detected.",
        timestamp: new Date(),
        amount: 150000,
        actionTaken: "Blocked donation routing. Flagged for manual review.",
      },
      {
        id: "2",
        type: "rapid_withdrawal",
        severity: "high",
        title: "Suspicious Withdrawal Pattern",
        description: "Provider withdrew ৳50L in 3 hours. Historical average: ৳2L/day.",
        timestamp: new Date(Date.now() + 5000),
        amount: 500000,
        actionTaken: "Frozen account. Alert sent to admin team.",
      },
      {
        id: "3",
        type: "suspicious_pattern",
        severity: "medium",
        title: "Network Anomaly Detected",
        description: "5 new donors registered from same IP, all targeting same provider.",
        timestamp: new Date(Date.now() + 10000),
        actionTaken: "Flagged for investigation. Rate limiting applied.",
      },
      {
        id: "4",
        type: "prevented",
        severity: "low",
        title: "Potential Ring Broken",
        description: "AI detected and blocked coordinated fraud ring with 12+ accounts.",
        timestamp: new Date(Date.now() + 15000),
        amount: 2100000,
        actionTaken: "All involved accounts suspended. Funds returned to donors.",
      },
    ]

    let eventIndex = 0
    const interval = setInterval(() => {
      if (eventIndex < mockEvents.length) {
        setEvents((prev) => [mockEvents[eventIndex], ...prev])
        if (mockEvents[eventIndex].type === "prevented" && mockEvents[eventIndex].amount) {
          setTotalPrevented((prev) => prev + mockEvents[eventIndex].amount!)
        }
        eventIndex++
      } else {
        // Reset and loop
        eventIndex = 0
        setEvents([])
        setTotalPrevented(4250000)
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [autoplay])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900"
      case "medium":
        return "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900"
      default:
        return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900"
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge className="bg-red-600">🚨 High Risk</Badge>
      case "medium":
        return <Badge className="bg-orange-600">⚠️ Medium Risk</Badge>
      default:
        return <Badge className="bg-green-600">✓ Prevented</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document_mismatch":
        return "📋"
      case "rapid_withdrawal":
        return "💸"
      case "suspicious_pattern":
        return "🔗"
      case "prevented":
        return "✅"
      default:
        return "⚠️"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant="secondary" className="mx-auto">
          Real-Time Demo
        </Badge>
        <h2 className="text-3xl font-bold">Fraud Detection in Action</h2>
        <p className="text-muted-foreground">
          Watch how Shurokkha's AI prevents fraud in real-time across thousands of transactions
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <Zap className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-muted-foreground">This Month</span>
            </div>
            <div className="text-2xl font-bold">৳{(totalPrevented / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">Fraud prevented</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-xs text-muted-foreground">Detected</span>
            </div>
            <div className="text-2xl font-bold">847</div>
            <p className="text-xs text-muted-foreground">Suspicious attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs text-muted-foreground">Success Rate</span>
            </div>
            <div className="text-2xl font-bold">99.8%</div>
            <p className="text-xs text-muted-foreground">Fraud prevention accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-muted-foreground">Response Time</span>
            </div>
            <div className="text-2xl font-bold">0.3s</div>
            <p className="text-xs text-muted-foreground">Average detection</p>
          </CardContent>
        </Card>
      </div>

      {/* Live Events Stream */}
      <Card className="border-2 border-primary/30">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
              <h3 className="font-bold">Live Event Stream</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoplay(!autoplay)}
            >
              {autoplay ? "⏸️ Pause" : "▶️ Play"}
            </Button>
          </div>

          {/* Event List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {events.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Waiting for fraud detection events...</p>
                <p className="text-xs">Click Play to simulate live detection</p>
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border-2 ${getSeverityColor(event.severity)} animate-in slide-in-from-top`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl">{getTypeIcon(event.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold flex items-center gap-2">
                          {event.title}
                          {getSeverityBadge(event.severity)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        {event.amount && (
                          <p className="text-sm font-medium text-primary mt-2">
                            Amount at Risk: ৳{(event.amount / 100000).toFixed(1)}L
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/50 dark:bg-black/30 rounded p-2 text-xs">
                    <p className="font-mono">
                      <span className="text-green-600">→ Action:</span> {event.actionTaken}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEvents([])
                setTotalPrevented(4250000)
                setAutoplay(false)
              }}
            >
              Clear Events
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                setAutoplay(!autoplay)
              }}
            >
              {autoplay ? "⏸️ Pause Simulation" : "▶️ Resume Simulation"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fraud Detection Layers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-900">
          <CardContent className="p-6 space-y-3">
            <div className="text-3xl">📡</div>
            <h4 className="font-bold">Layer 1: Document AI</h4>
            <p className="text-sm text-muted-foreground">
              Verifies NID, business licenses, and face matching against satellite imagery. Detects forged documents with 99.5% accuracy.
            </p>
            <div className="text-xs bg-blue-100 dark:bg-blue-900/50 p-2 rounded font-mono">
              Face match: 98.7% | Spoofing: Detected
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-900">
          <CardContent className="p-6 space-y-3">
            <div className="text-3xl">🕸️</div>
            <h4 className="font-bold">Layer 2: Network Analysis</h4>
            <p className="text-sm text-muted-foreground">
              Detects fraud rings by analyzing donor networks, payment patterns, and account relationships in real-time.
            </p>
            <div className="text-xs bg-purple-100 dark:bg-purple-900/50 p-2 rounded font-mono">
              Ring detected: 12 accounts | Probability: 94%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-orange-200 dark:border-red-900">
          <CardContent className="p-6 space-y-3">
            <div className="text-3xl">⚡</div>
            <h4 className="font-bold">Layer 3: Behavioral ML</h4>
            <p className="text-sm text-muted-foreground">
              Machine learning models trained on 2+ years of data detect anomalies like rapid withdrawals and unusual patterns.
            </p>
            <div className="text-xs bg-red-100 dark:bg-red-900/50 p-2 rounded font-mono">
              Anomaly score: 94/100 | Flag: Suspicious
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impact Card */}
      <Card className="border-2 border-green-200 dark:border-green-900 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold text-lg">🛡️ What This Means</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Your donations are protected</p>
                <p className="text-xs text-muted-foreground">Fraud is caught before it impacts real aid delivery</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Trust is transparent</p>
                <p className="text-xs text-muted-foreground">You see exactly how fraud is prevented, not just that it is</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Impact is real</p>
                <p className="text-xs text-muted-foreground">
                  Every ৳ saved from fraud goes directly to help people in need
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LiveFraudDetectionShowcase
