"use client"

import { useState } from "react"
import { mockCrises } from "@/store/mock-data"
import { X, ThumbsUp, ThumbsDown, MapPin, Users, TrendingUp, Calendar, Zap, Bot, Shield, Building2 } from "lucide-react"

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

  const getUploaderIcon = (type: string) => {
    if (type === "system") return <Bot className="w-4 h-4" />
    if (type === "admin") return <Shield className="w-4 h-4" />
    return <Building2 className="w-4 h-4" />
  }

  const getUploaderColor = (type: string) => {
    if (type === "system") return "bg-purple-500/20 text-purple-700 border-purple-500/50"
    if (type === "admin") return "bg-red-500/20 text-red-700 border-red-500/50"
    return "bg-blue-500/20 text-blue-700 border-blue-500/50"
  }

  // Facebook-style image grid layout
  const renderImageGrid = () => {
    const images = crisis.evidenceImages
    if (images.length === 0) return null

    if (images.length === 1) {
      return (
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <img 
            src={images[0]} 
            alt="Crisis evidence"
            className="w-full h-full object-cover"
          />
        </div>
      )
    }

    if (images.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square">
              <img 
                src={img} 
                alt={`Evidence ${idx + 1}`}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setCurrentImageIndex(idx)}
              />
            </div>
          ))}
        </div>
      )
    }

    if (images.length === 3) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
          <div className="relative aspect-square row-span-2">
            <img 
              src={images[0]} 
              alt="Evidence 1"
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setCurrentImageIndex(0)}
            />
          </div>
          <div className="grid grid-rows-2 gap-1">
            {images.slice(1).map((img, idx) => (
              <div key={idx + 1} className="relative aspect-square">
                <img 
                  src={img} 
                  alt={`Evidence ${idx + 2}`}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setCurrentImageIndex(idx + 1)}
                />
              </div>
            ))}
          </div>
        </div>
      )
    }

    // 4 or more images
    return (
      <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
        {images.slice(0, 4).map((img, idx) => (
          <div key={idx} className="relative aspect-square">
            <img 
              src={img} 
              alt={`Evidence ${idx + 1}`}
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setCurrentImageIndex(idx)}
            />
            {idx === 3 && images.length > 4 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">+{images.length - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

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
          {/* Uploader info */}
          <div className={`flex items-center gap-3 p-3 rounded-lg border ${getUploaderColor(crisis.uploadedBy.type)}`}>
            <div className="flex items-center gap-2">
              {getUploaderIcon(crisis.uploadedBy.type)}
              <div>
                <div className="font-semibold text-sm">{crisis.uploadedBy.name}</div>
                <div className="text-xs opacity-80">
                  Reported on {new Date(crisis.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          {/* Image grid - Facebook style */}
          {crisis.evidenceImages.length > 0 && (
            <div className="space-y-2">
              {renderImageGrid()}
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
