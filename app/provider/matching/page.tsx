"use client"

import { useAppStore } from "@/store/app-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { mockProviders, mockDonations, mockCrises } from "@/store/mock-data"
import { useCurrency } from "@/contexts/currency-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, MapPin, DollarSign } from "lucide-react"

export default function MatchingPage() {
  const router = useRouter()
  const { isAuthenticated, currentRole, currentUser } = useAppStore()
  const { formatAbbreviated } = useCurrency()

  useEffect(() => {
    if (!isAuthenticated || currentRole !== "provider") {
      router.push("/auth/login?role=provider")
    }
  }, [isAuthenticated, currentRole, router])

  const provider = mockProviders.find((p) => p.organizationName === currentUser?.name) || mockProviders[0]

  const availableDonations = mockDonations
    .filter((d) => d.status === "pending")
    .map((d) => {
      const crisis = mockCrises.find((c) => c.id === d.crisisId)
      return {
        ...d,
        crisis,
        compatibleWithProvider:
          crisis &&
          provider.specialization.includes(crisis.type) &&
          provider.geographicFocus.divisions.includes(crisis.location.division),
      }
    })
    .sort((a, b) => (b.compatibleWithProvider ? 1 : -1) - (a.compatibleWithProvider ? 1 : -1))

  const totalAvailable = availableDonations.reduce((sum, d) => sum + d.amount, 0)
  const compatibleCount = availableDonations.filter((d) => d.compatibleWithProvider).length

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-background to-secondary/5">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Donation Matching Pool</h1>
          <p className="text-muted-foreground">Find donations that match your organization's capabilities</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <DollarSign className="w-4 h-4" />
              Total Available
            </div>
            <div className="text-3xl font-bold text-primary">{formatAbbreviated(totalAvailable)}</div>
            <div className="text-xs text-muted-foreground mt-2">{availableDonations.length} donations</div>
          </Card>

          <Card className="p-6 border-l-4 border-l-green-500">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <CheckCircle className="w-4 h-4" />
              Compatible Matches
            </div>
            <div className="text-3xl font-bold text-green-600">{compatibleCount}</div>
            <div className="text-xs text-muted-foreground mt-2">
              {compatibleCount > 0 ? "Ready to apply" : "No matches yet"}
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-orange-500">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <AlertCircle className="w-4 h-4" />
              Other Opportunities
            </div>
            <div className="text-3xl font-bold text-orange-600">{availableDonations.length - compatibleCount}</div>
            <div className="text-xs text-muted-foreground mt-2">Outside your focus area</div>
          </Card>
        </div>

        {/* Donation List */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Available Donations</h2>

          {availableDonations.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No donations available for matching at this time</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableDonations.map((donation) => (
                <div
                  key={donation.id}
                  className={`border rounded-lg p-6 transition-all ${
                    donation.compatibleWithProvider
                      ? "border-green-500/50 bg-green-500/5"
                      : "border-border/30 bg-background/50 opacity-70"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{donation.crisis?.title}</h3>
                        {donation.compatibleWithProvider ? (
                          <Badge className="bg-green-600 text-white">Compatible Match</Badge>
                        ) : (
                          <Badge variant="outline" className="border-orange-500 text-orange-600">
                            Not Aligned
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {donation.crisis?.location.district}, {donation.crisis?.location.division}
                        </div>
                        <Badge variant="outline">{donation.crisis?.type}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">{formatAbbreviated(donation.amount)}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {donation.allocations.length} beneficiaries
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Created: </span>
                      <span className="font-medium">{new Date(donation.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Button
                      variant={donation.compatibleWithProvider ? "default" : "outline"}
                      disabled={!donation.compatibleWithProvider}
                    >
                      {donation.compatibleWithProvider ? "Apply for Distribution" : "Not Compatible"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Info Box */}
        <Card className="p-6 mt-6 bg-blue-500/5 border-blue-500/30">
          <h3 className="font-bold mb-2">How Matching Works</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Compatible donations match your specialization and geographic focus</li>
            <li>• Apply for compatible donations to start the distribution process</li>
            <li>• Your trust score affects your chances of being selected</li>
            <li>• Update your profile to improve matching accuracy</li>
          </ul>
        </Card>
      </div>
    </main>
  )
}
