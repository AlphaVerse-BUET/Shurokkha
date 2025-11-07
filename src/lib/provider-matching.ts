/**
 * Provider Matching & Suggestion Engine
 * Matches beneficiaries with best-suited providers based on:
 * - Crisis type specialization
 * - Geographic location
 * - Provider tier and trust score
 * - Beneficiary preferences (type, organization size, excluded providers)
 * - Provider capacity
 */

import type { Beneficiary, Provider } from "@/types"

export interface ProviderSuggestion {
  providerId: string
  provider: Provider
  matchScore: number // 0-100
  matchReasons: string[]
  factors: {
    specializationMatch: number // 0-100
    geographicProximity: number // 0-100
    trustScore: number // 0-100
    capacityAvailable: number // 0-100
    preferenceAlignment: number // 0-100
  }
}

/**
 * Calculate specialization match between provider and beneficiary need
 */
function calculateSpecializationMatch(provider: Provider, beneficiary: Beneficiary): number {
  const beneficiaryNeed = beneficiary.needCategory
  
  // Map beneficiary needs to provider specialization
  const needToSpecialization: Record<string, string> = {
    shelter: "flood", // Shelter often needed after floods
    food: "poverty",
    medical: "medical",
    education: "education",
    livelihood: "livelihood",
  }
  
  const requiredSpecialization = needToSpecialization[beneficiaryNeed]
  
  // Perfect match if provider specializes in this crisis type
  if (provider.specialization.includes(requiredSpecialization as any)) {
    return 100
  }
  
  // Partial credit for related specializations
  if (provider.specialization.length > 0) {
    return 60
  }
  
  return 30
}

/**
 * Calculate geographic proximity score
 */
function calculateGeographicProximity(provider: Provider, beneficiary: Beneficiary): number {
  const beneficiaryDivision = beneficiary.location.division
  const beneficiaryDistrict = beneficiary.location.district
  
  // Perfect match: provider operates in same division
  if (provider.geographicFocus.divisions.includes(beneficiaryDivision)) {
    return 100
  }
  
  // Good match: provider operates in same district
  if (provider.geographicFocus.districts.includes(beneficiaryDistrict)) {
    return 85
  }
  
  // Fair match: provider operates nearby (neighboring divisions)
  // For simplicity, assign 50 if any geographic presence
  if (provider.geographicFocus.divisions.length > 0 || provider.geographicFocus.districts.length > 0) {
    return 50
  }
  
  return 20
}

/**
 * Calculate preference alignment score
 */
function calculatePreferenceAlignment(
  provider: Provider,
  beneficiary: Beneficiary,
  preferences: any
): number {
  let score = 50 // Base score
  
  if (!preferences) return score
  
  // Positive provider preference
  if (preferences.positive?.includes(provider.id)) {
    score += 30
  }
  
  // Negative provider preference (excluded)
  if (preferences.negative?.includes(provider.id)) {
    return 0 // Completely excluded
  }
  
  // Type preference (NGO vs Volunteer)
  if (preferences.preferredTypes?.length > 0) {
    if (preferences.preferredTypes.includes(provider.registrationType)) {
      score += 15
    } else {
      score -= 10
    }
  }
  
  // Organization size preference mapping
  const organizationSizeMap: Record<string, string> = {
    large: "ngo", // Large NGOs
    medium: "ngo",
    small: "volunteer",
    religious: "ngo",
    government: "ngo",
  }
  
  if (preferences.preferredOrganizationSizes?.length > 0) {
    // Rough estimation based on trust score and maturity
    let estimatedSize = "medium"
    if (provider.trustScore >= 80 && provider.yearsActive >= 5) {
      estimatedSize = "large"
    } else if (provider.trustScore < 50 || provider.yearsActive < 3) {
      estimatedSize = "small"
    }
    
    if (preferences.preferredOrganizationSizes.includes(estimatedSize)) {
      score += 10
    }
  }
  
  // Specialization preference
  if (preferences.preferredSpecializations?.length > 0) {
    const hasPreferredSpecialization = provider.specialization.some((spec) =>
      preferences.preferredSpecializations.includes(spec)
    )
    if (hasPreferredSpecialization) {
      score += 15
    }
  }
  
  // Trust score threshold
  if (preferences.minTrustScore && provider.trustScore < preferences.minTrustScore) {
    return 0 // Does not meet minimum trust score
  }
  
  return Math.min(100, score)
}

/**
 * Calculate capacity availability score
 */
function calculateCapacityScore(provider: Provider): number {
  const utilizationRate = (provider.totalAidedBeneficiaries / provider.maxActiveBeneficiaries) * 100
  
  if (utilizationRate < 50) return 100 // Well under capacity
  if (utilizationRate < 70) return 85 // Comfortable capacity
  if (utilizationRate < 90) return 60 // Limited capacity
  if (utilizationRate < 100) return 30 // Very limited capacity
  return 0 // At or over capacity
}

/**
 * Main provider suggestion algorithm
 * Returns sorted list of suggested providers
 */
export function suggestProviders(
  beneficiary: Beneficiary,
  providers: Provider[],
  preferences?: any,
  limit: number = 5
): ProviderSuggestion[] {
  // Filter out suspended/banned providers
  const activeProviders = providers.filter((p) => p.status === "active" && p.verified)
  
  const suggestions = activeProviders
    .map((provider) => {
      const specializationMatch = calculateSpecializationMatch(provider, beneficiary)
      const geographicProximity = calculateGeographicProximity(provider, beneficiary)
      const trustScore = provider.trustScore
      const capacityAvailable = calculateCapacityScore(provider)
      const preferenceAlignment = calculatePreferenceAlignment(provider, beneficiary, preferences)
      
      // If preference alignment is 0 (excluded), skip this provider
      if (preferenceAlignment === 0) {
        return null
      }
      
      // Weighted calculation
      const matchScore = Math.round(
        specializationMatch * 0.35 +
        geographicProximity * 0.25 +
        trustScore * 0.2 +
        capacityAvailable * 0.1 +
        preferenceAlignment * 0.1
      )
      
      const matchReasons: string[] = []
      
      if (specializationMatch >= 80) {
        matchReasons.push(`Specializes in ${beneficiary.needCategory}`)
      }
      if (geographicProximity === 100) {
        matchReasons.push(`Operates in ${beneficiary.location.division}`)
      } else if (geographicProximity >= 80) {
        matchReasons.push(`Has presence in ${beneficiary.location.division}`)
      }
      if (trustScore >= 80) {
        matchReasons.push("High trust score")
      }
      if (capacityAvailable >= 80) {
        matchReasons.push("Strong capacity available")
      }
      if (provider.badges.length > 0) {
        matchReasons.push(`Verified with ${provider.badges.length} badges`)
      }
      
      return {
        providerId: provider.id,
        provider,
        matchScore,
        matchReasons,
        factors: {
          specializationMatch,
          geographicProximity,
          trustScore,
          capacityAvailable,
          preferenceAlignment,
        },
      }
    })
    .filter((s): s is ProviderSuggestion => s !== null)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
  
  return suggestions
}

/**
 * Get top provider suggestion
 */
export function getTopProviderSuggestion(
  beneficiary: Beneficiary,
  providers: Provider[],
  preferences?: any
): ProviderSuggestion | null {
  const suggestions = suggestProviders(beneficiary, providers, preferences, 1)
  return suggestions.length > 0 ? suggestions[0] : null
}

/**
 * Filter providers based on preferences
 */
export function filterProvidersByPreferences(
  providers: Provider[],
  preferences: any
): Provider[] {
  return providers.filter((provider) => {
    // Exclude blocked providers
    if (preferences.negative?.includes(provider.id)) {
      return false
    }
    
    // Type filter
    if (preferences.preferredTypes?.length > 0) {
      if (!preferences.preferredTypes.includes(provider.registrationType)) {
        return false
      }
    }
    
    // Specialization filter
    if (preferences.preferredSpecializations?.length > 0) {
      const hasPreferredSpecialization = provider.specialization.some((spec) =>
        preferences.preferredSpecializations.includes(spec)
      )
      if (!hasPreferredSpecialization) {
        return false
      }
    }
    
    // Trust score threshold
    if (preferences.minTrustScore && provider.trustScore < preferences.minTrustScore) {
      return false
    }
    
    // Status check
    if (provider.status !== "active" || !provider.verified) {
      return false
    }
    
    return true
  })
}
