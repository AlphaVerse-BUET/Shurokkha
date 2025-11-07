"use client"

import { useState } from "react"
import { mockBeneficiaries, mockProviders, mockDistributionProofs } from "@/store/mock-data"
import { CheckCircle, Clock, MapPin, User, Package } from "lucide-react"
import { useBeneficiaryStatus } from "@/hooks/use-beneficiary-status"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DistributionProofViewer } from "@/components/shared/distribution-proof-viewer"

export default function BeneficiaryStatusTracking() {
  const beneficiary = mockBeneficiaries[0]
  const status = useBeneficiaryStatus(beneficiary)
  const { statusLabel, statusColor, progress, timelineStages, nextAction, verificationBadge } = status
  
  const [showDistributionProof, setShowDistributionProof] = useState(false)
  
  const provider = beneficiary.allocatedProviderId
    ? mockProviders.find((p) => p.id === beneficiary.allocatedProviderId)
    : null
  
  // Find distribution proof
  const distributionProof = beneficiary.applicationStatus === "completed" 
    ? mockDistributionProofs.find(proof => proof.allocationId === "alloc-1" || proof.allocationId === "alloc-7")
    : null

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Current Status */}
      <div className="bg-gradient-to-r from-accent/20 to-primary/10 border border-accent/30 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-foreground/70 text-sm">Current Status</p>
              <Badge className={verificationBadge.color}>{verificationBadge.text}</Badge>
            </div>
            <h2 className="text-3xl font-bold text-accent">{statusLabel}</h2>
            <p className="text-sm text-foreground/60 mt-2">{progress}% complete</p>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden max-w-md">
              <div className={`h-full ${statusColor} transition-all`} style={{ width: `${progress}%` }} />
            </div>
          </div>
          <CheckCircle className="w-16 h-16 text-green-600 flex-shrink-0" />
        </div>
      </div>

      {/* Next Action */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-sm font-semibold text-blue-700 mb-1">Next Step:</p>
        <p className="text-sm text-blue-600">{nextAction}</p>
      </div>

      {/* Journey timeline */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-6">Application Journey</h3>

        <div className="space-y-4">
          {timelineStages.map((stage, index) => (
            <div key={stage.id} className="flex gap-4">
              {/* Timeline line and dot */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    stage.completed
                      ? "bg-green-600/20 border-green-600 text-green-600"
                      : "bg-border/50 border-border text-foreground/60"
                  }`}
                  data-testid={`timeline-stage-${stage.id}`}
                >
                  {stage.completed ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                {index < timelineStages.length - 1 && (
                  <div 
                    className={`w-1 flex-1 my-2 transition-all min-h-[40px] ${
                      stage.completed ? "bg-green-600/30" : "bg-border/50"
                    }`} 
                  />
                )}
              </div>

              {/* Content */}
              <div className="pb-4 flex-1">
                <h4 className="font-semibold text-foreground">{stage.label}</h4>
                {stage.completed && stage.date && (
                  <p className="text-xs text-foreground/60 mt-1">
                    Completed on {new Date(stage.date).toLocaleDateString()}
                  </p>
                )}
                {!stage.completed && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Waiting...
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Allocation Details */}
      {beneficiary.allocationDate && (
        <div className="bg-card border border-border/50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground">Distribution Details</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-foreground/60 mb-1">Amount Allocated</p>
              <p className="text-2xl font-bold text-primary">৳{beneficiary.amountRequested.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-foreground/60 mb-1">Provider</p>
              <p className="text-lg font-semibold text-foreground">BRAC Khulna</p>
            </div>
          </div>

          <div className="border-t border-border/30 pt-4">
            <p className="text-sm text-foreground/70 mb-3">Distribution Progress</p>
            <div className="space-y-2">
              {[
                "Pre-visit verification",
                "Beneficiary confirmation",
                "Item distribution",
                "Photo documentation",
                "Post-verification",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-600/20 border border-green-600 flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                  </div>
                  <span className="text-sm text-foreground">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {beneficiary.providerRating && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <p className="text-sm font-semibold text-green-700 mb-1">You rated this provider:</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-5 h-5 rounded ${i < beneficiary.providerRating ? "bg-yellow-400" : "bg-border/30"}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Provider info card */}
      {provider && (
        <div className="bg-card border border-border/50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Provider Information</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground/70">Organization</p>
                <p className="font-semibold text-foreground">{provider.organizationName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground/70">Operating Area</p>
                <p className="font-semibold text-foreground">{provider.geographicFocus.divisions.join(", ")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Badge className="bg-blue-500">Trust Score: {provider.trustScore}/100</Badge>
              <Badge variant="outline">{provider.completionRate}% Success Rate</Badge>
            </div>
          </div>
        </div>
      )}

      {/* Distribution Proof */}
      {beneficiary.applicationStatus === "completed" && distributionProof && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-600" />
                  Distribution Verification
                </CardTitle>
                <CardDescription>AI-verified proof of distribution</CardDescription>
              </div>
              <Button 
                variant={showDistributionProof ? "outline" : "default"} 
                onClick={() => setShowDistributionProof(!showDistributionProof)}
              >
                {showDistributionProof ? "Hide" : "View"} Proof
              </Button>
            </div>
          </CardHeader>
          {showDistributionProof && (
            <CardContent>
              <DistributionProofViewer 
                proof={distributionProof} 
                beneficiaryName={beneficiary.fullName}
                showAIVerification={true}
              />
            </CardContent>
          )}
        </Card>
      )}

      {/* SMS Notifications history */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Notification History</h3>
        <div className="space-y-2 text-sm">
          <p className="text-foreground/70">You will receive SMS updates at each stage:</p>
          <ul className="space-y-1 text-foreground/60 text-xs">
            <li>✓ Application submitted confirmation</li>
            <li>✓ AI verification complete</li>
            <li>✓ Provider matched notification</li>
            <li>✓ Distribution date alert</li>
            <li>✓ Funds received confirmation</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
