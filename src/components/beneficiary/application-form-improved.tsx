"use client"

import { useState, useMemo } from "react"
import { Plus, Trash2, Sparkles, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import FileUploadWithPreview from "@/components/shared/file-upload-with-preview"
import AIVerificationDisplay from "@/components/shared/ai-verification-display"
import ProviderPreferencesModal from "@/components/shared/provider-preferences-modal"
import ProviderSuggestionCard from "@/components/shared/provider-suggestion-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockProviders } from "@/store/mock-data"
import { suggestProviders } from "@/lib/provider-matching"

type NeedCategory = "shelter" | "food" | "medical" | "education" | "livelihood"
type UrgencyLevel = "critical" | "emergency" | "high" | "medium"
type PaymentMethod = "bank" | "bkash" | "nagad" | "rocket"

interface DocumentVerificationResult {
  verified: boolean
  confidence: number
  issues: string[]
  details: {
    formatValid: boolean
    documentTampering: boolean
    duplicateDetected: boolean
    faceMatch?: number
    livenessCheck?: boolean
  }
}

// Mock AI verification functions (would call actual AI engines in production)
async function verifyNID(
  nidNumber: string,
  nidImage: string,
  selfieImage?: string
): Promise<DocumentVerificationResult> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))
  
  return {
    verified: true,
    confidence: 87 + Math.random() * 10,
    issues: [],
    details: {
      formatValid: true,
      documentTampering: false,
      duplicateDetected: false,
      faceMatch: selfieImage ? 88 + Math.random() * 10 : undefined,
      livenessCheck: selfieImage ? true : undefined,
    },
  }
}

async function verifyDocument(
  documentType: "medical" | "address" | "income" | "damage",
  documentImage: string
): Promise<DocumentVerificationResult> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))
  
  return {
    verified: true,
    confidence: 87,
    issues: [],
    details: {
      formatValid: true,
      documentTampering: false,
      duplicateDetected: false,
    },
  }
}

export default function BeneficiaryApplicationFormImproved() {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStage, setVerificationStage] = useState("")
  const [aiStatus, setAiStatus] = useState<"pending" | "processing" | "verified" | "failed" | "warning">("pending")
  const [aiChecks, setAiChecks] = useState<any[]>([])
  const [overallConfidence, setOverallConfidence] = useState<number | undefined>(undefined)
  const [aiIssues, setAiIssues] = useState<string[]>([])
  const [showPreferencesModal, setShowPreferencesModal] = useState(false)
  const [selectedProviderFromSuggestion, setSelectedProviderFromSuggestion] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    fullName: "",
    nidNumber: "",
    phone: "",
    address: "",
    locationDivision: "Dhaka" as string,
    needCategory: "shelter" as NeedCategory,
    urgencyLevel: "high" as UrgencyLevel,
    needDescription: "",
    amountRequested: "",
    itemizedBreakdown: [{ item: "", cost: "" }],
    familySize: "",
    dependents: "",
    incomeSources: "",
    paymentMethod: "bkash" as PaymentMethod,
    accountNumber: "",
    geographicPreference: "local" as "local" | "national",
    organizationSizePreference: "medium" as any,
    privacyMode: "limited" as "anonymous" | "limited" | "full",
    providerPreference: {
      positive: [],
      negative: [],
      preferredTypes: [],
      preferredOrganizationSizes: [],
      preferredSpecializations: [],
      minTrustScore: 0,
    },
  })

  const [uploadedFiles, setUploadedFiles] = useState<{
    nidFront: { file: File | null; preview: string | null; aiResult?: any }
    nidBack: { file: File | null; preview: string | null; aiResult?: any }
    crisisProof: { file: File | null; preview: string | null; aiResult?: any }
    addressProof: { file: File | null; preview: string | null; aiResult?: any }
    profileImage: { file: File | null; preview: string | null; aiResult?: any }
  }>({
    nidFront: { file: null, preview: null },
    nidBack: { file: null, preview: null },
    crisisProof: { file: null, preview: null },
    addressProof: { file: null, preview: null },
    profileImage: { file: null, preview: null },
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (stepNum: number) => {
    const newErrors: Record<string, string> = {}

    if (stepNum === 1) {
      if (!formData.fullName) newErrors.fullName = "Full name is required"
      if (!formData.nidNumber || formData.nidNumber.length < 10) newErrors.nidNumber = "Valid NID is required"
      if (!formData.phone) newErrors.phone = "Phone number is required"
      if (!formData.address) newErrors.address = "Address is required"
      if (!formData.familySize || Number(formData.familySize) <= 0) newErrors.familySize = "Family size required"
    } else if (stepNum === 2) {
      if (!formData.needDescription) newErrors.needDescription = "Please describe your need"
      const total = formData.itemizedBreakdown.reduce((sum, item) => sum + (Number(item.cost) || 0), 0)
      if (total <= 0) newErrors.amountRequested = "Total amount must be greater than 0"
      if (formData.itemizedBreakdown.some((item) => !item.item || !item.cost))
        newErrors.itemized = "All items must have description and cost"
    } else if (stepNum === 3) {
      if (!uploadedFiles.nidFront.file) newErrors.nidFront = "NID front photo required"
      if (!uploadedFiles.nidBack.file) newErrors.nidBack = "NID back photo required"
      // Proof of need is now optional for testing
      // if (!uploadedFiles.crisisProof.file) newErrors.crisisProof = "Proof of need required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddItem = () => {
    setFormData({
      ...formData,
      itemizedBreakdown: [...formData.itemizedBreakdown, { item: "", cost: "" }],
    })
  }

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      itemizedBreakdown: formData.itemizedBreakdown.filter((_, i) => i !== index),
    })
  }

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...formData.itemizedBreakdown]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, itemizedBreakdown: newItems })
  }

  const totalAmount = formData.itemizedBreakdown.reduce((sum, item) => sum + (Number(item.cost) || 0), 0)

  const handleAIVerification = async () => {
    if (!formData.nidNumber || !uploadedFiles.nidFront.file || !uploadedFiles.nidBack.file) {
      toast({
        title: "Missing Information",
        description: "Please provide NID number and upload NID photos",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)
    setAiStatus("processing")
    setAiChecks([])
    setAiIssues([])

    try {
      // Step 1: NID Format Validation
      setVerificationStage("Validating NID format...")
      await new Promise((resolve) => setTimeout(resolve, 800))
      setAiChecks((prev) => [
        ...prev,
        {
          label: "NID Format Validation",
          status: "pass",
          confidence: 98,
          details: "NID number format is valid",
        },
      ])

      // Step 2: Document Authenticity
      setVerificationStage("Checking document authenticity...")
      const nidResult = await verifyNID(formData.nidNumber, uploadedFiles.nidFront.preview || "", uploadedFiles.profileImage.preview || "")
      
      setUploadedFiles((prev) => ({
        ...prev,
        nidFront: { ...prev.nidFront, aiResult: nidResult },
        nidBack: { ...prev.nidBack, aiResult: nidResult },
      }))

      setAiChecks((prev) => [
        ...prev,
        {
          label: "Document Authenticity",
          status: nidResult.verified ? "pass" : "fail",
          confidence: nidResult.confidence,
          details: nidResult.verified ? "NID verified against government database" : "Issues found in NID verification",
        },
      ])

      if (!nidResult.verified) {
        setAiIssues((prev) => [...prev, ...nidResult.issues])
      }

      // Step 3: Face Matching (if profile image exists)
      if (uploadedFiles.profileImage.file && nidResult.details.faceMatch) {
        setVerificationStage("Performing face matching...")
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const faceMatchScore = nidResult.details.faceMatch
        setAiChecks((prev) => [
          ...prev,
          {
            label: "Face Matching",
            status: faceMatchScore >= 85 ? "pass" : faceMatchScore >= 70 ? "warning" : "fail",
            confidence: faceMatchScore,
            details: `Face match confidence: ${faceMatchScore}%`,
          },
        ])

        if (faceMatchScore < 85) {
          setAiIssues((prev) => [...prev, `Face matching confidence below threshold: ${faceMatchScore}%`])
        }
      }

      // Step 4: Crisis Proof Verification
      if (uploadedFiles.crisisProof.file) {
        setVerificationStage("Verifying crisis proof documents...")
        const crisisProofResult = await verifyDocument("damage", uploadedFiles.crisisProof.preview || "")
        
        setUploadedFiles((prev) => ({
          ...prev,
          crisisProof: { ...prev.crisisProof, aiResult: crisisProofResult },
        }))

        setAiChecks((prev) => [
          ...prev,
          {
            label: "Crisis Proof Verification",
            status: crisisProofResult.verified ? "pass" : "warning",
            confidence: crisisProofResult.confidence,
            details: "Crisis documentation analyzed",
          },
        ])
      }

      // Step 5: Duplicate Detection
      setVerificationStage("Checking for duplicates...")
      await new Promise((resolve) => setTimeout(resolve, 800))
      const isDuplicate = Math.random() > 0.9 // 10% chance of duplicate
      setAiChecks((prev) => [
        ...prev,
        {
          label: "Duplicate Detection",
          status: isDuplicate ? "fail" : "pass",
          confidence: isDuplicate ? 95 : 100,
          details: isDuplicate ? "NID found in another active application" : "No duplicates found",
        },
      ])

      if (isDuplicate) {
        setAiIssues((prev) => [...prev, "This NID is already associated with another active application"])
      }

      // Calculate overall confidence
      const avgConfidence = Math.round(
        aiChecks.reduce((sum, check) => sum + (check.confidence || 0), nidResult.confidence) /
          (aiChecks.length + 1)
      )
      setOverallConfidence(avgConfidence)

      // Determine final status
      const hasFailures = aiChecks.some((c) => c.status === "fail") || !nidResult.verified || isDuplicate
      const hasWarnings = aiChecks.some((c) => c.status === "warning")

      if (hasFailures) {
        setAiStatus("failed")
        toast({
          title: "Verification Failed",
          description: "Critical issues found. Please review and correct.",
          variant: "destructive",
        })
      } else if (hasWarnings) {
        setAiStatus("warning")
        toast({
          title: "Verification Warning",
          description: "Some checks need attention. You can still proceed.",
        })
        // Auto-move to step 4 after a brief delay for warnings
        setTimeout(() => setStep(4), 1500)
      } else {
        setAiStatus("verified")
        toast({
          title: "Verification Successful!",
          description: `AI verified your documents with ${avgConfidence}% confidence`,
        })
        // Auto-move to step 4 after a brief delay
        setTimeout(() => setStep(4), 1500)
      }
    } catch (error) {
      setAiStatus("failed")
      toast({
        title: "Verification Error",
        description: "Failed to verify documents. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
      setVerificationStage("")
    }
  }

  const handleContinue = () => {
    if (validateStep(step)) {
      if (step < 4) {
        // For step 3, we need to run AI verification first
        if (step === 3 && uploadedFiles.nidFront.file && uploadedFiles.nidBack.file) {
          handleAIVerification()
        } else {
          // For other steps, move to next step directly
          setStep(step + 1)
        }
      }
    }
  }

  // Allow moving to step 4 after AI verification completes
  const canProceedToStep4 = aiStatus === "verified" || aiStatus === "warning"

  const handleSubmit = () => {
    toast({
      title: "Application Submitted!",
      description: "Your application is being processed. You'll receive SMS updates.",
    })
    // In real app: submit to backend
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress indicator */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              s <= step ? "bg-accent" : "bg-border/50"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Personal Information */}
      {step === 1 && (
        <div className="bg-card border border-border/50 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-foreground">Personal Information</h3>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="w-3 h-3" />
              Step 1 of 4
            </Badge>
          </div>

          <FileUploadWithPreview
            label="Profile Photo (Optional)"
            description="Upload a recent photo for better verification"
            accept="image/*"
            onFileSelect={(file, preview) => {
              setUploadedFiles((prev) => ({
                ...prev,
                profileImage: { file, preview },
              }))
            }}
            existingFile={uploadedFiles.profileImage.preview}
          />

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Enter your full name as per NID"
              className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                errors.fullName ? "border-red-500/50" : "border-border/50"
              }`}
              data-testid="input-full-name"
            />
            {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              NID Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nidNumber}
              onChange={(e) => setFormData({ ...formData, nidNumber: e.target.value })}
              placeholder="Enter your 10-17 digit NID"
              className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                errors.nidNumber ? "border-red-500/50" : "border-border/50"
              }`}
              data-testid="input-nid-number"
            />
            {errors.nidNumber && <p className="text-xs text-red-600 mt-1">{errors.nidNumber}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+88017XXXXXXXX"
                className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                  errors.phone ? "border-red-500/50" : "border-border/50"
                }`}
                data-testid="input-phone"
              />
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Family Size <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.familySize}
                onChange={(e) => setFormData({ ...formData, familySize: e.target.value })}
                placeholder="Number of members"
                className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                  errors.familySize ? "border-red-500/50" : "border-border/50"
                }`}
                data-testid="input-family-size"
              />
              {errors.familySize && <p className="text-xs text-red-600 mt-1">{errors.familySize}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Division <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.locationDivision}
              onChange={(e) => setFormData({ ...formData, locationDivision: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              data-testid="select-division"
            >
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Khulna">Khulna</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Barisal">Barisal</option>
              <option value="Rangpur">Rangpur</option>
              <option value="Mymensingh">Mymensingh</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter your full address (house, village, upazila, district)"
              rows={3}
              className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                errors.address ? "border-red-500/50" : "border-border/50"
              }`}
              data-testid="input-address"
            />
            {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
          </div>
        </div>
      )}

      {/* Step 2: Need Details */}
      {step === 2 && (
        <div className="bg-card border border-border/50 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-foreground">Describe Your Need</h3>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="w-3 h-3" />
              Step 2 of 4
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Need Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.needCategory}
                onChange={(e) => setFormData({ ...formData, needCategory: e.target.value as NeedCategory })}
                className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                data-testid="select-need-category"
              >
                <option value="shelter">Shelter / Housing</option>
                <option value="food">Food / Nutrition</option>
                <option value="medical">Medical / Healthcare</option>
                <option value="education">Education</option>
                <option value="livelihood">Livelihood / Income</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Urgency Level <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.urgencyLevel}
                onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value as UrgencyLevel })}
                className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                data-testid="select-urgency-level"
              >
                <option value="critical">Critical (24h review)</option>
                <option value="emergency">Emergency (3-day review)</option>
                <option value="high">High (7-day review)</option>
                <option value="medium">Medium (14-day review)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Describe Your Situation <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.needDescription}
              onChange={(e) => setFormData({ ...formData, needDescription: e.target.value })}
              placeholder="Explain your situation in detail - why you need help, who is affected, any special circumstances"
              rows={4}
              className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                errors.needDescription ? "border-red-500/50" : "border-border/50"
              }`}
              data-testid="input-need-description"
            />
            {errors.needDescription && <p className="text-xs text-red-600 mt-1">{errors.needDescription}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-semibold text-foreground">
                Itemized Breakdown <span className="text-red-500">*</span>
              </label>
              <Button
                type="button"
                onClick={handleAddItem}
                variant="outline"
                size="sm"
                className="gap-1"
                data-testid="btn-add-item"
              >
                <Plus className="w-3 h-3" />
                Add Item
              </Button>
            </div>

            <div className="space-y-2">
              {formData.itemizedBreakdown.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item.item}
                    onChange={(e) => handleItemChange(index, "item", e.target.value)}
                    placeholder="Item description"
                    className="flex-1 px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                    data-testid={`input-item-${index}`}
                  />
                  <input
                    type="number"
                    value={item.cost}
                    onChange={(e) => handleItemChange(index, "cost", e.target.value)}
                    placeholder="Cost (৳)"
                    className="w-32 px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                    data-testid={`input-cost-${index}`}
                  />
                  {formData.itemizedBreakdown.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-500/10"
                      data-testid={`btn-remove-item-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Total Amount Needed:</span>
              <span className="text-2xl font-bold text-accent" data-testid="total-amount">
                ৳{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
          {errors.itemized && <p className="text-xs text-red-600 mt-1">{errors.itemized}</p>}
          {errors.amountRequested && <p className="text-xs text-red-600 mt-1">{errors.amountRequested}</p>}
        </div>
      )}

      {/* Step 3: Documents */}
      {step === 3 && (
        <div className="bg-card border border-border/50 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-foreground">Upload Required Documents</h3>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="w-3 h-3" />
              Step 3 of 4
            </Badge>
          </div>

          <FileUploadWithPreview
            label="NID Front Copy"
            description="Clear photo of your NID front side"
            accept="image/*"
            onFileSelect={(file, preview) => {
              setUploadedFiles((prev) => ({
                ...prev,
                nidFront: { file, preview },
              }))
            }}
            existingFile={uploadedFiles.nidFront.preview}
            error={errors.nidFront}
            aiResult={uploadedFiles.nidFront.aiResult}
          />

          <FileUploadWithPreview
            label="NID Back Copy"
            description="Clear photo of your NID back side"
            accept="image/*"
            onFileSelect={(file, preview) => {
              setUploadedFiles((prev) => ({
                ...prev,
                nidBack: { file, preview },
              }))
            }}
            existingFile={uploadedFiles.nidBack.preview}
            error={errors.nidBack}
            aiResult={uploadedFiles.nidBack.aiResult}
          />

          <FileUploadWithPreview
            label="Proof of Need (Optional - For Testing)"
            description="Damage photos, medical records, or relevant documentation (images or videos)"
            accept="image/*,video/*"
            maxSize={10}
            onFileSelect={(file, preview) => {
              setUploadedFiles((prev) => ({
                ...prev,
                crisisProof: { file, preview },
              }))
            }}
            existingFile={uploadedFiles.crisisProof.preview}
            error={errors.crisisProof}
            aiResult={uploadedFiles.crisisProof.aiResult}
          />

          <FileUploadWithPreview
            label="Address Proof (Optional)"
            description="Utility bill, rental agreement, or chairman certificate"
            accept="image/*,application/pdf"
            onFileSelect={(file, preview) => {
              setUploadedFiles((prev) => ({
                ...prev,
                addressProof: { file, preview },
              }))
            }}
            existingFile={uploadedFiles.addressProof.preview}
          />

          <Button
            onClick={handleAIVerification}
            disabled={isVerifying || !uploadedFiles.nidFront.file || !uploadedFiles.nidBack.file}
            className="w-full gap-2"
            size="lg"
            data-testid="btn-verify-documents"
          >
            {isVerifying ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Verify Documents with AI
              </>
            )}
          </Button>
        </div>
      )}

      {/* Step 4: AI Verification Results & Preferences */}
      {step === 4 && (
        <div className="space-y-6">
          {/* AI Verification Display */}
          <AIVerificationDisplay
            status={aiStatus}
            checks={aiChecks}
            overallConfidence={overallConfidence}
            issues={aiIssues}
            processingStage={verificationStage}
          />

          {/* Provider Suggestions */}
          <ProviderSuggestionsSection
            beneficiary={formData}
            preferences={formData.providerPreference}
            selectedProviderId={selectedProviderFromSuggestion}
            onSelectProvider={(providerId) => setSelectedProviderFromSuggestion(providerId)}
            onCustomizePreferences={() => setShowPreferencesModal(true)}
          />

          {/* Provider Preferences */}
          <div className="bg-card border border-border/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-foreground">Provider Preferences</h3>
                <p className="text-xs text-foreground/60 mt-1">
                  Customize which providers you'd like to work with
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreferencesModal(true)}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Customize
              </Button>
            </div>

            {/* Preferences Summary */}
            <div className="space-y-2">
              {formData.providerPreference?.positive && formData.providerPreference.positive.length > 0 && (
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="text-xs">
                    ❤️ {formData.providerPreference.positive.length} Preferred
                  </Badge>
                </div>
              )}
              {formData.providerPreference?.negative && formData.providerPreference.negative.length > 0 && (
                <div className="flex items-start gap-2">
                  <Badge variant="destructive" className="text-xs">
                    🚫 {formData.providerPreference.negative.length} Excluded
                  </Badge>
                </div>
              )}
              {formData.providerPreference?.preferredTypes &&
                formData.providerPreference.preferredTypes.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Badge variant="secondary" className="text-xs">
                      🏢 Types: {formData.providerPreference.preferredTypes.join(", ")}
                    </Badge>
                  </div>
                )}
              {formData.providerPreference?.minTrustScore &&
                formData.providerPreference.minTrustScore > 0 && (
                  <div className="flex items-start gap-2">
                    <Badge variant="secondary" className="text-xs">
                      🛡️ Min Trust: {formData.providerPreference.minTrustScore}%
                    </Badge>
                  </div>
                )}
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-card border border-border/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-foreground">Payment Details</h3>
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="w-3 h-3" />
                Step 4 of 4
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                  className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  data-testid="select-payment-method"
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="Your account/phone number"
                  className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  data-testid="input-account-number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Privacy Mode</label>
              <select
                value={formData.privacyMode}
                onChange={(e) => setFormData({ ...formData, privacyMode: e.target.value as any })}
                className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                data-testid="select-privacy-mode"
              >
                <option value="anonymous">Anonymous (Only provider sees your info)</option>
                <option value="limited">Limited (Name & location hidden publicly)</option>
                <option value="full">Public (Full profile visible to donors)</option>
              </select>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={aiStatus === "failed"}
              className="w-full"
              size="lg"
              data-testid="btn-submit-application"
            >
              Submit Application
            </Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 1 && (
          <Button
            onClick={() => setStep(step - 1)}
            variant="outline"
            className="flex-1"
            data-testid="btn-back"
          >
            Back
          </Button>
        )}
        {step < 4 && (
          <Button
            onClick={handleContinue}
            disabled={step === 3 && isVerifying}
            className="flex-1"
            data-testid="btn-continue"
          >
            {step === 3 && isVerifying ? "Verifying..." : "Continue"}
          </Button>
        )}
        {step === 4 && aiStatus === "verified" && (
          <Button
            onClick={() => setStep(3)}
            variant="outline"
            className="flex-1"
            data-testid="btn-back-from-step4"
          >
            Back
          </Button>
        )}
      </div>

      {/* Provider Preferences Modal */}
      <ProviderPreferencesModal
        isOpen={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
        onSave={(preferences) => {
          setFormData((prev) => ({
            ...prev,
            providerPreference: preferences,
          }))
        }}
        initialPreferences={formData.providerPreference}
        title="Customize Provider Preferences"
        description="Select which providers you'd like to work with based on your needs and preferences"
      />
    </div>
  )
}

// Provider Suggestions Section Component
function ProviderSuggestionsSection({
  beneficiary,
  preferences,
  selectedProviderId,
  onSelectProvider,
  onCustomizePreferences,
}: {
  beneficiary: any
  preferences: any
  selectedProviderId: string | null
  onSelectProvider: (providerId: string) => void
  onCustomizePreferences?: () => void
}) {
  const suggestions = useMemo(() => {
    // Create a beneficiary-like object from form data for matching
    const beneficiaryData = {
      id: "temp-beneficiary",
      needCategory: beneficiary.needCategory || "shelter",
      location: {
        division: beneficiary.locationDivision || "Dhaka",
        district: "District",
        upazila: "Upazila",
      },
      urgencyLevel: beneficiary.urgencyLevel || "high",
    }

    return suggestProviders(beneficiaryData as any, mockProviders, preferences, 3)
  }, [beneficiary.needCategory, beneficiary.urgencyLevel, beneficiary.locationDivision, preferences])

  if (suggestions.length === 0) {
    return null
  }

  return (
    <div className="bg-card border border-border/50 rounded-lg p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            AI Recommended Providers
          </h3>
          <p className="text-sm text-foreground/60 mt-1">
            Based on your needs and preferences, here are the best providers for you
          </p>
        </div>
        {onCustomizePreferences && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCustomizePreferences}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            Refine
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suggestions.map((suggestion) => (
          <ProviderSuggestionCard
            key={suggestion.providerId}
            suggestion={suggestion}
            onSelect={onSelectProvider}
            isSelected={selectedProviderId === suggestion.providerId}
            showDetails={false}
          />
        ))}
      </div>
    </div>
  )
}
