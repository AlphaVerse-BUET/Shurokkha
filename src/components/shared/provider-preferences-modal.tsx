"use client"

import { useState } from "react"
import {
  Check,
  X,
  Heart,
  Ban,
  Filter,
  Shield,
  Building2,
  Zap,
  Users,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { mockProviders } from "@/store/mock-data"

interface ProviderPreferencesModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (preferences: any) => void
  initialPreferences?: any
  title?: string
  description?: string
}

const CRISIS_TYPES = ["flood", "fire", "medical", "education", "livelihood", "poverty"]
const ORGANIZATION_TYPES = [
  { value: "ngo", label: "NGO", icon: Building2 },
  { value: "volunteer", label: "Volunteer Group", icon: Users },
]
const ORGANIZATION_SIZES = [
  { value: "large", label: "Large Organizations", description: "50+ staff, established" },
  { value: "medium", label: "Medium Organizations", description: "20-50 staff, growing" },
  { value: "small", label: "Small Organizations", description: "5-20 staff" },
]

export default function ProviderPreferencesModal({
  isOpen,
  onClose,
  onSave,
  initialPreferences,
  title = "Provider Preferences",
  description = "Customize your provider preferences to match your needs and values",
}: ProviderPreferencesModalProps) {
  const [activeTab, setActiveTab] = useState<"providers" | "types" | "specialization" | "filters">("providers")
  const [preferences, setPreferences] = useState(
    initialPreferences || {
      positive: [],
      negative: [],
      preferredTypes: [],
      preferredOrganizationSizes: [],
      preferredSpecializations: [],
      minTrustScore: 0,
    }
  )

  const toggleProvider = (providerId: string, type: "positive" | "negative") => {
    setPreferences((prev: any) => {
      const list = prev[type] || []
      if (list.includes(providerId)) {
        return {
          ...prev,
          [type]: list.filter((id: string) => id !== providerId),
        }
      } else {
        const otherType = type === "positive" ? "negative" : "positive"
        const otherList = prev[otherType] || []
        return {
          ...prev,
          [type]: [...list, providerId],
          [otherType]: otherList.filter((id: string) => id !== providerId),
        }
      }
    })
  }

  const toggleType = (value: string) => {
    setPreferences((prev: any) => {
      const types = prev.preferredTypes || []
      return {
        ...prev,
        preferredTypes: types.includes(value) ? types.filter((t: string) => t !== value) : [...types, value],
      }
    })
  }

  const toggleSpecialization = (value: string) => {
    setPreferences((prev: any) => {
      const specs = prev.preferredSpecializations || []
      return {
        ...prev,
        preferredSpecializations: specs.includes(value) ? specs.filter((s: string) => s !== value) : [...specs, value],
      }
    })
  }

  const toggleOrganizationSize = (value: string) => {
    setPreferences((prev: any) => {
      const sizes = prev.preferredOrganizationSizes || []
      return {
        ...prev,
        preferredOrganizationSizes: sizes.includes(value)
          ? sizes.filter((s: string) => s !== value)
          : [...sizes, value],
      }
    })
  }

  const handleTrustScoreChange = (score: number) => {
    setPreferences((prev: any) => ({
      ...prev,
      minTrustScore: score,
    }))
  }

  const handleSave = () => {
    onSave(preferences)
    onClose()
  }

  const handleReset = () => {
    setPreferences({
      positive: [],
      negative: [],
      preferredTypes: [],
      preferredOrganizationSizes: [],
      preferredSpecializations: [],
      minTrustScore: 0,
    })
  }

  const positiveCount = (preferences.positive || []).length
  const negativeCount = (preferences.negative || []).length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl max-h-[85vh] flex flex-col p-0">
        <div className="shrink-0 sticky top-0 bg-background border-b border-border/50 px-6 py-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="text-xs">{description}</DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="shrink-0 overflow-x-auto border-b border-border/50">
            <div className="flex gap-2 px-6">
              <button
                onClick={() => setActiveTab("providers")}
                className={`py-3 px-4 font-medium border-b-2 transition whitespace-nowrap text-sm ${
                  activeTab === "providers"
                    ? "border-accent text-accent"
                    : "border-transparent text-foreground/60 hover:text-foreground"
                }`}
              >
                <Heart className="w-4 h-4 inline mr-2" />
                Providers
              </button>
              <button
                onClick={() => setActiveTab("types")}
                className={`py-3 px-4 font-medium border-b-2 transition whitespace-nowrap text-sm ${
                  activeTab === "types"
                    ? "border-accent text-accent"
                    : "border-transparent text-foreground/60 hover:text-foreground"
                }`}
              >
                <Building2 className="w-4 h-4 inline mr-2" />
                Types
              </button>
              <button
                onClick={() => setActiveTab("specialization")}
                className={`py-3 px-4 font-medium border-b-2 transition whitespace-nowrap text-sm ${
                  activeTab === "specialization"
                    ? "border-accent text-accent"
                    : "border-transparent text-foreground/60 hover:text-foreground"
                }`}
              >
                <Zap className="w-4 h-4 inline mr-2" />
                Specialization
              </button>
              <button
                onClick={() => setActiveTab("filters")}
                className={`py-3 px-4 font-medium border-b-2 transition whitespace-nowrap text-sm ${
                  activeTab === "filters"
                    ? "border-accent text-accent"
                    : "border-transparent text-foreground/60 hover:text-foreground"
                }`}
              >
                <Filter className="w-4 h-4 inline mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Providers Tab */}
            {activeTab === "providers" && (
              <div className="space-y-4">
                {positiveCount > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                      <Heart className="w-4 h-4 text-green-500" />
                      Preferred ({positiveCount})
                    </h4>
                    <div className="space-y-2">
                      {mockProviders
                        .filter((p) => (preferences.positive || []).includes(p.id))
                        .map((provider) => (
                          <Card key={provider.id} className="p-3 flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{provider.organizationName}</p>
                              <p className="text-xs text-foreground/60">Trust: {provider.trustScore}%</p>
                            </div>
                            <button
                              onClick={() => toggleProvider(provider.id, "positive")}
                              className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}

                {negativeCount > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                      <Ban className="w-4 h-4 text-red-500" />
                      Excluded ({negativeCount})
                    </h4>
                    <div className="space-y-2">
                      {mockProviders
                        .filter((p) => (preferences.negative || []).includes(p.id))
                        .map((provider) => (
                          <Card key={provider.id} className="p-3 flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{provider.organizationName}</p>
                              <p className="text-xs text-foreground/60">Trust: {provider.trustScore}%</p>
                            </div>
                            <button
                              onClick={() => toggleProvider(provider.id, "negative")}
                              className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-3 text-sm">All Providers</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {mockProviders.map((provider) => {
                      const isPreferred = (preferences.positive || []).includes(provider.id)
                      const isExcluded = (preferences.negative || []).includes(provider.id)

                      return (
                        <Card
                          key={provider.id}
                          className={`p-3 cursor-pointer transition text-sm ${
                            isPreferred
                              ? "bg-green-50 border-green-200"
                              : isExcluded
                                ? "bg-red-50 border-red-200"
                                : "hover:bg-accent/5"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium">{provider.organizationName}</p>
                              <p className="text-xs text-foreground/60 line-clamp-1">{provider.description}</p>
                            </div>
                            <div className="flex gap-2 ml-2 shrink-0">
                              <button
                                onClick={() => toggleProvider(provider.id, "positive")}
                                className={`p-2 rounded-lg transition ${
                                  isPreferred ? "bg-green-500 text-white" : "hover:bg-green-100 text-foreground/60"
                                }`}
                              >
                                <Heart className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toggleProvider(provider.id, "negative")}
                                className={`p-2 rounded-lg transition ${
                                  isExcluded ? "bg-red-500 text-white" : "hover:bg-red-100 text-foreground/60"
                                }`}
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Organization Type Tab */}
            {activeTab === "types" && (
              <div className="space-y-3">
                {ORGANIZATION_TYPES.map((type) => {
                  const Icon = type.icon
                  return (
                    <Card
                      key={type.value}
                      className={`p-4 cursor-pointer transition border-2 text-sm ${
                        (preferences.preferredTypes || []).includes(type.value)
                          ? "border-accent bg-accent/5"
                          : "border-border/50 hover:border-accent/50"
                      }`}
                      onClick={() => toggleType(type.value)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <p className="font-medium">{type.label}</p>
                        </div>
                        {(preferences.preferredTypes || []).includes(type.value) && (
                          <Check className="w-5 h-5 text-accent" />
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Specialization Tab */}
            {activeTab === "specialization" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {CRISIS_TYPES.map((type) => (
                    <Card
                      key={type}
                      className={`p-3 cursor-pointer transition border-2 text-center text-sm ${
                        (preferences.preferredSpecializations || []).includes(type)
                          ? "border-accent bg-accent/5"
                          : "border-border/50 hover:border-accent/50"
                      }`}
                      onClick={() => toggleSpecialization(type)}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium capitalize flex-1">{type}</p>
                        {(preferences.preferredSpecializations || []).includes(type) && (
                          <Check className="w-4 h-4 text-accent ml-2" />
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Filters Tab */}
            {activeTab === "filters" && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3 text-sm">Organization Size</h4>
                  <div className="space-y-2">
                    {ORGANIZATION_SIZES.map((size) => (
                      <Card
                        key={size.value}
                        className={`p-3 cursor-pointer transition border-2 text-sm ${
                          (preferences.preferredOrganizationSizes || []).includes(size.value)
                            ? "border-accent bg-accent/5"
                            : "border-border/50 hover:border-accent/50"
                        }`}
                        onClick={() => toggleOrganizationSize(size.value)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{size.label}</p>
                            <p className="text-xs text-foreground/60">{size.description}</p>
                          </div>
                          {(preferences.preferredOrganizationSizes || []).includes(size.value) && (
                            <Check className="w-5 h-5 text-accent shrink-0" />
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4" />
                    Minimum Trust Score
                  </h4>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={preferences.minTrustScore || 0}
                      onChange={(e) => handleTrustScoreChange(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-foreground/60">
                      Only show providers with trust score ≥ {preferences.minTrustScore || 0}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="shrink-0 flex gap-3 border-t border-border/50 p-6">
          <Button variant="outline" onClick={handleReset} className="flex-1 text-sm">
            Reset
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1 text-sm">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 text-sm">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
