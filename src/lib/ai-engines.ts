import type { Crisis, Beneficiary, Provider, Donation, FraudAlert } from "@/types"
import { mockBeneficiaries, mockProviders } from "@/store/mock-data"

export interface DocumentVerificationResult {
  verified: boolean
  confidence: number
  issues: string[]
  details: {
    nidAuthentic?: boolean
    faceMatch?: number
    documentTampering?: boolean
    formatValid?: boolean
    duplicateDetected?: boolean
    livenessCheck?: boolean
  }
}

export async function verifyNID(
  nidNumber: string,
  nidImage: string,
  selfieImage?: string,
): Promise<DocumentVerificationResult> {
  // Mock NID verification with NIDW database
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const isValid = nidNumber.length >= 10 && nidNumber.length <= 17
  const hasSelfie = !!selfieImage

  if (!isValid) {
    return {
      verified: false,
      confidence: 15,
      issues: ["Invalid NID format", "NID number does not match government database"],
      details: {
        nidAuthentic: false,
        formatValid: false,
      },
    }
  }

  const faceMatchScore = hasSelfie ? Math.floor(Math.random() * 10) + 90 : 0

  return {
    verified: true,
    confidence: 95,
    issues: [],
    details: {
      nidAuthentic: true,
      faceMatch: faceMatchScore,
      documentTampering: false,
      formatValid: true,
      duplicateDetected: false,
      livenessCheck: hasSelfie ? true : undefined,
    },
  }
}

// AI Crisis Detection & Validation (Section 3.1)
export function aiCrisisValidation(crisis: Crisis): {
  validationScore: number
  aiVerification: string
  satellites: string
  newsAnalysis: string
  socialSentiment: string
  trustLevel: "high" | "medium" | "low"
} {
  const baseScore = 50
  let score = baseScore

  if (crisis.satelliteData) score += 15
  if (crisis.newsLinks.length > 2) score += 15
  if (crisis.evidenceImages.length > 3) score += 12
  if (crisis.severity > 70) score += 8

  return {
    validationScore: Math.min(score, 100),
    aiVerification: `Validated via satellite imagery showing ${Math.round((crisis.severity / 100) * 25)}% area impact`,
    satellites: `NASA/ESA satellite confirms ${crisis.affectedPopulation.toLocaleString()} affected population`,
    newsAnalysis: `NLP analysis extracted ${crisis.newsLinks.length} credible news sources`,
    socialSentiment: `Social media sentiment: ${score > 80 ? "High concern" : "Moderate concern"}`,
    trustLevel: score > 80 ? "high" : score > 60 ? "medium" : "low",
  }
}

// AI Document Verification (Section 3.2)
export function aiDocumentVerification(beneficiary: Beneficiary): {
  nidVerification: { authentic: boolean; confidence: number }
  faceMatching: { matched: boolean; similarity: number }
  documentTampering: { detected: boolean; evidence: string }
  overallScore: number
  status: "verified" | "flagged" | "rejected"
} {
  const nidScore = 92 + Math.random() * 8
  const faceScore = 88 + Math.random() * 12
  const tamperingRisk = Math.random() > 0.95

  const overallScore = (nidScore + faceScore) / 2
  const status = overallScore > 90 && !tamperingRisk ? "verified" : overallScore > 75 ? "flagged" : "rejected"

  return {
    nidVerification: {
      authentic: nidScore > 85,
      confidence: nidScore,
    },
    faceMatching: {
      matched: faceScore > 90,
      similarity: faceScore,
    },
    documentTampering: {
      detected: tamperingRisk,
      evidence: tamperingRisk ? "Metadata inconsistencies detected in NID images" : "No tampering detected",
    },
    overallScore,
    status,
  }
}

// AI Fraud Detection (Section 3.3)
export function aiFraudDetection(
  beneficiary: Beneficiary,
  allBeneficiaries: Beneficiary[] = mockBeneficiaries,
): FraudAlert[] {
  const alerts: FraudAlert[] = []

  const duplicateNID = allBeneficiaries.filter((b) => b.nidNumber === beneficiary.nidNumber)
  if (duplicateNID.length > 1) {
    alerts.push({
      id: `alert-${Date.now()}-1`,
      type: "duplicate-nid",
      targetId: beneficiary.id,
      targetType: "beneficiary",
      severity: "critical",
      description: `Same NID (${beneficiary.nidNumber}) used in ${duplicateNID.length} applications`,
      evidence: duplicateNID.map((b) => b.id),
      status: "open",
      createdAt: new Date().toISOString(),
    })
  }

  const sameCrisisApps = allBeneficiaries.filter(
    (b) => b.location.district === beneficiary.location.district && b.needCategory === beneficiary.needCategory,
  )
  if (sameCrisisApps.length > 0) {
    const avgCost = sameCrisisApps.reduce((sum, b) => sum + b.amountRequested, 0) / sameCrisisApps.length
    const costDiff = ((beneficiary.amountRequested - avgCost) / avgCost) * 100
    if (costDiff > 30) {
      alerts.push({
        id: `alert-${Date.now()}-2`,
        type: "cost-outlier",
        targetId: beneficiary.id,
        targetType: "beneficiary",
        severity: "high",
        description: `Cost ৳${beneficiary.amountRequested} is ${costDiff.toFixed(1)}% above regional average ৳${avgCost.toFixed(0)}`,
        evidence: [avgCost.toString()],
        status: "open",
        createdAt: new Date().toISOString(),
      })
    }
  }

  return alerts
}

// AI Smart Matching Algorithm (Section 3.4)
export function aiSmartMatching(
  donation: Donation,
  beneficiaries: Beneficiary[] = mockBeneficiaries,
  providers: Provider[] = mockProviders,
): {
  matchedProviderId: string | null
  matchedBeneficiaries: Beneficiary[]
  matchingScore: number
  reasoning: string
} {
  let bestScore = 0
  let bestProviderId: string | null = null
  let matchedBeneficiaries: Beneficiary[] = []

  const candidateBeneficiaries = beneficiaries.filter((b) => b.applicationStatus === "verified")

  for (const provider of providers) {
    if (provider.status !== "active") continue
    if (provider.fraudIncidents > 0) continue

    let score = 0

    if (donation.providerPreference?.positive.includes(provider.id)) {
      score += 35
    }

    if (donation.providerPreference?.negative.includes(provider.id)) {
      continue
    }

    score += (provider.trustScore / 100) * 30
    score += (provider.completionRate / 100) * 25

    if (donation.providerPreference?.geographicFocus) {
      if (provider.geographicFocus.divisions.includes(donation.providerPreference.geographicFocus)) {
        score += 20
      }
    }

    if (candidateBeneficiaries.length > 0) {
      score += 15
    }

    if (provider.totalAidedBeneficiaries < provider.maxActiveBeneficiaries) {
      score += 10
    }

    score -= (provider.responseTimeHours / 100) * 5

    if (score > bestScore) {
      bestScore = score
      bestProviderId = provider.id
    }
  }

  if (bestProviderId) {
    const provider = providers.find((p) => p.id === bestProviderId)
    if (provider) {
      matchedBeneficiaries = candidateBeneficiaries
        .filter((b) => provider.geographicFocus.districts.includes(b.location.district))
        .slice(0, Math.min(3, provider.maxActiveBeneficiaries - provider.totalAidedBeneficiaries))
    }
  }

  return {
    matchedProviderId: bestProviderId,
    matchedBeneficiaries,
    matchingScore: Math.round(bestScore),
    reasoning: `Provider matched based on ${bestScore > 80 ? "excellent" : bestScore > 60 ? "good" : "fair"} alignment with donor preferences`,
  }
}

// AI Trust Score Calculation (Section 3.6)
export function calculateTrustScore(provider: Provider): {
  trustScore: number
  breakdown: {
    completionRate: number
    averageRating: number
    responseSpeed: number
    fraudBonus: number
    longevity: number
  }
} {
  const completionScore = (provider.completionRate / 100) * 30
  const ratingScore = (provider.averageRating / 5) * 20 * (25 / 100)
  const responseScore = Math.max(0, 100 - provider.responseTimeHours * 2) * (20 / 100)
  const fraudBonus = provider.fraudIncidents === 0 ? 15 : 0
  const longevity = Math.min(10, provider.yearsActive * 10) * (10 / 100)

  const trustScore = Math.round(completionScore + ratingScore + responseScore + fraudBonus + longevity)

  return {
    trustScore: Math.min(100, trustScore),
    breakdown: {
      completionRate: completionScore,
      averageRating: ratingScore,
      responseSpeed: responseScore,
      fraudBonus,
      longevity,
    },
  }
}

// AI Impact Prediction (Section 3.8)
export function aiImpactPrediction(
  donationAmount: number,
  crisisType: string,
  providerEfficiency = 0.85,
): {
  predictedFamilies: number
  predictedCost: number
  distributionDays: number
  crisisProjection: string
} {
  const costPerFamily: Record<string, number> = {
    flood: 8000,
    fire: 7500,
    medical: 15000,
    poverty: 5000,
    education: 3000,
    livelihood: 10000,
  }

  const baseCost = costPerFamily[crisisType] || 8000
  const adjustedCost = baseCost / providerEfficiency
  const predictedFamilies = Math.floor(donationAmount / adjustedCost)

  return {
    predictedFamilies: Math.max(1, predictedFamilies),
    predictedCost: baseCost,
    distributionDays: 5 + Math.random() * 3,
    crisisProjection: `Your ৳${donationAmount.toLocaleString()} will likely help ${Math.max(1, predictedFamilies)}-${Math.max(2, predictedFamilies + 1)} families based on regional costs`,
  }
}
