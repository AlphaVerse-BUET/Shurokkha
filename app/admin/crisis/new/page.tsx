"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/app-store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle } from "lucide-react"

const CRISIS_TYPES = ["flood", "cyclone", "earthquake", "fire", "medical", "education", "poverty", "displacement"]
const DIVISIONS = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh"]
const SEVERITY_LEVELS = [
  { value: 90, label: "Critical", color: "bg-red-600" },
  { value: 75, label: "High", color: "bg-orange-600" },
  { value: 60, label: "Medium", color: "bg-yellow-600" },
  { value: 40, label: "Low", color: "bg-green-600" },
]

export default function NewCrisisPage() {
  const router = useRouter()
  const { isAuthenticated, currentRole } = useAppStore()
  const [submitted, setSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    severity: 75,
    division: "",
    district: "",
    affectedPopulation: "",
    fundingNeeded: "",
    urgency: "high",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isAuthenticated || currentRole !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">Only admins can create crises</p>
          <Button onClick={() => router.push("/auth/login?role=admin")}>Login as Admin</Button>
        </Card>
      </div>
    )
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.type) newErrors.type = "Crisis type is required"
    if (!formData.division) newErrors.division = "Division is required"
    if (!formData.district.trim()) newErrors.district = "District is required"
    if (!formData.affectedPopulation || Number(formData.affectedPopulation) <= 0)
      newErrors.affectedPopulation = "Valid affected population is required"
    if (!formData.fundingNeeded || Number(formData.fundingNeeded) <= 0)
      newErrors.fundingNeeded = "Valid funding amount is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    console.log("[v0] Creating new crisis:", formData)
    setSubmitted(true)

    setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-green-500/5">
        <Card className="p-12 text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Crisis Created Successfully</h2>
          <p className="text-muted-foreground mb-4">The crisis has been added to the platform</p>
          <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-background to-red-900/5">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create New Crisis</h1>
          <p className="text-muted-foreground">Add a new crisis to the platform for donor matching</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="p-8 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-bold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Crisis Title <span className="text-red-600">*</span>
                  </label>
                  <Input
                    placeholder="e.g., Sylhet Flood Relief 2024"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    placeholder="Describe the crisis situation, impact, and needs..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${
                      errors.description ? "border-red-500" : "border-border"
                    }`}
                    rows={4}
                  />
                  {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Crisis Type <span className="text-red-600">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {CRISIS_TYPES.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, type })}
                          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            formData.type === type
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background border-border hover:border-primary/50"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    {errors.type && <p className="text-xs text-red-600 mt-1">{errors.type}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Severity Level <span className="text-red-600">*</span>
                    </label>
                    <div className="space-y-2">
                      {SEVERITY_LEVELS.map((level) => (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, severity: level.value })}
                          className={`w-full px-3 py-2 rounded-lg border text-sm font-medium transition-colors flex items-center justify-between ${
                            formData.severity === level.value
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background border-border hover:border-primary/50"
                          }`}
                        >
                          <span>{level.label}</span>
                          <div className={`w-3 h-3 rounded-full ${level.color}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-xl font-bold mb-4">Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Division <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className={`w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.division ? "border-red-500" : "border-border"
                    }`}
                  >
                    <option value="">Select Division</option>
                    {DIVISIONS.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                  {errors.division && <p className="text-xs text-red-600 mt-1">{errors.division}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    District <span className="text-red-600">*</span>
                  </label>
                  <Input
                    placeholder="e.g., Sunamganj"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className={errors.district ? "border-red-500" : ""}
                  />
                  {errors.district && <p className="text-xs text-red-600 mt-1">{errors.district}</p>}
                </div>
              </div>
            </div>

            {/* Impact & Funding */}
            <div>
              <h2 className="text-xl font-bold mb-4">Impact & Funding</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Affected Population <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 50000"
                    value={formData.affectedPopulation}
                    onChange={(e) => setFormData({ ...formData, affectedPopulation: e.target.value })}
                    className={errors.affectedPopulation ? "border-red-500" : ""}
                  />
                  {errors.affectedPopulation && (
                    <p className="text-xs text-red-600 mt-1">{errors.affectedPopulation}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Funding Needed (BDT) <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 5000000"
                    value={formData.fundingNeeded}
                    onChange={(e) => setFormData({ ...formData, fundingNeeded: e.target.value })}
                    className={errors.fundingNeeded ? "border-red-500" : ""}
                  />
                  {errors.fundingNeeded && <p className="text-xs text-red-600 mt-1">{errors.fundingNeeded}</p>}
                </div>
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="text-sm font-medium mb-2 block">Urgency Level</label>
              <div className="flex gap-2">
                {["low", "medium", "high", "critical"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, urgency: level })}
                    className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${
                      formData.urgency === level
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:border-primary/50"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Create Crisis
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </main>
  )
}
