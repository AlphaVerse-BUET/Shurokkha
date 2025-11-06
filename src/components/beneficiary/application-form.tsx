"use client"

import { useState } from "react"
import { CheckCircle, Upload, Plus, Trash2 } from "lucide-react"

type NeedCategory = "shelter" | "food" | "medical" | "education" | "livelihood"
type UrgencyLevel = "critical" | "emergency" | "high" | "medium"
type PaymentMethod = "bank" | "bkash" | "nagad" | "rocket"

export default function BeneficiaryApplicationForm() {
  const [step, setStep] = useState(1)
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

  const [documents, setDocuments] = useState({
    nidFront: false,
    nidBack: false,
    crisisProof: false,
    addressProof: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (stepNum: number) => {
    const newErrors: Record<string, string> = {}

    if (stepNum === 1) {
      if (!formData.fullName) newErrors.fullName = "Full name is required"
      if (!formData.nidNumber || formData.nidNumber.length < 10) newErrors.nidNumber = "Valid NID is required"
      if (!formData.phone) newErrors.phone = "Phone number is required"
      if (!formData.address) newErrors.address = "Address is required"
    } else if (stepNum === 2) {
      if (!formData.needDescription) newErrors.needDescription = "Please describe your need"
      if (!formData.amountRequested || Number(formData.amountRequested) <= 0)
        newErrors.amountRequested = "Valid amount is required"
      if (formData.itemizedBreakdown.some((item) => !item.item || !item.cost))
        newErrors.itemized = "All items must have description and cost"
      if (!formData.familySize || Number(formData.familySize) <= 0) newErrors.familySize = "Family size required"
    } else if (stepNum === 3) {
      if (!documents.nidFront) newErrors.nidFront = "NID front photo required"
      if (!documents.nidBack) newErrors.nidBack = "NID back photo required"
      if (!documents.crisisProof) newErrors.crisisProof = "Proof of need required"
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

  const handleContinue = () => {
    if (validateStep(step)) {
      if (step < 4) setStep(step + 1)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress indicator */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-accent" : "bg-border/50"}`}
          />
        ))}
      </div>

      {/* Step 1: Personal Information */}
      {step === 1 && (
        <div className="bg-card border border-border/50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground">Personal Information</h3>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Full Name *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Enter your full name"
              className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                errors.fullName ? "border-red-500/50" : "border-border/50"
              }`}
            />
            {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">NID Number *</label>
            <input
              type="text"
              value={formData.nidNumber}
              onChange={(e) => setFormData({ ...formData, nidNumber: e.target.value })}
              placeholder="Enter your 13-digit NID"
              className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                errors.nidNumber ? "border-red-500/50" : "border-border/50"
              }`}
            />
            {errors.nidNumber && <p className="text-xs text-red-600 mt-1">{errors.nidNumber}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+88017XXXXXXXX"
                className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                  errors.phone ? "border-red-500/50" : "border-border/50"
                }`}
              />
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Family Size *</label>
              <input
                type="number"
                value={formData.familySize}
                onChange={(e) => setFormData({ ...formData, familySize: e.target.value })}
                placeholder="Number of family members"
                className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                  errors.familySize ? "border-red-500/50" : "border-border/50"
                }`}
              />
              {errors.familySize && <p className="text-xs text-red-600 mt-1">{errors.familySize}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Address *</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter your full address (house number, village, district, division)"
              rows={3}
              className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                errors.address ? "border-red-500/50" : "border-border/50"
              }`}
            />
            {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
          </div>
        </div>
      )}

      {/* Step 2: Need Details */}
      {step === 2 && (
        <div className="bg-card border border-border/50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground">Describe Your Need</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Need Category *</label>
              <select
                value={formData.needCategory}
                onChange={(e) => setFormData({ ...formData, needCategory: e.target.value as NeedCategory })}
                className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                <option value="shelter">Shelter / Housing</option>
                <option value="food">Food / Nutrition</option>
                <option value="medical">Medical / Healthcare</option>
                <option value="education">Education</option>
                <option value="livelihood">Livelihood / Income</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Urgency Level *</label>
              <select
                value={formData.urgencyLevel}
                onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value as UrgencyLevel })}
                className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                <option value="critical">Critical (24h review)</option>
                <option value="emergency">Emergency (3-day review)</option>
                <option value="high">High (7-day review)</option>
                <option value="medium">Medium (14-day review)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Describe Your Situation *</label>
            <textarea
              value={formData.needDescription}
              onChange={(e) => setFormData({ ...formData, needDescription: e.target.value })}
              placeholder="Explain your situation in detail - why you need help, who is affected, any special circumstances"
              rows={4}
              className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                errors.needDescription ? "border-red-500/50" : "border-border/50"
              }`}
            />
            {errors.needDescription && <p className="text-xs text-red-600 mt-1">{errors.needDescription}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-semibold text-foreground">Itemized Breakdown</label>
              <button
                onClick={handleAddItem}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-accent/10 hover:bg-accent/20 text-accent rounded transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add Item
              </button>
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
                  />
                  <input
                    type="number"
                    value={item.cost}
                    onChange={(e) => handleItemChange(index, "cost", e.target.value)}
                    placeholder="Cost (৳)"
                    className="w-24 px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  {formData.itemizedBreakdown.length > 1 && (
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="p-2 hover:bg-red-500/10 text-red-600 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Total Amount Needed:</span>
              <span className="text-lg font-bold text-accent">৳{totalAmount.toLocaleString()}</span>
            </div>
            <input
              type="hidden"
              value={totalAmount}
              onChange={(e) => setFormData({ ...formData, amountRequested: e.target.value })}
            />
          </div>
          {errors.itemized && <p className="text-xs text-red-600 mt-1">{errors.itemized}</p>}
          {errors.amountRequested && <p className="text-xs text-red-600 mt-1">{errors.amountRequested}</p>}
        </div>
      )}

      {/* Step 3: Documents */}
      {step === 3 && (
        <div className="bg-card border border-border/50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground">Upload Required Documents</h3>

          {[
            { id: "nidFront", label: "NID Front Copy", desc: "Clear photo of NID front side" },
            { id: "nidBack", label: "NID Back Copy", desc: "Clear photo of NID back side" },
            {
              id: "crisisProof",
              label: "Proof of Need",
              desc: "Damage photos, medical records, or relevant documentation",
            },
            {
              id: "addressProof",
              label: "Address Proof (Optional)",
              desc: "Utility bill, rental agreement, or chairman certificate",
            },
          ].map(({ id, label, desc }) => (
            <div key={id}>
              <label className="block text-sm font-semibold text-foreground mb-2">{label}</label>
              <p className="text-xs text-foreground/60 mb-2">{desc}</p>
              <div
                onClick={() => setDocuments({ ...documents, [id]: !documents[id as keyof typeof documents] })}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  documents[id as keyof typeof documents]
                    ? "border-green-500/50 bg-green-500/10"
                    : "border-border/50 hover:border-accent/50 hover:bg-accent/5"
                }`}
              >
                {documents[id as keyof typeof documents] ? (
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-600">Uploaded</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-foreground/40 mx-auto mb-2" />
                    <p className="text-xs text-foreground/60">Click to upload or drag & drop</p>
                  </div>
                )}
              </div>
              {errors[id] && <p className="text-xs text-red-600 mt-1">{errors[id]}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Step 4: Preferences & Review */}
      {step === 4 && (
        <div className="bg-card border border-border/50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground">Preferences & Payment</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Payment Method *</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                <option value="bank">Bank Transfer</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="rocket">Rocket</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Account Number *</label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                placeholder="Your account/phone number"
                className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Privacy Mode</label>
            <select
              value={formData.privacyMode}
              onChange={(e) => setFormData({ ...formData, privacyMode: e.target.value as any })}
              className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              <option value="anonymous">Anonymous (Only provider sees your info)</option>
              <option value="limited">Limited (Name & location hidden publicly)</option>
              <option value="full">Public (Full profile visible to donors)</option>
            </select>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-sm text-green-700 flex gap-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <p>All documents will be AI-verified within 24-48 hours. You will receive SMS updates at each stage.</p>
          </div>

          <button className="w-full px-4 py-3 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg font-semibold transition-colors">
            Submit Application
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 px-4 py-2 bg-background border border-border/50 hover:bg-card rounded-lg text-foreground font-medium transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={handleContinue}
          className="flex-1 px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg font-medium transition-colors"
        >
          {step === 4 ? "Submit Application" : "Continue"}
        </button>
      </div>
    </div>
  )
}
