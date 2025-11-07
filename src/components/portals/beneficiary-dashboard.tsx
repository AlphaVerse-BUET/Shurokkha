"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Users,
  User,
  Clock,
  TrendingUp,
  AlertCircle,
  Package,
  MapPin,
  Phone,
  FileText,
} from "lucide-react"
import { mockBeneficiaries, mockProviders, mockDistributionProofs } from "@/store/mock-data"
import { useRouter } from "next/navigation"
import { useBeneficiaryStatus } from "@/hooks/use-beneficiary-status"
import { DistributionProofViewer } from "@/components/shared/distribution-proof-viewer"
import { ApplicationTimeline } from "@/components/beneficiary/application-timeline"
import { useState } from "react"

export default function BeneficiaryDashboard() {
  const router = useRouter()
  const beneficiary = mockBeneficiaries[0]
  const provider = beneficiary.allocatedProviderId
    ? mockProviders.find((p) => p.id === beneficiary.allocatedProviderId)
    : null

  const status = useBeneficiaryStatus(beneficiary)
  const { progress: applicationProgress, statusColor, statusLabel, verificationBadge } = status

  const [showDistributionProof, setShowDistributionProof] = useState(false)
  
  // Find distribution proof for completed beneficiary
  const distributionProof = beneficiary.applicationStatus === "completed" 
    ? mockDistributionProofs.find(proof => {
        // Match by beneficiary ID in allocations
        return proof.allocationId && mockBeneficiaries[0].id === "beneficiary-1"
      })
    : null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Welcome, {beneficiary.fullName}</CardTitle>
              <CardDescription>Track your aid application and distribution status</CardDescription>
            </div>
            <Button onClick={() => router.push("/beneficiary/profile")} variant="outline" className="gap-2">
              <User className="h-4 w-4" />
              View Profile
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Application Status</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-2xl font-bold">{statusLabel}</div>
              <Badge className={verificationBadge.color}>{verificationBadge.text}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{applicationProgress}% complete</p>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div className={`h-full ${statusColor} transition-all`} style={{ width: `${applicationProgress}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount Requested</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">৳{beneficiary.amountRequested.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1 capitalize">{beneficiary.needCategory} assistance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verification</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{beneficiary.verificationStatus}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Applied {new Date(beneficiary.appliedDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Application Timeline - Unified Component */}
      <ApplicationTimeline beneficiary={beneficiary} provider={provider} showProofStatus={true} />

      {provider && (
        <Card>
          <CardHeader>
            <CardTitle>Your Assigned Provider</CardTitle>
            <CardDescription>Organization handling your case</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h4 className="font-semibold text-lg">{provider.organizationName}</h4>
                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-500">Trust Score: {provider.trustScore}/100</Badge>
                  <Badge variant="outline">{provider.completionRate}% Completion Rate</Badge>
                  {provider.badges.includes("zero-fraud") && <Badge className="bg-green-500">Zero Fraud</Badge>}
                </div>

                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{provider.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{provider.geographicFocus.divisions.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Avg. Response: {provider.responseTimeHours} hours</span>
                  </div>
                </div>

                {beneficiary.applicationStatus === "completed" && !beneficiary.providerRating && (
                  <Button className="mt-2">Rate Provider</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {beneficiary.impactStory && beneficiary.applicationStatus === "completed" && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-green-700 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Impact Story
            </CardTitle>
            <CardDescription>How this aid helped you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">{beneficiary.impactStory}</p>
            {beneficiary.providerRating && (
              <div className="flex items-center gap-2 pt-2 border-t">
                <span className="text-sm font-medium">Your Rating:</span>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-5 h-5 rounded ${i < beneficiary.providerRating! ? "bg-yellow-400" : "bg-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-2">{beneficiary.providerFeedback}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Distribution Proof - For Completed Cases */}
      {beneficiary.applicationStatus === "completed" && distributionProof && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-600" />
                  Distribution Verification
                </CardTitle>
                <CardDescription>Photos and documents from your aid distribution</CardDescription>
              </div>
              <Button 
                variant={showDistributionProof ? "outline" : "default"} 
                onClick={() => setShowDistributionProof(!showDistributionProof)}
                data-testid="btn-toggle-distribution-proof"
              >
                {showDistributionProof ? "Hide Proof" : "View Proof"}
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

      {beneficiary.applicationStatus === "pending" && (
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="text-yellow-700 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Your application is under review. We will notify you once verification is complete and a provider is
              assigned to your case.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
