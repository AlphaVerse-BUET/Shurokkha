"use client"

import { useState } from "react"
import { mockCrises, mockProviders } from "@/store/mock-data"
import { X, ChevronRight } from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"

interface DonationFlowModalProps {
  crisisId: string
  onClose: () => void
  onComplete: () => void
}

export default function DonationFlowModal({ crisisId, onClose, onComplete }: DonationFlowModalProps) {
  const crisis = mockCrises.find((c) => c.id === crisisId)
  const { formatAbbreviated } = useCurrency()
  const [step, setStep] = useState(1)
  const [donationAmount, setDonationAmount] = useState("")
  const [message, setMessage] = useState("")
  const [selectedProviders, setSelectedProviders] = useState<string[]>([])
  const [excludedProviders, setExcludedProviders] = useState<string[]>([])
  const [geographicFocus, setGeographicFocus] = useState(crisis?.location.division || "")

  if (!crisis) return null

  const relevantProviders = mockProviders.filter(
    (p) => p.specialization.includes(crisis.type) && p.geographicFocus.divisions.includes(crisis.location.division),
  )

  const handleProviderToggle = (providerId: string, type: "include" | "exclude") => {
    if (type === "include") {
      setSelectedProviders((prev) =>
        prev.includes(providerId) ? prev.filter((id) => id !== providerId) : [...prev, providerId],
      )
    } else {
      setExcludedProviders((prev) =>
        prev.includes(providerId) ? prev.filter((id) => id !== providerId) : [...prev, providerId],
      )
    }
  }

  const canProceed = donationAmount && Number(donationAmount) > 0

  const handleContinue = () => {
    if (step === 3) {
      onComplete()
    } else {
      setStep(step + 1)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="border-b border-border/50 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-foreground">Make a Donation</h2>
            <p className="text-xs text-foreground/60">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-background/80 rounded-lg">
            <X className="w-5 h-5 text-foreground/60" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Crisis info */}
          <div className="bg-card border border-border/50 rounded-lg p-3">
            <p className="text-xs text-foreground/60">Supporting</p>
            <h3 className="font-semibold text-foreground line-clamp-2">{crisis.title}</h3>
          </div>

          {/* Step 1: Amount */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Donation Amount</label>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 bg-card border border-border/50 rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Quick amounts */}
              <div className="grid grid-cols-4 gap-2">
                {[500, 1000, 5000, 10000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDonationAmount(amount.toString())}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                      donationAmount === amount.toString()
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border/50 hover:border-primary/50 text-foreground"
                    }`}
                  >
                    {formatAbbreviated(amount)}
                  </button>
                ))}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Message (optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Send a message to beneficiaries"
                  rows={3}
                  className="w-full px-3 py-2 bg-card border border-border/50 rounded-lg text-foreground text-sm placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Fee info */}
              {donationAmount && (
                <div className="bg-primary/5 border border-primary/30 rounded-lg p-3 text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-foreground/70">Donation:</span>
                    <span className="font-medium">{formatAbbreviated(Number(donationAmount))}</span>
                  </div>
                  <div className="flex justify-between text-foreground/60">
                    <span>Platform fee (2.5%):</span>
                    <span>{formatAbbreviated(Number(donationAmount) * 0.025)}</span>
                  </div>
                  <div className="border-t border-primary/30 mt-2 pt-2 flex justify-between font-semibold">
                    <span>Total charge:</span>
                    <span className="text-primary">{formatAbbreviated(Number(donationAmount) * 1.025)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Provider preferences */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">Provider Preferences</label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {relevantProviders.map((provider) => (
                    <div key={provider.id} className="border border-border/50 rounded-lg p-3">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">{provider.organizationName}</p>
                          <p className="text-xs text-foreground/60">Trust Score: {provider.trustScore}/100</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">{provider.trustScore}</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleProviderToggle(provider.id, "include")}
                          className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${
                            selectedProviders.includes(provider.id)
                              ? "bg-green-500/20 text-green-700 border border-green-500/50"
                              : "bg-card border border-border/50 text-foreground/60 hover:border-green-500/50"
                          }`}
                        >
                          Prefer
                        </button>
                        <button
                          onClick={() => handleProviderToggle(provider.id, "exclude")}
                          className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${
                            excludedProviders.includes(provider.id)
                              ? "bg-red-500/20 text-red-700 border border-red-500/50"
                              : "bg-card border border-border/50 text-foreground/60 hover:border-red-500/50"
                          }`}
                        >
                          Exclude
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Geographic Focus</label>
                <select
                  value={geographicFocus}
                  onChange={(e) => setGeographicFocus(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border/50 rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value={crisis.location.division}>Local ({crisis.location.division})</option>
                  <option value="national">National</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Review & Confirm */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-card border border-border/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Crisis:</span>
                  <span className="font-medium text-foreground text-right text-sm line-clamp-2 max-w-xs">
                    {crisis.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Amount:</span>
                  <span className="font-medium text-primary">{formatAbbreviated(Number(donationAmount))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Fee (2.5%):</span>
                  <span className="font-medium text-foreground">{formatAbbreviated(Number(donationAmount) * 0.025)}</span>
                </div>
                <div className="border-t border-border/30 pt-3 flex justify-between">
                  <span className="font-semibold text-foreground">Total Charge:</span>
                  <span className="font-bold text-lg text-primary">{formatAbbreviated(Number(donationAmount) * 1.025)}</span>
                </div>
              </div>

              {selectedProviders.length > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-xs text-blue-700">
                  <p className="font-semibold mb-1">Preferred Providers:</p>
                  <p>
                    {mockProviders
                      .filter((p) => selectedProviders.includes(p.id))
                      .map((p) => p.organizationName)
                      .join(", ")}
                  </p>
                </div>
              )}

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-xs text-primary">
                <p className="font-semibold mb-1">Fund Security:</p>
                <p>Your funds will be locked in escrow and released in stages as distribution is verified.</p>
              </div>
            </div>
          )}

          {/* Progress bar */}
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-border/50"}`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 px-4 py-2 bg-background border border-border/50 hover:bg-card rounded-lg text-foreground font-medium transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleContinue}
              disabled={!canProceed && step === 1}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {step === 3 ? "Complete Donation" : "Continue"}
              {step < 3 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
