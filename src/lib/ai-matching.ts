/**
 * AI Matching Engine - Implements intelligent beneficiary-provider matching from Section 3.2
 * Maximizes trust score compatibility, geographic alignment, and fund efficiency
 */

import type { Beneficiary, Provider } from "@/types"

export interface MatchingResult {
  matchId: string
  donationId: string
  beneficiaryId: string
  providerId: string
  compatibilityScore: number
  matchReason: string
  factors: {
    trustScore: number
    geographicFit: number
    specialization: number
    capacity: number
    responseTime: number
  }
}

/**
 * Calculate geographic fit score between provider and beneficiary location
 * Prefers providers operating in or near the beneficiary's division
 */
function calculateGeographicFit(provider: Provider, beneficiary: Beneficiary): number {
  const providerDivisions = provider.geographicFocus.divisions
  const beneficiaryDivision = beneficiary.location.division

  // Perfect match if provider operates in beneficiary's division
  if (providerDivisions.includes(beneficiaryDivision)) {
    return 100
  }

  // Partial match if provider has nearby operations
  const nearbyDivisions = ["Sylhet", "Dhaka", "Khulna"] // Example proximity groups
  if (providerDivisions.some((d) => nearbyDivisions.includes(d))) {
    return 60
  }

  return 30
}

/**
 * Calculate specialization fit score
 * Higher score if provider specializes in the beneficiary's need category
 */
function calculateSpecializationFit(provider: Provider, beneficiary: Beneficiary): number {
  const needType = beneficiary.needCategory

  // Map beneficiary need categories to provider specialization
  const needToSpecialization: Record<string, string> = {
    shelter: "shelter",
    food: "food",
    medical: "medical",
    education: "education",
    livelihood: "livelihood",
  }

  const requiredSpecialization = needToSpecialization[needType]

  if (provider.specialization.includes(requiredSpecialization)) {
    return 100
  }

  // Partial credit for related specializations
  return 50
}

/**
 * Calculate provider capacity fit
 * Ensures provider has capacity for additional beneficiaries
 */
function calculateCapacityFit(provider: Provider): number {
  const utilizationRate = (provider.totalAidedBeneficiaries / provider.maxActiveBeneficiaries) * 100

  if (utilizationRate < 50) return 100 // Under 50% capacity = perfect
  if (utilizationRate < 80) return 80 // 50-80% = good
  if (utilizationRate < 95) return 50 // 80-95% = limited
  return 10 // Over 95% = strained
}

/**
 * Calculate response time fit score
 * Faster response times get higher scores
 */
function calculateResponseTimeFit(provider: Provider): number {
  if (provider.responseTimeHours <= 4) return 100 // Excellent
  if (provider.responseTimeHours <= 12) return 80 // Good
  if (provider.responseTimeHours <= 24) return 60 // Acceptable
  return 40 // Slow
}

/**
 * Main matching algorithm - finds optimal provider for a beneficiary
 * Uses weighted scoring of multiple factors
 */
export function findOptimalMatch(beneficiary: Beneficiary, candidates: Provider[]): MatchingResult | null {
  if (candidates.length === 0) return null

  const matches = candidates
    .map((provider) => {
      // Calculate individual factor scores (0-100)
      const trustScore = provider.trustScore
      const geographicFit = calculateGeographicFit(provider, beneficiary)
      const specializationFit = calculateSpecializationFit(provider, beneficiary)
      const capacityFit = calculateCapacityFit(provider)
      const responseTimeFit = calculateResponseTimeFit(provider)

      // Weighted combination (trust score weighted most heavily)
      const compatibilityScore = Math.round(
        trustScore * 0.35 + geographicFit * 0.25 + specializationFit * 0.2 + capacityFit * 0.1 + responseTimeFit * 0.1,
      )

      return {
        provider,
        compatibilityScore,
        factors: {
          trustScore,
          geographicFit,
          specialization: specializationFit,
          capacity: capacityFit,
          responseTime: responseTimeFit,
        },
      }
    })
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)

  const bestMatch = matches[0]

  if (!bestMatch || bestMatch.compatibilityScore < 40) {
    return null // No acceptable match found
  }

  return {
    matchId: `match-${Date.now()}`,
    donationId: "",
    beneficiaryId: beneficiary.id,
    providerId: bestMatch.provider.id,
    compatibilityScore: bestMatch.compatibilityScore,
    matchReason: generateMatchReason(bestMatch.provider, bestMatch.factors),
    factors: bestMatch.factors,
  }
}

function generateMatchReason(provider: Provider, factors: Record<string, number>): string {
  const reasons: string[] = []

  if (factors.trustScore >= 80) reasons.push("High-trust provider")
  if (factors.geographicFit === 100) reasons.push("Provider operates in beneficiary's division")
  if (factors.specialization === 100) reasons.push("Provider specializes in this need type")
  if (factors.capacity === 100) reasons.push("Provider has strong capacity")
  if (factors.responseTime === 100) reasons.push("Fast response time")

  return reasons.join(". ") || "Good overall match"
}

/**
 * Batch matching - finds optimal matches for multiple beneficiaries
 * Optimizes overall matching efficiency while respecting provider capacity
 */
export function batchMatch(beneficiaries: Beneficiary[], providers: Provider[]): MatchingResult[] {
  const matches: MatchingResult[] = []
  const providerCapacityRemaining = new Map(
    providers.map((p) => [p.id, p.maxActiveBeneficiaries - p.totalAidedBeneficiaries]),
  )

  // Sort beneficiaries by urgency (critical need first)
  const sortedBeneficiaries = [...beneficiaries].sort((a, b) => {
    const urgencyMap = { critical: 4, emergency: 3, high: 2, medium: 1 }
    return (
      (urgencyMap[b.urgencyLevel as keyof typeof urgencyMap] || 0) -
      (urgencyMap[a.urgencyLevel as keyof typeof urgencyMap] || 0)
    )
  })

  for (const beneficiary of sortedBeneficiaries) {
    // Filter providers with remaining capacity
    const availableProviders = providers.filter((p) => (providerCapacityRemaining.get(p.id) || 0) > 0)

    const match = findOptimalMatch(beneficiary, availableProviders)
    if (match) {
      matches.push(match)
      // Reduce provider's remaining capacity
      const remaining = providerCapacityRemaining.get(match.providerId) || 0
      providerCapacityRemaining.set(match.providerId, remaining - 1)
    }
  }

  return matches
}

/**
 * Donor preference matching - respects donor's provider preferences
 * Filters out providers on donor's negative list, prioritizes positive list
 */
export function respectDonorPreferences(
  allMatches: MatchingResult[],
  donorPreferences?: {
    positive: string[] // Preferred provider IDs
    negative: string[] // Blocked provider IDs
  },
): MatchingResult[] {
  if (!donorPreferences) return allMatches

  // Remove blocked providers
  const filtered = allMatches.filter((m) => !donorPreferences.negative.includes(m.providerId))

  // Sort to prioritize preferred providers
  filtered.sort((a, b) => {
    const aPreferred = donorPreferences.positive.includes(a.providerId)
    const bPreferred = donorPreferences.positive.includes(b.providerId)
    if (aPreferred && !bPreferred) return -1
    if (!aPreferred && bPreferred) return 1
    return b.compatibilityScore - a.compatibilityScore
  })

  return filtered
}
