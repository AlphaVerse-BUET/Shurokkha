"use client"

import { useAppStore } from "@/store/app-store"
import { mockProviders } from "@/store/mock-data"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { calculateTrustScore } from "@/lib/ai-engines"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Clock, CheckCircle, Download } from "lucide-react"

export default function PerformanceReportPage() {
  const router = useRouter()
  const { isAuthenticated, currentRole, currentUser } = useAppStore()

  useEffect(() => {
    if (!isAuthenticated || currentRole !== "provider") {
      router.push("/auth/login?role=provider")
    }
  }, [isAuthenticated, currentRole, router])

  const provider = mockProviders.find((p) => p.organizationName === currentUser?.name)

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Provider not found</p>
        </Card>
      </div>
    )
  }

  const trustScore = calculateTrustScore(provider)

  const handleDownloadPDF = () => {
    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Performance Report - ${provider.organizationName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #2d5016; padding-bottom: 20px; }
          .logo { font-size: 28px; font-weight: bold; color: #2d5016; margin-bottom: 10px; }
          .org-name { font-size: 20px; color: #666; }
          .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 30px 0; }
          .metric-card { border: 2px solid #e0e0e0; border-radius: 8px; padding: 20px; }
          .metric-label { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 8px; }
          .metric-value { font-size: 32px; font-weight: bold; color: #2d5016; }
          .metric-sub { font-size: 12px; color: #999; margin-top: 5px; }
          .section { margin: 30px 0; }
          .section-title { font-size: 20px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px; }
          .breakdown-item { margin: 15px 0; }
          .breakdown-label { font-size: 14px; margin-bottom: 5px; }
          .progress-bar { width: 100%; height: 20px; background: #e0e0e0; border-radius: 10px; overflow: hidden; }
          .progress-fill { height: 100%; background: linear-gradient(90deg, #2d5016, #4a7c2a); }
          .badges { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }
          .badge { display: inline-block; padding: 8px 16px; background: #f0f0f0; border: 1px solid #d0d0d0; border-radius: 20px; font-size: 12px; }
          .footer { margin-top: 50px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #e0e0e0; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🤝 Shurokkha Platform</div>
          <div class="org-name">${provider.organizationName}</div>
          <div style="font-size: 14px; color: #999; margin-top: 10px;">Performance Report</div>
        </div>

        <div class="metrics">
          <div class="metric-card">
            <div class="metric-label">Trust Score</div>
            <div class="metric-value">${trustScore.trustScore}/100</div>
            <div class="metric-sub">Verified ${provider.yearsActive} years</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Completion Rate</div>
            <div class="metric-value">${provider.completionRate}%</div>
            <div class="metric-sub">${provider.totalAidedBeneficiaries} beneficiaries aided</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Average Response Time</div>
            <div class="metric-value">${provider.responseTimeHours}h</div>
            <div class="metric-sub">Quick responder</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Average Rating</div>
            <div class="metric-value">${provider.averageRating}/5</div>
            <div class="metric-sub">${provider.fraudIncidents} fraud incidents</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Trust Score Breakdown</div>
          ${[
            { label: "Completion Rate (30%)", value: trustScore.breakdown.completionRate, max: 30 },
            { label: "Average Rating (25%)", value: trustScore.breakdown.averageRating, max: 25 },
            { label: "Response Speed (20%)", value: trustScore.breakdown.responseSpeed, max: 20 },
            { label: "Fraud Bonus (15%)", value: trustScore.breakdown.fraudBonus, max: 15 },
            { label: "Longevity (10%)", value: trustScore.breakdown.longevity, max: 10 },
          ]
            .map(
              (item) => `
            <div class="breakdown-item">
              <div class="breakdown-label">${item.label}: ${item.value.toFixed(1)}</div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${(item.value / item.max) * 100}%"></div>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>

        <div class="section">
          <div class="section-title">Achievements & Badges</div>
          <div class="badges">
            ${
              provider.badges.length > 0
                ? provider.badges
                    .map((badge) => `<div class="badge">✓ ${badge.replace(/-/g, " ").toUpperCase()}</div>`)
                    .join("")
                : '<div style="color: #999;">No badges earned yet</div>'
            }
          </div>
        </div>

        <div class="section">
          <div class="section-title">Specialization</div>
          <p>${provider.specialization.join(", ")}</p>
        </div>

        <div class="section">
          <div class="section-title">Geographic Focus</div>
          <p><strong>Divisions:</strong> ${provider.geographicFocus.divisions.join(", ")}</p>
          <p><strong>Districts:</strong> ${provider.geographicFocus.districts.join(", ")}</p>
        </div>

        <div class="footer">
          <p>This report was generated by Shurokkha Platform</p>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <p>For inquiries, contact: info@shurokkha.org</p>
        </div>
      </body>
      </html>
    `

    const blob = new Blob([reportHTML], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `performance-report-${provider.organizationName.replace(/\s+/g, "-")}.html`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Performance Report</h1>
            <p className="text-muted-foreground">{provider.organizationName}</p>
          </div>
          <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Report (HTML)
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="text-sm text-muted-foreground mb-2">Trust Score</div>
            <div className="text-4xl font-bold text-primary mb-2">{trustScore.trustScore}/100</div>
            <div className="text-xs text-muted-foreground">Verified {provider.yearsActive} years</div>
          </Card>

          <Card className="p-6 border-l-4 border-l-secondary">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <CheckCircle className="w-4 h-4" />
              Completion Rate
            </div>
            <div className="text-4xl font-bold text-secondary mb-2">{provider.completionRate}%</div>
            <div className="text-xs text-muted-foreground">{provider.totalAidedBeneficiaries} beneficiaries</div>
          </Card>

          <Card className="p-6 border-l-4 border-l-accent">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Clock className="w-4 h-4" />
              Avg Response
            </div>
            <div className="text-4xl font-bold text-accent mb-2">{provider.responseTimeHours}h</div>
            <div className="text-xs text-muted-foreground">Quick responder</div>
          </Card>

          <Card className="p-6 border-l-4 border-l-yellow-500">
            <div className="text-sm text-muted-foreground mb-2">Average Rating</div>
            <div className="text-4xl font-bold text-yellow-500 mb-2">{provider.averageRating}/5</div>
            <div className="text-xs text-muted-foreground">{provider.fraudIncidents} fraud incidents</div>
          </Card>
        </div>

        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Trust Score Breakdown</h2>
          <div className="space-y-4">
            {[
              { label: "Completion Rate (30%)", value: trustScore.breakdown.completionRate, max: 30 },
              { label: "Average Rating (25%)", value: trustScore.breakdown.averageRating, max: 25 },
              { label: "Response Speed (20%)", value: trustScore.breakdown.responseSpeed, max: 20 },
              { label: "Fraud Bonus (15%)", value: trustScore.breakdown.fraudBonus, max: 15 },
              { label: "Longevity (10%)", value: trustScore.breakdown.longevity, max: 10 },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm font-bold text-primary">{item.value.toFixed(1)}</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(item.value / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Achievements</h2>
          <div className="flex flex-wrap gap-3">
            {provider.badges.length > 0 ? (
              provider.badges.map((badge) => (
                <Badge key={badge} variant="outline" className="px-4 py-2 text-base">
                  ✓ {badge.replace(/-/g, " ").toUpperCase()}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">Complete distributions to earn badges</span>
            )}
          </div>
        </Card>

        {/* Added new sections */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Specialization</h2>
          <p className="text-lg">{provider.specialization.join(", ")}</p>
        </Card>

        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Geographic Focus</h2>
          <div className="space-y-2">
            <p className="text-lg font-bold">Divisions:</p>
            <p className="text-lg">{provider.geographicFocus.divisions.join(", ")}</p>
            <p className="text-lg font-bold">Districts:</p>
            <p className="text-lg">{provider.geographicFocus.districts.join(", ")}</p>
          </div>
        </Card>
      </div>
    </main>
  )
}
