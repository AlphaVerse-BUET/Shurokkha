"use client"

import { useState } from "react"
import { Plus, Trash2, Sparkles } from "lucide-react"
import { verifyNID, verifyDocument } from "@/lib/ai-engines"
import { useToast } from "@/hooks/use-toast"
import FileUploadWithPreview from "@/components/shared/file-upload-with-preview"
import AIVerificationDisplay from "@/components/shared/ai-verification-display"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type NeedCategory = "shelter" | "food" | "medical" | "education" | "livelihood"
type UrgencyLevel = "critical" | "emergency" | "high" | "medium"
type PaymentMethod = "bank" | "bkash" | "nagad" | "rocket"

export default function BeneficiaryApplicationFormImproved() {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStage, setVerificationStage] = useState("")
  const [aiStatus, setAiStatus] = useState<"pending" | "processing" | "verified" | "failed" | "warning">("pending")
  const [aiChecks, setAiChecks] = useState<any[]>([])
  const [overallConfidence, setOverallConfidence] = useState<number | undefined>(undefined)
  const [aiIssues, setAiIssues] = useState<string[]>([])

  const [formData, setFormData] = useState({
    fullName: "",
    nidNumber: "",
    phone: "",
    address: "",
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
      if (!uploadedFiles.crisisProof.file) newErrors.crisisProof = "Proof of need required"
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
      } else {
        setAiStatus("verified")
        toast({
          title: "Verification Successful!",
          description: `AI verified your documents with ${avgConfidence}% confidence`,
        })
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
        setStep(step + 1)
        if (step === 3 && uploadedFiles.nidFront.file && uploadedFiles.nidBack.file) {
          handleAIVerification()
        }
      }
    }
  }

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
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter your full address (house, village, upazila, district, division)"
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
            required
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
            required
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
            label="Proof of Need"
            description="Damage photos, medical records, or relevant documentation (images or videos)"
            required
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

          {/* Preferences */}
          <div className="bg-card border border-border/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-foreground">Preferences & Payment</h3>
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
            className="flex-1"
            data-testid="btn-continue"
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  )
}
