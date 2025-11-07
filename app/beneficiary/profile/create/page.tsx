"use client"

import { useAppStore } from "@/store/app-store"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useEffect } from "react"
import Image from "next/image"

export default function CreateBeneficiaryProfilePage() {
  const router = useRouter()
  const { isAuthenticated, currentRole } = useAppStore()
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [profileImage, setProfileImage] = useState<string>(
    "https://api.dicebear.com/7.x/avataaars/svg?seed=beneficiary",
  )
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    nidNumber: "",
    phone: "",
    address: "",
    division: "Dhaka",
    district: "Dhaka",
    familySize: 1,
    dependents: 0,
    dependentDetails: [] as { name: string; age: number; education?: string }[],
    incomeSources: [] as string[],
  })

  useEffect(() => {
    if (!isAuthenticated || currentRole !== "beneficiary") {
      router.push("/auth/login?role=beneficiary")
    }
  }, [isAuthenticated, currentRole, router])

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({ ...prev, fullName: name }))
    if (name) {
      setProfileImage(`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`)
    }
  }

  const addDependent = () => {
    if (formData.dependentDetails.length < formData.dependents) {
      setFormData((prev) => ({
        ...prev,
        dependentDetails: [...prev.dependentDetails, { name: "", age: 0, education: "" }],
      }))
    }
  }

  const updateDependent = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const newDetails = [...prev.dependentDetails]
      newDetails[index] = { ...newDetails[index], [field]: value }
      return { ...prev, dependentDetails: newDetails }
    })
  }

  const addIncomeSource = (source: string) => {
    if (source && !formData.incomeSources.includes(source)) {
      setFormData((prev) => ({ ...prev, incomeSources: [...prev.incomeSources, source] }))
    }
  }

  const incomeOptions = [
    "Agriculture",
    "Day labor",
    "Small business",
    "Livestock",
    "Rickshaw",
    "Domestic work",
    "Teaching",
    "Healthcare",
  ]

  const handleSubmit = () => {
    console.log("[v0] Creating beneficiary profile:", formData)
    router.push("/beneficiary/apply?profileCreated=true")
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-background to-accent/5 pb-12">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Your Profile</h1>
          <p className="text-muted-foreground">Complete your profile before applying for aid - takes 5 minutes</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`flex-1 h-2 rounded-full transition ${step >= num ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>

        <Card className="p-8 space-y-6">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
              </div>

              {/* Profile Picture Preview */}
              <div className="flex justify-center">
                <div className="relative w-32 h-32">
                  <Image
                    src={profileImage || "/placeholder.svg"}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="rounded-full border-4 border-primary"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Full Name *</label>
                  <Input
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Age *</label>
                    <Input
                      type="number"
                      placeholder="Age"
                      value={formData.age}
                      onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone *</label>
                    <Input
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">NID Number *</label>
                  <Input
                    placeholder="National ID number"
                    value={formData.nidNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, nidNumber: e.target.value }))}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    📸 In production: Upload NID front/back with AI verification
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location & Address */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Location & Address</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Address *</label>
                  <Input
                    placeholder="House number, street, village"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Division *</label>
                    <Select
                      value={formData.division}
                      onValueChange={(val) => setFormData((prev) => ({ ...prev, division: val }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Dhaka",
                          "Chittagong",
                          "Sylhet",
                          "Khulna",
                          "Rajshahi",
                          "Barisal",
                          "Rangpur",
                          "Mymensingh",
                        ].map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">District *</label>
                    <Input
                      placeholder="Your district"
                      value={formData.district}
                      onChange={(e) => setFormData((prev) => ({ ...prev, district: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                  📍 Location helps us match you with nearby providers for faster aid delivery
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Family Information */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Family Information</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Family Size *</label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Number of people in family"
                      value={formData.familySize}
                      onChange={(e) => setFormData((prev) => ({ ...prev, familySize: Number(e.target.value) }))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Dependents *</label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Number of dependents"
                      value={formData.dependents}
                      onChange={(e) => setFormData((prev) => ({ ...prev, dependents: Number(e.target.value) }))}
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Dependent Details */}
                {formData.dependents > 0 && (
                  <div className="border rounded-lg p-4 space-y-3">
                    <h3 className="font-bold">Dependent Details</h3>
                    {Array.from({ length: Math.min(formData.dependents, 3) }).map((_, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          placeholder="Name"
                          value={formData.dependentDetails[idx]?.name || ""}
                          onChange={(e) => updateDependent(idx, "name", e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Age"
                          className="w-20"
                          value={formData.dependentDetails[idx]?.age || ""}
                          onChange={(e) => updateDependent(idx, "age", e.target.value)}
                        />
                        <Input
                          placeholder="School/Work"
                          value={formData.dependentDetails[idx]?.education || ""}
                          onChange={(e) => updateDependent(idx, "education", e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Income Sources */}
                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-bold">Income Sources (Select all that apply)</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {incomeOptions.map((source) => (
                      <button
                        key={source}
                        onClick={() => addIncomeSource(source)}
                        className={`p-2 rounded border text-sm transition ${
                          formData.incomeSources.includes(source)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:border-primary"
                        }`}
                      >
                        {source}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.incomeSources.map((source) => (
                      <Badge key={source} variant="secondary">
                        {source}
                        <button
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              incomeSources: prev.incomeSources.filter((s) => s !== source),
                            }))
                          }
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Confirm */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Review Your Profile</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 bg-muted">
                    <div className="text-xs text-muted-foreground">Name</div>
                    <div className="font-bold text-sm">{formData.fullName || "N/A"}</div>
                  </Card>
                  <Card className="p-4 bg-muted">
                    <div className="text-xs text-muted-foreground">Location</div>
                    <div className="font-bold text-sm">
                      {formData.district}, {formData.division}
                    </div>
                  </Card>
                  <Card className="p-4 bg-muted">
                    <div className="text-xs text-muted-foreground">Family Size</div>
                    <div className="font-bold text-sm">{formData.familySize} people</div>
                  </Card>
                </div>

                <Card className="p-4 border-green-200 bg-green-50">
                  <div className="flex gap-3">
                    <div className="text-2xl">✓</div>
                    <div>
                      <div className="font-bold">Profile Complete!</div>
                      <p className="text-sm text-muted-foreground">
                        You're ready to apply for aid. Your profile will be visible to verified providers.
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>✓ Your profile information is encrypted and securely stored</p>
                  <p>✓ Only matched providers can see your personal details</p>
                  <p>✓ You can update your profile anytime</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-2 pt-6 border-t">
            {step > 1 && (
              <Button onClick={() => setStep((step - 1) as 1 | 2 | 3 | 4)} variant="outline" className="flex-1">
                ← Back
              </Button>
            )}
            {step < 4 ? (
              <Button
                onClick={() => setStep((step + 1) as 1 | 2 | 3 | 4)}
                disabled={
                  (step === 1 && !formData.fullName) ||
                  (step === 2 && !formData.address) ||
                  (step === 3 && formData.dependents > formData.dependentDetails.length)
                }
                className="flex-1"
              >
                Next →
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
                Create Profile & Apply
              </Button>
            )}
          </div>
        </Card>
      </div>
    </main>
  )
}
