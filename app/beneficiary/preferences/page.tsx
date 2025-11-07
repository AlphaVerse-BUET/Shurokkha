"use client"

import { useAppStore } from "@/store/app-store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProviderPreferencesModal from "@/components/shared/provider-preferences-modal"

export default function BeneficiaryPreferencesPage() {
  const router = useRouter()
  const { isAuthenticated, currentRole } = useAppStore()
  const [showModal, setShowModal] = useState(false)
  const [preferences, setPreferences] = useState({
    positive: [],
    negative: [],
    preferredTypes: [],
    preferredOrganizationSizes: [],
    preferredSpecializations: [],
    minTrustScore: 0,
  })

  useEffect(() => {
    if (!isAuthenticated || currentRole !== "beneficiary") {
      router.push("/auth/login?role=beneficiary")
    }
  }, [isAuthenticated, currentRole, router])

  const handleSavePreferences = (newPreferences: any) => {
    setPreferences(newPreferences)
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-background to-accent/5">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Provider Preferences</h1>
          <p className="text-muted-foreground">
            Manage which providers you prefer to work with for your aid applications
          </p>
        </div>

        <div className="bg-card border border-border/50 rounded-lg p-8 text-center space-y-6">
          <div>
            <p className="text-foreground/80 mb-4">
              Customize your provider preferences to help match you with the best organizations for your needs.
            </p>
            <p className="text-sm text-foreground/60 mb-6">
              You can select specific providers, filter by organization type, specialization, and minimum trust score.
              These preferences will be used when suggesting providers for your applications.
            </p>
          </div>

          <Button
            onClick={() => setShowModal(true)}
            size="lg"
            className="gap-2"
          >
            <Settings className="w-5 h-5" />
            Manage Provider Preferences
          </Button>

          {/* Preferences Summary */}
          {Object.values(preferences).some((v) => (Array.isArray(v) ? v.length > 0 : v > 0)) && (
            <div className="mt-8 p-6 bg-accent/5 border border-accent/20 rounded-lg space-y-3">
              <h3 className="font-semibold">Current Preferences</h3>
              {preferences.positive && preferences.positive.length > 0 && (
                <p className="text-sm">❤️ {preferences.positive.length} Preferred Provider(s)</p>
              )}
              {preferences.negative && preferences.negative.length > 0 && (
                <p className="text-sm">🚫 {preferences.negative.length} Excluded Provider(s)</p>
              )}
              {preferences.preferredTypes && preferences.preferredTypes.length > 0 && (
                <p className="text-sm">🏢 Preferred Types: {preferences.preferredTypes.join(", ")}</p>
              )}
              {preferences.preferredSpecializations && preferences.preferredSpecializations.length > 0 && (
                <p className="text-sm">
                  🎯 Preferred Specializations: {preferences.preferredSpecializations.join(", ")}
                </p>
              )}
              {preferences.minTrustScore && preferences.minTrustScore > 0 && (
                <p className="text-sm">🛡️ Minimum Trust Score: {preferences.minTrustScore}%</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <ProviderPreferencesModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSavePreferences}
        initialPreferences={preferences}
        title="Manage Provider Preferences"
        description="Customize which providers you'd like to work with based on your needs and preferences"
      />
    </main>
  )
}
