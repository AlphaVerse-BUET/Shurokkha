"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { Provider } from "@/types"
import { AlertCircle, CheckCircle, Plus, Upload } from "lucide-react"

interface ProviderApplicationSubmissionProps {
  provider: Provider
}

export default function ProviderApplicationSubmission({ provider }: ProviderApplicationSubmissionProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    crisis: "",
    beneficiaries: [
      {
        name: "",
        nid: "",
        needDescription: "",
        amount: "",
      },
    ],
    estimatedTimeline: 15,
  })

  const [documentUpload, setDocumentUpload] = useState<Record<string, string>>({
    nidFront: "",
    nidBack: "",
    proofOfNeed: "",
  })

  const addBeneficiary = () => {
    setFormData({
      ...formData,
      beneficiaries: [...formData.beneficiaries, { name: "", nid: "", needDescription: "", amount: "" }],
    })
  }

  const updateBeneficiary = (index: number, field: string, value: string) => {
    const newBeneficiaries = [...formData.beneficiaries]
    newBeneficiaries[index] = { ...newBeneficiaries[index], [field]: value }
    setFormData({ ...formData, beneficiaries: newBeneficiaries })
  }

  const totalAmount = formData.beneficiaries.reduce((sum, b) => sum + (Number(b.amount) || 0), 0)
  const canSubmit = formData.beneficiaries.every((b) => b.name && b.nid && b.amount) && totalAmount > 0

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)

    toast({
      title: "Application Submitted!",
      description: "Your application will be AI-verified within 24 hours",
    })

    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  const handleContinue = () => {
    if (step === 1 && canSubmit) {
      setStep(2)
      toast({
        title: "Step 1 Complete",
        description: `${formData.beneficiaries.length} beneficiaries added`,
      })
    } else if (step === 2) {
      setStep(3)
      toast({
        title: "Documents Ready",
        description: "Review your application before submitting",
      })
    } else if (step === 3) {
      handleSubmit()
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress indicator */}
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-secondary" : "bg-border/50"}`}
          />
        ))}
      </div>

      {/* Step 1: Beneficiary Information */}
      {step === 1 && (
        <div className="bg-card border border-border/50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground">Add Beneficiaries</h3>
          <p className="text-sm text-foreground/70">
            Submit detailed information about the beneficiaries who will receive aid.
          </p>

          {formData.beneficiaries.map((beneficiary, index) => (
            <div key={index} className="border border-border/30 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-foreground">Beneficiary {index + 1}</h4>
                {beneficiary.name && <CheckCircle className="w-4 h-4 text-green-600" />}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={beneficiary.name}
                  onChange={(e) => updateBeneficiary(index, "name", e.target.value)}
                  className="px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
                <input
                  type="text"
                  placeholder="NID Number"
                  value={beneficiary.nid}
                  onChange={(e) => updateBeneficiary(index, "nid", e.target.value)}
                  className="px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>

              <textarea
                placeholder="Need Description (e.g., house destroyed, medical emergency, etc.)"
                value={beneficiary.needDescription}
                onChange={(e) => updateBeneficiary(index, "needDescription", e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-secondary/50"
              />

              <div>
                <label className="block text-xs text-foreground/60 mb-1">Amount Requested (৳)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={beneficiary.amount}
                  onChange={(e) => updateBeneficiary(index, "amount", e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>
            </div>
          ))}

          <button
            onClick={addBeneficiary}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-secondary/50 hover:bg-secondary/5 rounded-lg text-secondary font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Another Beneficiary
          </button>

          <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-3 text-sm text-secondary">
            <p className="font-semibold mb-1">Total Aid Requested: ৳{totalAmount.toLocaleString()}</p>
            <p className="text-xs opacity-80">Make sure amounts match cost breakdown in supporting documents</p>
          </div>
        </div>
      )}

      {/* Step 2: Document Upload */}
      {step === 2 && (
        <div className="bg-card border border-border/50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground">Upload Supporting Documents</h3>
          <p className="text-sm text-foreground/70">Provide NID copies and proof of need for all beneficiaries.</p>

          {formData.beneficiaries.map((beneficiary, index) => (
            <div key={index} className="border border-border/30 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-foreground">{beneficiary.name}</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["nidFront", "nidBack"].map((docType) => (
                  <div key={docType}>
                    <label className="block text-xs font-medium text-foreground/70 mb-2 capitalize">
                      {docType === "nidFront" ? "NID Front" : "NID Back"}
                    </label>
                    <div className="border-2 border-dashed border-border/50 rounded-lg p-4 text-center cursor-pointer hover:bg-background/50 transition-colors">
                      <Upload className="w-6 h-6 text-foreground/40 mx-auto mb-2" />
                      <p className="text-xs text-foreground/60">Click to upload or drag & drop</p>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground/70 mb-2">Proof of Need</label>
                <div className="border-2 border-dashed border-border/50 rounded-lg p-4 text-center cursor-pointer hover:bg-background/50 transition-colors">
                  <Upload className="w-6 h-6 text-foreground/40 mx-auto mb-2" />
                  <p className="text-xs text-foreground/60">Upload damage photos, medical records, or relevant proof</p>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-700 space-y-1">
            <p className="font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Document Requirements
            </p>
            <ul className="text-xs space-y-1 ml-6 list-disc">
              <li>Clear NID photos (front and back)</li>
              <li>Recent damage/proof photos with GPS coordinates</li>
              <li>Medical records if applicable</li>
              <li>All documents must be current and legible</li>
            </ul>
          </div>
        </div>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <div className="bg-card border border-border/50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground">Review & Submit Application</h3>

          <div className="bg-background rounded-lg p-4 space-y-3 border border-border/50">
            <div className="flex justify-between">
              <span className="text-foreground/70">Total Beneficiaries:</span>
              <span className="font-semibold text-foreground">{formData.beneficiaries.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">Total Amount:</span>
              <span className="font-bold text-secondary">৳{totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">Estimated Timeline:</span>
              <span className="font-semibold text-foreground">{formData.estimatedTimeline} days</span>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-sm text-green-700 flex items-start gap-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Ready to submit</p>
              <p className="text-xs mt-1">Your application will be AI-verified within 24 hours</p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-secondary hover:bg-secondary/90 disabled:opacity-50 text-secondary-foreground rounded-lg font-semibold transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-background border border-border/50 hover:bg-card rounded-lg text-foreground font-medium transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={handleContinue}
          disabled={(step === 1 && !canSubmit) || isSubmitting}
          className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/90 disabled:opacity-50 text-secondary-foreground rounded-lg font-medium transition-colors"
        >
          {isSubmitting ? "Submitting..." : step === 3 ? "Submit Application" : "Continue"}
        </button>
      </div>
    </div>
  )
}
