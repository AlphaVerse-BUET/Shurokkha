"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/app-store"
import { mockCrises, mockProviders } from "@/store/mock-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { aiImpactPrediction } from "@/lib/ai-engines"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function NewDonationPage() {
  const router = useRouter()
  const { isAuthenticated, currentRole } = useAppStore()
  const { toast } = useToast()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedCrisis, setSelectedCrisis] = useState<string | null>(null)
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [preferences, setPreferences] = useState({
    providers: [] as string[],
    excludeProviders: [] as string[],
    geographic: "" as string,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  if (!isAuthenticated || currentRole !== "donor") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Login Required</h2>
          <p className="text-muted-foreground mb-6">Please login as a donor to make a donation.</p>
          <Link href="/auth/login?role=donor">
            <Button>Login as Donor</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const crisis = selectedCrisis ? mockCrises.find((c) => c.id === selectedCrisis) : null
  const impactPrediction = amount && crisis ? aiImpactPrediction(Number(amount), crisis.type) : null

  const validateAmount = () => {
    const numAmount = Number(amount)
    if (!amount || numAmount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid donation amount", variant: "destructive" })
      return false
    }
    if (numAmount < 100) {
      toast({ title: "Amount Too Low", description: "Minimum donation amount is ৳100", variant: "destructive" })
      return false
    }
    if (numAmount > 10000000) {
      toast({ title: "Amount Too High", description: "Maximum donation amount is ৳10,000,000", variant: "destructive" })
      return false
    }
    return true
  }

  const handleDonate = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("[v0] Donation submitted", {
      crisis: selectedCrisis,
      amount,
      message,
      preferences,
    })

    setIsSubmitting(false)
    setShowConfirmation(false)
    toast({ title: "Success!", description: "Donation successful! Thank you for your contribution." })

    setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
  }

  const handleConfirmDonation = () => {
    if (!validateAmount()) return
    setShowConfirmation(true)
  }

  if (mockCrises.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          icon={AlertCircle}
          title="No Active Crises"
          description="There are currently no active crises that need donations. Please check back later."
          actionLabel="Go to Dashboard"
          onAction={() => router.push("/dashboard")}
        />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-background to-accent/5">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`flex-1 h-2 rounded-full transition ${step >= num ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>

        {step === 1 && (
          <Card className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Select a Crisis</h2>
              <p className="text-muted-foreground">Choose which crisis you want to support</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockCrises.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCrisis(c.id)}
                  className={`p-4 rounded-lg border-2 transition text-left ${
                    selectedCrisis === c.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold">{c.title}</h3>
                    <Badge variant="outline">{c.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{c.location.district}</p>
                  <div className="flex justify-between items-end text-xs">
                    <span className="text-foreground/60">
                      Gap: ৳{(c.fundingNeeded - c.fundingReceived).toLocaleString()}
                    </span>
                    <span className="font-semibold text-primary">
                      {Math.round((c.fundingReceived / c.fundingNeeded) * 100)}% funded
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <Button onClick={() => setStep(2)} disabled={!selectedCrisis} className="w-full">
              Continue
            </Button>
          </Card>
        )}

        {step === 2 && crisis && (
          <Card className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Donation Amount</h2>
              <p className="text-muted-foreground">How much would you like to donate for {crisis.title}?</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Amount (BDT)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60">৳</span>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8"
                    min="100"
                    max="10000000"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Minimum: ৳100 | Maximum: ৳10,000,000</p>
              </div>

              {impactPrediction && (
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-sm">AI Impact Estimate</h4>
                  <p className="text-sm">{impactPrediction.crisisProjection}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Avg Cost/Family: </span>
                      <span className="font-semibold">৳{impactPrediction.predictedCost.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Est. Days: </span>
                      <span className="font-semibold">{impactPrediction.distributionDays.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Message (optional)</label>
                <textarea
                  placeholder="Leave a message for the provider or beneficiary"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1">{message.length}/500 characters</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(3)} disabled={!amount} className="flex-1">
                Continue
              </Button>
            </div>
          </Card>
        )}

        {step === 3 && crisis && (
          <Card className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Provider Preferences</h2>
              <p className="text-muted-foreground">Choose which providers you trust</p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Preferred Providers (Optional)</h3>
                {mockProviders.length === 0 ? (
                  <EmptyState
                    icon={AlertCircle}
                    title="No Providers Available"
                    description="There are currently no providers registered on the platform."
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {mockProviders.map((p) => (
                      <label
                        key={p.id}
                        className="flex items-center gap-3 p-3 border border-border/50 rounded-lg hover:border-primary/50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={preferences.providers.includes(p.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPreferences((prev) => ({
                                ...prev,
                                providers: [...prev.providers, p.id],
                              }))
                            } else {
                              setPreferences((prev) => ({
                                ...prev,
                                providers: prev.providers.filter((id) => id !== p.id),
                              }))
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{p.organizationName}</div>
                          <div className="text-xs text-muted-foreground">Trust Score: {p.trustScore}/100</div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setStep(2)} variant="outline" className="flex-1" disabled={isSubmitting}>
                Back
              </Button>
              <Button onClick={handleConfirmDonation} className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Processing...</span>
                  </>
                ) : (
                  `Complete Donation ৳${amount}`
                )}
              </Button>
            </div>
          </Card>
        )}
      </div>

      {showConfirmation && (
        <ConfirmationDialog
          title="Confirm Donation"
          message={`Are you sure you want to donate ৳${Number(amount).toLocaleString()} to ${crisis?.title}? This action cannot be undone.`}
          confirmLabel="Confirm Donation"
          cancelLabel="Cancel"
          onConfirm={handleDonate}
          onCancel={() => setShowConfirmation(false)}
          variant="info"
        />
      )}
    </main>
  )
}
