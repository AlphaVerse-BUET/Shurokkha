"use client"

import { useAppStore } from "@/store/app-store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { mockCrises, mockProviders } from "@/store/mock-data"
import { aiImpactPrediction, aiSmartMatching } from "@/lib/ai-engines"
import type { Donation } from "@/types"
import { useCurrency } from "@/contexts/currency-context"

export default function NewDonationPage() {
  const { currentUser, currentRole } = useAppStore()
  const router = useRouter()
  const { formatAmount, getCurrencySymbol } = useCurrency()
  const [selectedCrisis, setSelectedCrisis] = useState(mockCrises[0])
  const [amount, setAmount] = useState("10000")
  const [providerFilter, setProviderFilter] = useState<string[]>([])
  const [impactPrediction, setImpactPrediction] = useState<any>(null)
  const [matchedProviders, setMatchedProviders] = useState<any[]>([])

  useEffect(() => {
    if (currentRole !== "donor") {
      router.push("/auth/login?role=donor")
    }
  }, [currentRole, router])

  useEffect(() => {
    const prediction = aiImpactPrediction(Number.parseInt(amount) || 0, selectedCrisis.type, 0.85)
    setImpactPrediction(prediction)

    const mockDonation: Donation = {
      id: "temp",
      donorId: currentUser?.id || "",
      crisisId: selectedCrisis.id,
      amount: Number.parseInt(amount) || 0,
      status: "pending",
      allocations: [],
      createdAt: new Date().toISOString(),
      refundSettings: { autoRefund: true, refundDays: 60 },
      transactionFee: (Number.parseInt(amount) || 0) * 0.025,
      providerPreference: {
        positive: providerFilter,
        negative: [],
        geographicFocus: selectedCrisis.location.division,
      },
    }

    const matching = aiSmartMatching(mockDonation)
    const matchedProvidersList = mockProviders.filter(
      (p) => p.id === matching.matchedProviderId || providerFilter.includes(p.id),
    )
    setMatchedProviders(matchedProvidersList)
  }, [amount, selectedCrisis, providerFilter, currentUser?.id])

  const handleDonate = () => {
    router.push(`/donor/confirm-donation?amount=${amount}&crisis=${selectedCrisis.id}`)
  }

  return (
    <main className="min-h-screen bg-background pb-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Make a Donation</h1>

        <div className="grid grid-cols-3 gap-6">
          {/* Crisis Selection */}
          <div className="col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Select Crisis</h2>
              <div className="grid grid-cols-2 gap-4">
                {mockCrises.map((crisis) => (
                  <Card
                    key={crisis.id}
                    className={`p-4 cursor-pointer transition ${
                      selectedCrisis.id === crisis.id ? "border-primary border-2 bg-primary/5" : "hover:border-primary"
                    }`}
                    onClick={() => setSelectedCrisis(crisis)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-sm">{crisis.title}</h3>
                      <Badge variant="outline">{crisis.type}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{crisis.location.district}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Severity:</span>
                        <span className="font-bold">{crisis.severity}/100</span>
                      </div>
                      <div className="w-full bg-muted rounded h-2">
                        <div className="bg-destructive h-2 rounded" style={{ width: `${crisis.severity}%` }} />
                      </div>
                      <div className="flex justify-between pt-2">
                        <span>Funded:</span>
                        <span>{Math.round((crisis.fundingReceived / crisis.fundingNeeded) * 100)}%</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Donation Amount */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Donation Amount</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Amount ({getCurrencySymbol()})</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1000"
                    step="1000"
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[5000, 10000, 25000, 50000].map((val) => (
                    <Button
                      key={val}
                      variant={amount === val.toString() ? "default" : "outline"}
                      onClick={() => setAmount(val.toString())}
                      size="sm"
                    >
                      {formatAmount(val / 1000)}K
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Provider Preferences */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Provider Preferences (Optional)</h2>
              <div className="space-y-3">
                {mockProviders.map((provider) => (
                  <label
                    key={provider.id}
                    className="flex items-center gap-3 p-3 border rounded hover:bg-accent cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={providerFilter.includes(provider.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setProviderFilter([...providerFilter, provider.id])
                        } else {
                          setProviderFilter(providerFilter.filter((id) => id !== provider.id))
                        }
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{provider.organizationName}</div>
                      <div className="text-xs text-muted-foreground">Trust Score: {provider.trustScore}</div>
                    </div>
                  </label>
                ))}
              </div>
            </Card>
          </div>

          {/* AI Recommendations Sidebar */}
          <div className="space-y-6">
            {/* Impact Prediction */}
            {impactPrediction && (
              <Card className="p-6 bg-primary/5 border-primary">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <span>🤖 AI Impact Forecast</span>
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Families Helped:</span>
                    <div className="text-2xl font-bold text-primary">{impactPrediction.predictedFamilies}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Typical Delivery:</span>
                    <div className="font-bold">{Math.round(impactPrediction.distributionDays)} days</div>
                  </div>
                  <p className="text-xs italic text-muted-foreground mt-4">"{impactPrediction.crisisProjection}"</p>
                  <div className="pt-2 border-t text-xs text-muted-foreground">
                    <strong>Transaction Fee:</strong> {formatAmount((Number.parseInt(amount) || 0) * 0.025)} (2.5%)
                  </div>
                </div>
              </Card>
            )}

            {/* Matched Providers */}
            {matchedProviders.length > 0 && (
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <span>✓ Recommended Providers</span>
                </h3>
                <div className="space-y-3">
                  {matchedProviders.map((provider) => (
                    <div key={provider.id} className="p-3 border rounded-lg">
                      <div className="font-medium text-sm">{provider.organizationName}</div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          ⭐ {provider.trustScore}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {provider.completionRate}% Complete
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">Response: {provider.responseTimeHours}h</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Donate Button */}
            <Button onClick={handleDonate} className="w-full h-12 text-base" disabled={Number.parseInt(amount) < 1000}>
              Proceed to Donate
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
