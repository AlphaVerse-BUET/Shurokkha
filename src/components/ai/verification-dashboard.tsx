"use client"

import { useState } from "react"
import { mockBeneficiaries, mockProviders } from "@/store/mock-data"
import { verifyNIDDocument, checkDuplicateNID } from "@/lib/ai-verification"
import { batchMatch } from "@/lib/ai-matching"
import { CheckCircle, Clock, AlertTriangle, Zap } from "lucide-react"

export default function VerificationDashboard() {
  const [verificationResults, setVerificationResults] = useState<Record<string, any>>({})
  const [matchingResults, setMatchingResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Run verification on a beneficiary
  const handleVerifyBeneficiary = async (beneficiaryId: string) => {
    setLoading(true)
    const beneficiary = mockBeneficiaries.find((b) => b.id === beneficiaryId)
    if (!beneficiary) return

    try {
      const [nidResult, duplicateCheck] = await Promise.all([
        verifyNIDDocument("/nid-document.jpg"),
        checkDuplicateNID(beneficiary.nidNumber, beneficiary.fullName),
      ])

      setVerificationResults((prev) => ({
        ...prev,
        [beneficiaryId]: {
          nidVerification: nidResult,
          duplicateCheck,
          timestamp: new Date().toISOString(),
        },
      }))
    } finally {
      setLoading(false)
    }
  }

  // Run batch matching
  const handleBatchMatch = async () => {
    setLoading(true)
    try {
      const matches = batchMatch(mockBeneficiaries, mockProviders)
      setMatchingResults(matches)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    if (status === "verified") return <CheckCircle className="w-4 h-4 text-green-600" />
    if (status === "pending") return <Clock className="w-4 h-4 text-yellow-600" />
    return <AlertTriangle className="w-4 h-4 text-red-600" />
  }

  return (
    <div className="space-y-6">
      {/* AI Verification Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-xs text-foreground/60 mb-1">Verified Beneficiaries</p>
          <p className="text-3xl font-bold text-green-600">
            {
              Object.values(verificationResults).filter(
                (r: any) => r.nidVerification?.verificationStatus === "verified",
              ).length
            }
          </p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-xs text-foreground/60 mb-1">Pending Review</p>
          <p className="text-3xl font-bold text-yellow-600">
            {
              Object.values(verificationResults).filter((r: any) => r.nidVerification?.verificationStatus === "pending")
                .length
            }
          </p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-xs text-foreground/60 mb-1">Optimal Matches Found</p>
          <p className="text-3xl font-bold text-blue-600">{matchingResults.length}</p>
        </div>
      </div>

      {/* Beneficiary Verification Queue */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Beneficiary Verification Queue</h3>
          <button
            onClick={handleBatchMatch}
            disabled={loading}
            className="px-4 py-2 bg-accent hover:bg-accent/90 disabled:opacity-50 text-accent-foreground rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Run Batch Matching
          </button>
        </div>

        <div className="space-y-2">
          {mockBeneficiaries.map((beneficiary) => {
            const result = verificationResults[beneficiary.id]
            return (
              <div
                key={beneficiary.id}
                className="border border-border/50 rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{beneficiary.fullName}</p>
                  <p className="text-xs text-foreground/60">
                    {beneficiary.location.district} - {beneficiary.needCategory}
                  </p>
                </div>
                {result ? (
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.nidVerification.verificationStatus)}
                    <span className="text-xs font-medium text-foreground/70">
                      {result.nidVerification.verificationStatus === "verified"
                        ? `✓ Verified (${result.nidVerification.confidenceScore}%)`
                        : result.nidVerification.verificationStatus === "pending"
                          ? "⏳ Pending"
                          : "✗ Rejected"}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleVerifyBeneficiary(beneficiary.id)}
                    disabled={loading}
                    className="px-3 py-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded transition-colors disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify"}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Matching Results */}
      {matchingResults.length > 0 && (
        <div className="bg-card border border-border/50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">AI-Generated Matches</h3>
          <div className="space-y-3">
            {matchingResults.slice(0, 5).map((match) => {
              const beneficiary = mockBeneficiaries.find((b) => b.id === match.beneficiaryId)
              const provider = mockProviders.find((p) => p.id === match.providerId)
              return (
                <div key={match.matchId} className="border border-border/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-foreground">{beneficiary?.fullName}</p>
                      <p className="text-sm text-foreground/70">{provider?.organizationName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{match.compatibilityScore}%</div>
                      <p className="text-xs text-foreground/60">Compatibility</p>
                    </div>
                  </div>
                  <p className="text-xs text-foreground/60 mb-2">{match.matchReason}</p>
                  <div className="grid grid-cols-5 gap-1 text-center text-xs">
                    <div className="bg-background rounded p-1">
                      <p className="font-bold text-primary">{match.factors.trustScore}</p>
                      <p className="text-foreground/60 text-xs">Trust</p>
                    </div>
                    <div className="bg-background rounded p-1">
                      <p className="font-bold text-accent">{match.factors.geographicFit}</p>
                      <p className="text-foreground/60 text-xs">Location</p>
                    </div>
                    <div className="bg-background rounded p-1">
                      <p className="font-bold text-green-600">{match.factors.specialization}</p>
                      <p className="text-foreground/60 text-xs">Skills</p>
                    </div>
                    <div className="bg-background rounded p-1">
                      <p className="font-bold text-blue-600">{match.factors.capacity}</p>
                      <p className="text-foreground/60 text-xs">Capacity</p>
                    </div>
                    <div className="bg-background rounded p-1">
                      <p className="font-bold text-purple-600">{match.factors.responseTime}</p>
                      <p className="text-foreground/60 text-xs">Speed</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* AI Verification System Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-700">
        <p className="font-semibold mb-2">AI Verification & Matching System</p>
        <ul className="space-y-1 text-xs list-disc ml-5">
          <li>NID document verification using image analysis</li>
          <li>Deepfake detection for distribution photos</li>
          <li>Duplicate detection with fuzzy matching</li>
          <li>Cost outlier analysis against regional averages</li>
          <li>Multi-factor provider matching (trust, location, specialization)</li>
          <li>Batch matching with capacity optimization</li>
        </ul>
      </div>
    </div>
  )
}
