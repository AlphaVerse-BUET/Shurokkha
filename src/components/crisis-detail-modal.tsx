"use client"

import { useState } from "react"
import { mockCrises } from "@/store/mock-data"
import { X, ThumbsUp, ThumbsDown, MapPin, Users, TrendingUp, Calendar, Zap } from "lucide-react"

interface CrisisDetailModalProps {
  crisisId: string
  onClose: () => void
  onDonate: () => void
}

export default function CrisisDetailModal({ crisisId, onClose, onDonate }: CrisisDetailModalProps) {
  const crisis = mockCrises.find((c) => c.id === crisisId)
  const [upvoted, setUpvoted] = useState(false)
  const [downvoted, setDownvoted] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!crisis) return null

  const fundingPercentage = (crisis.fundingReceived / crisis.fundingNeeded) * 100

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border/50 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-foreground truncate flex-1">{crisis.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-background/80 rounded-lg transition-colors ml-2">
            <X className="w-5 h-5 text-foreground/60" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Image carousel */}
          {crisis.evidenceImages.length > 0 && (
            <div className="space-y-2">
              <img
                src={crisis.evidenceImages[currentImageIndex] || "/placeholder.svg?height=300&width=500&query=crisis"}
                alt={`Evidence ${currentImageIndex + 1}`}
                className="w-full h-64 object-cover rounded-lg border border-border/50"
              />
              {crisis.evidenceImages.length > 1 && (
                <div className="flex justify-center gap-2">
                  {crisis.evidenceImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentImageIndex ? "bg-primary" : "bg-border/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Key metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-card border border-border/50 rounded-lg p-3 text-center">
              <div className="text-sm text-foreground/60 flex items-center justify-center gap-1 mb-1">
                <Zap className="w-4 h-4" />
                Severity
              </div>
              <div className="text-2xl font-bold text-primary">{crisis.severity}</div>
            </div>
            <div className="bg-card border border-border/50 rounded-lg p-3 text-center">
              <div className="text-sm text-foreground/60 flex items-center justify-center gap-1 mb-1">
                <Users className="w-4 h-4" />
                Affected
              </div>
              <div className="text-lg font-bold text-foreground">{(crisis.affectedPopulation / 1000).toFixed(0)}K</div>
            </div>
            <div className="bg-card border border-border/50 rounded-lg p-3 text-center">
              <div className="text-sm text-foreground/60 flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4" />
                Funded
              </div>
              <div className="text-lg font-bold text-accent">{fundingPercentage.toFixed(0)}%</div>
            </div>
            <div className="bg-card border border-border/50 rounded-lg p-3 text-center">
              <div className="text-sm text-foreground/60 flex items-center justify-center gap-1 mb-1">
                <Calendar className="w-4 h-4" />
                Gap
              </div>
              <div className="text-lg font-bold text-red-600">
                ৳{((crisis.fundingNeeded - crisis.fundingReceived) / 1000000).toFixed(1)}M
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">About This Crisis</h3>
            <p className="text-foreground/70 text-sm leading-relaxed">{crisis.description}</p>
          </div>

          {/* Location details */}
          <div className="bg-card border border-border/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-foreground font-semibold mb-3">
              <MapPin className="w-5 h-5 text-primary" />
              Location
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-foreground/60 text-xs">Division</div>
                <div className="text-foreground font-medium">{crisis.location.division}</div>
              </div>
              <div>
                <div className="text-foreground/60 text-xs">District</div>
                <div className="text-foreground font-medium">{crisis.location.district}</div>
              </div>
              <div>
                <div className="text-foreground/60 text-xs">Upazila</div>
                <div className="text-foreground font-medium">{crisis.location.upazila}</div>
              </div>
            </div>
          </div>

          {/* Verification info */}
          <div className="bg-card border border-border/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Verification Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-foreground/70">Status</span>
                <span className="font-medium capitalize">
                  {crisis.verificationStatus === "ai-verified" && "✓ AI Verified"}
                  {crisis.verificationStatus === "community-validated" && "✓ Community Validated"}
                  {crisis.verificationStatus === "under-review" && "⊘ Under Review"}
                </span>
              </div>
              {crisis.satelliteData && (
                <div className="flex items-start justify-between">
                  <span className="text-foreground/70">Satellite Data</span>
                  <span className="text-right font-medium text-xs">{crisis.satelliteData}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-foreground/70">News References</span>
                <span className="font-medium">{crisis.newsLinks.length} source(s)</span>
              </div>
            </div>
          </div>

          {/* Community validation */}
          <div className="bg-primary/5 border border-primary/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-foreground">Community Validation</h3>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                {crisis.upvotes + crisis.downvotes} votes
              </span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setUpvoted(!upvoted)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border transition-colors ${
                  upvoted
                    ? "bg-green-500/20 border-green-500/50 text-green-700"
                    : "bg-background border-border/50 text-foreground/70 hover:border-green-500/50"
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm font-medium">{crisis.upvotes}</span>
              </button>
              <button
                onClick={() => setDownvoted(!downvoted)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border transition-colors ${
                  downvoted
                    ? "bg-red-500/20 border-red-500/50 text-red-700"
                    : "bg-background border-border/50 text-foreground/70 hover:border-red-500/50"
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span className="text-sm font-medium">{crisis.downvotes}</span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t border-border/50">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-background border border-border/50 hover:bg-card rounded-lg text-foreground font-semibold transition-colors"
            >
              Close
            </button>
            <button
              onClick={onDonate}
              className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors"
            >
              Donate Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
