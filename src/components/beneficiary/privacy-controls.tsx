"use client"

import { useState } from "react"
import { Shield, Eye, EyeOff } from "lucide-react"

export default function BeneficiaryPrivacyControls() {
  const [privacyMode, setPrivacyMode] = useState("limited")
  const [dataAccess, setDataAccess] = useState({
    medical: true,
    income: false,
    familyDetails: false,
  })

  const privacyModes = [
    {
      id: "anonymous",
      label: "Anonymous",
      description: "Your identity is hidden from all public views. Only the matched provider sees your details.",
      icon: EyeOff,
    },
    {
      id: "limited",
      label: "Limited Disclosure",
      description: "Your location and need type are visible. Name and personal details remain private.",
      icon: Eye,
    },
    {
      id: "full",
      label: "Public Profile",
      description: "Your complete profile is visible to donors and providers. Helps build trust but reduces privacy.",
      icon: Shield,
    },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Privacy mode selection */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Privacy Mode</h3>
        <p className="text-sm text-foreground/70 mb-4">
          Choose how much of your information is visible to donors and providers.
        </p>

        <div className="space-y-3">
          {privacyModes.map(({ id, label, description, icon: Icon }) => (
            <label
              key={id}
              className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                privacyMode === id ? "border-primary/50 bg-primary/5" : "border-border/50 hover:border-primary/30"
              }`}
            >
              <input type="radio" checked={privacyMode === id} onChange={() => setPrivacyMode(id)} className="mt-1" />
              <div className="flex-1">
                <p className="font-semibold text-foreground">{label}</p>
                <p className="text-xs text-foreground/60 mt-1">{description}</p>
              </div>
              <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            </label>
          ))}
        </div>
      </div>

      {/* Data access controls */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Data Access</h3>
        <p className="text-sm text-foreground/70 mb-4">Control who can access your sensitive information.</p>

        <div className="space-y-3">
          {[
            { id: "medical", label: "Medical Records", desc: "Shared only with matched providers" },
            { id: "income", label: "Income Details", desc: "Visible to admin for verification" },
            { id: "familyDetails", label: "Family Information", desc: "Used for profiling and matching" },
          ].map(({ id, label, desc }) => (
            <div key={id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground text-sm">{label}</p>
                <p className="text-xs text-foreground/60">{desc}</p>
              </div>
              <button
                onClick={() => setDataAccess({ ...dataAccess, [id]: !dataAccess[id as keyof typeof dataAccess] })}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  dataAccess[id as keyof typeof dataAccess] ? "bg-primary" : "bg-border/50"
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    dataAccess[id as keyof typeof dataAccess] ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Data deletion */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-2">Data Management</h3>
        <p className="text-sm text-foreground/70 mb-4">
          Export your data or request deletion (processed within 30 days).
        </p>
        <div className="flex gap-3">
          <button className="flex-1 px-4 py-2 bg-background border border-border/50 hover:bg-card rounded-lg text-foreground font-medium transition-colors">
            Export My Data
          </button>
          <button className="flex-1 px-4 py-2 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-700 rounded-lg font-medium transition-colors">
            Request Deletion
          </button>
        </div>
      </div>

      {/* Save changes */}
      <button className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors">
        Save Privacy Settings
      </button>
    </div>
  )
}
