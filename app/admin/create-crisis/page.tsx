"use client"

import type React from "react"

import { useAppStore } from "@/store/app-store"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect } from "react"
import type { CrisisType } from "@/types"

const CRISIS_TYPES: CrisisType[] = ["flood", "fire", "medical", "poverty", "education", "livelihood"]
const DIVISIONS = ["Dhaka", "Chittagong", "Sylhet", "Khulna", "Rajshahi", "Barisal", "Rangpur", "Mymensingh"]

export default function CreateCrisisPage() {
  const router = useRouter()
  const { isAuthenticated, currentRole } = useAppStore()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "flood" as CrisisType,
    division: "Dhaka",
    district: "Dhaka",
    severity: 50,
    affectedPopulation: 0,
    fundingNeeded: 0,
  })

  useEffect(() => {
    if (!isAuthenticated || currentRole !== "admin") {
      router.push("/auth/login?role=admin")
    }
  }, [isAuthenticated, currentRole, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Creating crisis:", formData)
    router.push("/dashboard")
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create New Crisis</h1>
          <p className="text-muted-foreground">Manually add a crisis to the platform</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Crisis Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Sylhet Monsoon Flooding"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the crisis"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as CrisisType }))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {CRISIS_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Division</label>
                <select
                  value={formData.division}
                  onChange={(e) => setFormData((prev) => ({ ...prev, division: e.target.value }))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {DIVISIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Severity (0-100)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.severity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, severity: Number(e.target.value) }))}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Affected Population</label>
                <Input
                  type="number"
                  value={formData.affectedPopulation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, affectedPopulation: Number(e.target.value) }))}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Funding Needed (৳)</label>
                <Input
                  type="number"
                  value={formData.fundingNeeded}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fundingNeeded: Number(e.target.value) }))}
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Create Crisis
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  )
}
