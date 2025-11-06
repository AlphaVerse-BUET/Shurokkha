"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle, XCircle, TrendingUp } from "lucide-react"

const mockFraudAlerts = [
  {
    id: "alert-1",
    type: "duplicate-nid",
    severity: "high",
    description: "Same NID used by 3 different beneficiaries (fuzzy name matching detected)",
    targetId: "beneficiary-1",
    evidence: [
      "NID: 1234567890123 - Amina Begum",
      "NID: 1234567890123 - Amina Begum 2",
      "NID: 1234567890123 - Amina B",
    ],
    status: "open",
    createdAt: "2024-06-15T10:30:00Z",
  },
  {
    id: "alert-2",
    type: "cost-outlier",
    severity: "medium",
    description: "Provider 'ABC Relief' submitted costs 65% above regional average for shelter",
    targetId: "provider-3",
    evidence: [
      "Average shelter cost: ৳8,000/family",
      "Submitted cost: ৳13,200/family",
      "Regional median: ৳8,500/family",
    ],
    status: "investigating",
    createdAt: "2024-06-14T14:20:00Z",
  },
  {
    id: "alert-3",
    type: "gps-mismatch",
    severity: "high",
    description: "Beneficiary location in Dhaka but submitted from Chittagong IP",
    targetId: "beneficiary-3",
    evidence: ["Stated location: Dhaka Sadar", "Submission IP: Chittagong", "Distance: ~280km"],
    status: "resolved",
    createdAt: "2024-06-13T09:15:00Z",
  },
  {
    id: "alert-4",
    type: "deepfake",
    severity: "critical",
    description: "Potential deepfake detected in distribution photo - facial artifacts detected",
    targetId: "donation-1",
    evidence: ["Artifact score: 0.87", "Lighting inconsistency detected", "Metadata manipulation suspected"],
    status: "investigating",
    createdAt: "2024-06-15T11:45:00Z",
  },
]

const mockBlacklist = [
  {
    id: "blacklist-1",
    nid: "9999999999999",
    reason: "Confirmed fraud - duplicate applications with fabricated documents",
    fraudType: "document forgery",
    addedDate: "2024-05-10",
    addedBy: "Admin - Sarah",
  },
  {
    id: "blacklist-2",
    phone: "+8801900000000",
    reason: "Network fraud ring - coordinated multiple applications same day",
    fraudType: "network fraud",
    addedDate: "2024-05-05",
    addedBy: "System",
  },
]

export default function AdminFraudDetection() {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null)
  const [filterBySeverity, setFilterBySeverity] = useState("all")

  const filteredAlerts = mockFraudAlerts.filter(
    (alert) => filterBySeverity === "all" || alert.severity === filterBySeverity,
  )

  const getSeverityColor = (severity: string) => {
    if (severity === "critical") return "bg-red-500/20 text-red-700 border-red-500/30"
    if (severity === "high") return "bg-orange-500/20 text-orange-700 border-orange-500/30"
    return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30"
  }

  const getStatusIcon = (status: string) => {
    if (status === "open") return <AlertTriangle className="w-4 h-4" />
    if (status === "investigating") return <TrendingUp className="w-4 h-4" />
    if (status === "resolved") return <CheckCircle className="w-4 h-4" />
    return <XCircle className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      {/* Fraud alerts summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-xs text-foreground/60 mb-1">Open Alerts</p>
          <p className="text-3xl font-bold text-red-600">{mockFraudAlerts.filter((a) => a.status === "open").length}</p>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
          <p className="text-xs text-foreground/60 mb-1">Investigating</p>
          <p className="text-3xl font-bold text-orange-600">
            {mockFraudAlerts.filter((a) => a.status === "investigating").length}
          </p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-xs text-foreground/60 mb-1">Resolved</p>
          <p className="text-3xl font-bold text-green-600">
            {mockFraudAlerts.filter((a) => a.status === "resolved").length}
          </p>
        </div>
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <p className="text-xs text-foreground/60 mb-1">Blacklisted</p>
          <p className="text-3xl font-bold text-foreground">{mockBlacklist.length}</p>
        </div>
      </div>

      {/* Real-time alerts */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-foreground">Real-Time Fraud Alerts</h3>
          <select
            value={filterBySeverity}
            onChange={(e) => setFilterBySeverity(e.target.value)}
            className="px-3 py-1 bg-background border border-border/50 rounded text-sm text-foreground focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
          </select>
        </div>

        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => setSelectedAlert(selectedAlert === alert.id ? null : alert.id)}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(alert.status)}
                    <p className="font-semibold text-sm">{alert.description}</p>
                  </div>
                  <p className="text-xs opacity-70 ml-6">ID: {alert.targetId}</p>
                </div>
                <span className="text-xs font-medium uppercase px-2 py-1 bg-black/10 rounded">{alert.status}</span>
              </div>

              {selectedAlert === alert.id && (
                <div className="mt-4 pt-4 border-t border-current/30 space-y-2 text-xs">
                  <div>
                    <p className="font-semibold mb-1">Evidence:</p>
                    <ul className="list-disc ml-5 space-y-1 opacity-80">
                      {alert.evidence.map((ev, idx) => (
                        <li key={idx}>{ev}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded transition-colors text-xs font-medium">
                      Investigate
                    </button>
                    <button className="flex-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded transition-colors text-xs font-medium">
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Blacklist management */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Blacklist Management</h3>
        <div className="space-y-3">
          {mockBlacklist.map((entry) => (
            <div key={entry.id} className="border border-red-500/30 bg-red-500/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-foreground">
                    {entry.nid ? `NID: ${entry.nid}` : `Phone: ${entry.phone}`}
                  </p>
                  <p className="text-xs text-foreground/70 mt-1">{entry.reason}</p>
                </div>
                <div className="text-right text-xs text-foreground/60">
                  <p className="font-medium">{entry.fraudType}</p>
                  <p>Added: {entry.addedDate}</p>
                </div>
              </div>
              <button className="text-xs px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-700 rounded transition-colors">
                Remove from Blacklist
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Fraud prevention stats */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
        <h3 className="text-lg font-bold text-green-700 mb-4">Fraud Prevention Impact</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">৳50-100Cr</p>
            <p className="text-xs text-green-700 mt-1">Estimated fraud prevented annually</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">&lt;1%</p>
            <p className="text-xs text-green-700 mt-1">Actual fraud rate (vs 20-30% traditional)</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">98%</p>
            <p className="text-xs text-green-700 mt-1">Detection accuracy through AI</p>
          </div>
        </div>
      </div>
    </div>
  )
}
