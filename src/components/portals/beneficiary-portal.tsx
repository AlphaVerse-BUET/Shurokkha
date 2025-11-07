"use client"

import { useState } from "react"
import { useAppStore } from "@/store/app-store"
import BeneficiaryApplicationFormImproved from "@/components/beneficiary/application-form-improved"
import BeneficiaryStatusTracking from "@/components/beneficiary/status-tracking"
import BeneficiaryPrivacyControls from "@/components/beneficiary/privacy-controls"
import BeneficiaryDashboard from "@/components/portals/beneficiary-dashboard"
import { FileText, Clock, Shield, Home, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function BeneficiaryPortal() {
  const { currentUser } = useAppStore()
  const [activeTab, setActiveTab] = useState<"dashboard" | "apply" | "status" | "privacy">("dashboard")

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-accent/5">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                Beneficiary Portal
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Protected
                </Badge>
              </h1>
              <p className="text-sm text-foreground/60 mt-1">Hello, {currentUser?.name || "Guest"}</p>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="flex gap-2 overflow-x-auto pb-4">
            {[
              { id: "dashboard", label: "Dashboard", icon: Home },
              { id: "apply", label: "New Application", icon: FileText },
              { id: "status", label: "Track Application", icon: Clock },
              { id: "privacy", label: "Privacy Controls", icon: Shield },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === id
                    ? "bg-accent text-accent-foreground"
                    : "bg-card border border-border/50 text-foreground/70 hover:border-accent/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && <BeneficiaryDashboard />}
        {activeTab === "apply" && <BeneficiaryApplicationFormImproved />}
        {activeTab === "status" && <BeneficiaryStatusTracking />}
        {activeTab === "privacy" && <BeneficiaryPrivacyControls />}
      </div>
    </div>
  )
}
