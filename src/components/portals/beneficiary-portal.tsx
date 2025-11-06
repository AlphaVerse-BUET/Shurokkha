"use client"

import { useState } from "react"
import { useAppStore } from "@/store/app-store"
import BeneficiaryApplicationForm from "@/components/beneficiary/application-form"
import BeneficiaryStatusTracking from "@/components/beneficiary/status-tracking"
import BeneficiaryPrivacyControls from "@/components/beneficiary/privacy-controls"
import { FileText, Clock, Shield, LogOut } from "lucide-react"

export default function BeneficiaryPortal() {
  const { currentUser, logout } = useAppStore()
  const [activeTab, setActiveTab] = useState<"apply" | "status" | "privacy">("apply")

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Beneficiary Portal</h1>
              <p className="text-sm text-foreground/60 mt-1">Hello, {currentUser?.name}</p>
            </div>
            <button
              onClick={() => logout()}
              className="flex items-center gap-2 px-4 py-2 hover:bg-card border border-border/50 rounded-lg text-foreground/70 hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>

          {/* Tab navigation */}
          <div className="flex gap-2 overflow-x-auto pb-4">
            {[
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "apply" && <BeneficiaryApplicationForm />}
        {activeTab === "status" && <BeneficiaryStatusTracking />}
        {activeTab === "privacy" && <BeneficiaryPrivacyControls />}
      </div>
    </div>
  )
}
