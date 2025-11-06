"use client"

import { mockBeneficiaries } from "@/store/mock-data"
import { CheckCircle, Clock, MapPin, User } from "lucide-react"

export default function BeneficiaryStatusTracking() {
  const beneficiary = mockBeneficiaries[0]

  const statusStages = [
    { status: "submitted", label: "Submitted", completed: true, date: beneficiary.appliedDate },
    { status: "verified", label: "Verified", completed: true, date: "2024-06-06" },
    { status: "matched", label: "Provider Matched", completed: true, date: "2024-06-07" },
    { status: "in-progress", label: "Distribution In Progress", completed: true, date: "2024-06-08" },
    { status: "completed", label: "Completed", completed: true, date: beneficiary.completionDate },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Current Status */}
      <div className="bg-gradient-to-r from-accent/20 to-primary/10 border border-accent/30 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-foreground/70 text-sm">Current Status</p>
            <h2 className="text-3xl font-bold text-accent capitalize">
              {beneficiary.applicationStatus.replace("-", " ")}
            </h2>
          </div>
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
      </div>

      {/* Journey timeline */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-6">Application Journey</h3>

        <div className="space-y-4">
          {statusStages.map((stage, index) => (
            <div key={stage.status} className="flex gap-4">
              {/* Timeline line and dot */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    stage.completed
                      ? "bg-green-600/20 border-green-600 text-green-600"
                      : "bg-border/50 border-border text-foreground/60"
                  }`}
                >
                  {stage.completed ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                {index < statusStages.length - 1 && (
                  <div className={`w-1 flex-1 my-2 ${stage.completed ? "bg-green-600/30" : "bg-border/50"}`} />
                )}
              </div>

              {/* Content */}
              <div className="pb-4">
                <h4 className="font-semibold text-foreground">{stage.label}</h4>
                {stage.completed && (
                  <p className="text-xs text-foreground/60 mt-1">
                    Completed on {new Date(stage.date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Allocation Details */}
      {beneficiary.allocationDate && (
        <div className="bg-card border border-border/50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground">Distribution Details</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-foreground/60 mb-1">Amount Allocated</p>
              <p className="text-2xl font-bold text-primary">৳{beneficiary.amountRequested.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-foreground/60 mb-1">Provider</p>
              <p className="text-lg font-semibold text-foreground">BRAC Khulna</p>
            </div>
          </div>

          <div className="border-t border-border/30 pt-4">
            <p className="text-sm text-foreground/70 mb-3">Distribution Progress</p>
            <div className="space-y-2">
              {[
                "Pre-visit verification",
                "Beneficiary confirmation",
                "Item distribution",
                "Photo documentation",
                "Post-verification",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-600/20 border border-green-600 flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                  </div>
                  <span className="text-sm text-foreground">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {beneficiary.providerRating && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <p className="text-sm font-semibold text-green-700 mb-1">You rated this provider:</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-5 h-5 rounded ${i < beneficiary.providerRating ? "bg-yellow-400" : "bg-border/30"}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Provider info card */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Provider Information</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground/70">Organization</p>
              <p className="font-semibold text-foreground">BRAC Khulna</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground/70">Operating Area</p>
              <p className="font-semibold text-foreground">Khulna, Satkhira Division</p>
            </div>
          </div>
        </div>
      </div>

      {/* SMS Notifications history */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Notification History</h3>
        <div className="space-y-2 text-sm">
          <p className="text-foreground/70">You will receive SMS updates at each stage:</p>
          <ul className="space-y-1 text-foreground/60 text-xs">
            <li>✓ Application submitted confirmation</li>
            <li>✓ AI verification complete</li>
            <li>✓ Provider matched notification</li>
            <li>✓ Distribution date alert</li>
            <li>✓ Funds received confirmation</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
