"use client"

import { useAppStore } from "@/store/app-store"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Heart, Ban } from "lucide-react"

export default function PreferencesPage() {
  const router = useRouter()
  const { isAuthenticated, currentRole } = useAppStore()
  const [preferences, setPreferences] = useState({
    positive: ["donor-1"],
    negative: [],
  })

  useEffect(() => {
    if (!isAuthenticated || currentRole !== "provider") {
      router.push("/auth/login?role=provider")
    }
  }, [isAuthenticated, currentRole, router])

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Donor Preferences</h1>
          <p className="text-muted-foreground">Manage your donor relationships and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-bold">Trusted Donors</h2>
            </div>
            <div className="space-y-2 text-sm">
              {preferences.positive.map((donorId) => (
                <div
                  key={donorId}
                  className="p-3 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center"
                >
                  <span className="font-medium">{donorId}</span>
                  <button className="text-xs text-red-600 hover:text-red-700">Remove</button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Ban className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-bold">Blocked Donors</h2>
            </div>
            <div className="space-y-2 text-sm">
              {preferences.negative.length === 0 && <p className="text-muted-foreground">No blocked donors yet</p>}
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
