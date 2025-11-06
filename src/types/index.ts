// User roles and authentication
export type UserRole = "donor" | "provider" | "beneficiary" | "admin" | "guest"

export interface User {
  id: string
  role: UserRole
  name: string
  email: string
  phone: string
  profileImage?: string
  verified: boolean
  createdAt: string
}

// Crisis types
export type CrisisType = "flood" | "fire" | "medical" | "poverty" | "education" | "livelihood"
export type SeverityLevel = "low" | "medium" | "high" | "critical"
export type CrisisStatus = "emerging" | "active" | "recovery" | "resolved"

export interface Crisis {
  id: string
  title: string
  description: string
  type: CrisisType
  location: {
    division: string
    district: string
    upazila: string
    coordinates: { lat: number; lng: number }
  }
  severity: number // 0-100
  affectedPopulation: number
  fundingNeeded: number // in BDT
  fundingReceived: number
  status: CrisisStatus
  verified: boolean
  verificationStatus: "ai-verified" | "community-validated" | "under-review"
  evidenceImages: string[]
  newsLinks: string[]
  satelliteData?: string
  createdAt: string
  updatedAt: string
  trending: boolean
  upvotes: number
  downvotes: number
}

// Donations
export type DonationStatus = "pending" | "provider-accepted" | "in-progress" | "completed" | "verified" | "refunded"

export interface Donation {
  id: string
  donorId: string
  crisisId: string
  amount: number
  message?: string
  status: DonationStatus
  providerPreference?: {
    positive: string[] // Preferred provider IDs
    negative: string[] // Excluded provider IDs
    geographicFocus?: string
    crisisTypeFilter?: CrisisType[]
  }
  allocations: BeneficiaryAllocation[]
  createdAt: string
  refundSettings: {
    autoRefund: boolean
    refundDays?: number
  }
  transactionFee: number // 2.5%
}

export interface BeneficiaryAllocation {
  id: string
  donationId: string
  beneficiaryId: string
  providerId: string
  allocatedAmount: number
  status: DonationStatus
  distributionProof?: DistributionProof
  createdAt: string
}

// Providers (NGOs)
export type ProviderTier = "new" | "established" | "trusted"

export interface Provider {
  id: string
  organizationName: string
  registrationType: "ngo" | "volunteer"
  email: string
  phone: string
  websiteUrl?: string
  description: string
  profileImage?: string

  // Verification documents
  registrationCertificate: string
  bankStatement: string
  officeAddressProof: string
  portfolioImages: string[]
  leadershipNIDCopies: string[]
  references: {
    organizationName: string
    contactPerson: string
    email: string
  }[]

  // Performance metrics
  trustScore: number // 0-100
  completionRate: number
  averageRating: number
  responseTimeHours: number
  yearsActive: number
  fraudIncidents: number

  // Operational info
  specialization: CrisisType[]
  geographicFocus: {
    divisions: string[]
    districts: string[]
  }
  maxActiveBeneficiaries: number
  monthlyFundCap: number
  totalAidedBeneficiaries: number

  // Status
  verified: boolean
  status: "active" | "watchlist" | "suspended" | "banned"
  badges: ("zero-fraud" | "quick-responder" | "100-families" | "5-year-verified")[]

  createdAt: string
  lastActivityAt: string
}

// Beneficiaries
export type UrgencyLevel = "critical" | "emergency" | "high" | "medium"
export type NeedCategory = "shelter" | "food" | "medical" | "education" | "livelihood"

export interface Beneficiary {
  id: string
  nidNumber: string
  nidFrontImage: string
  nidBackImage: string
  fullName: string
  phone: string
  address: string
  location: {
    division: string
    district: string
    upazila: string
    coordinates: { lat: number; lng: number }
  }

  // Application info
  needCategory: NeedCategory
  needDescription: string
  amountRequested: number
  urgencyLevel: UrgencyLevel
  itemizedBreakdown: { item: string; cost: number }[]

  // Crisis-specific proof
  crisisProofImages: string[]
  medicalRecords?: string
  incomeStatement?: string

  // Family info
  familySize: number
  dependents: number
  incomeSources: string[]

  // Preferences
  organizationSizePreference?: "large" | "medium" | "small" | "religious" | "government"
  geographicPreference?: "local" | "national"
  providerPreference?: {
    positive: string[]
    negative: string[]
  }

  // Payment method
  paymentMethod: "bank" | "bkash" | "nagad" | "rocket"
  accountNumber: string

  // Status
  applicationStatus: "submitted" | "verified" | "matched" | "in-progress" | "completed"
  verificationStatus: "pending" | "verified" | "rejected"
  privacyMode: "anonymous" | "limited" | "full"

  // Ratings
  providerRating?: number
  providerFeedback?: string

  // Tracking
  appliedDate: string
  allocationDate?: string
  completionDate?: string
  lastApplicationDate?: string
}

// Distribution verification
export interface DistributionProof {
  id: string
  allocationId: string

  // Before distribution
  preSiteVisitPhotos: string[]
  beneficiaryConsentForm: boolean

  // During distribution
  distributionPhotos: string[]
  distributionVideos: string[]
  itemsVerified: { item: string; quantity: number }[]
  beneficiarySignature: string

  // After distribution
  postDistributionPhotos: string[]
  receiptImages: string[]
  bankTransferScreenshots?: string[]
  beneficiaryConfirmationSMS: boolean

  // Metadata
  gpsCoordinates: { lat: number; lng: number }
  timestamp: string
  distributionDate: string

  // AI Verification
  deepfakeDetection: boolean
  faceMatchScore: number // 0-100
  gpsValidation: boolean
  imageQualityScore: number // 0-100
  verificationStatus: "pending" | "verified" | "flagged"
}

// Admin/Fraud detection
export interface FraudAlert {
  id: string
  type:
    | "duplicate-nid"
    | "cost-outlier"
    | "suspicious-pattern"
    | "gps-mismatch"
    | "deepfake"
    | "network-fraud"
    | "collusion"
  targetId: string // Beneficiary, Provider, or Donation ID
  targetType: "beneficiary" | "provider" | "donation"
  severity: "low" | "medium" | "high" | "critical"
  description: string
  evidence: string[]
  status: "open" | "investigating" | "resolved" | "dismissed"
  createdAt: string
  resolvedAt?: string
  resolvedBy?: string
}

export interface BlacklistEntry {
  id: string
  nid?: string
  phone?: string
  bankAccount?: string
  email?: string
  fraudType: string
  reason: string
  evidence: string[]
  addedDate: string
  addedBy: string
}

// Global state
export interface AppState {
  currentUser?: User
  currentRole: UserRole
  isAuthenticated: boolean
}
