"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Users, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react"
import type { Beneficiary } from "@/types"

interface BeneficiaryCardProps {
  beneficiary: Beneficiary
  showFullDetails?: boolean
  onSelect?: (beneficiary: Beneficiary) => void
}

export function BeneficiaryCard({ beneficiary, showFullDetails = false, onSelect }: BeneficiaryCardProps) {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-500"
      case "emergency":
        return "bg-orange-500"
      case "high":
        return "bg-yellow-500"
      default:
        return "bg-blue-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "verified":
        return "bg-blue-500"
      case "pending":
        return "bg-yellow-500"
      case "under-review":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "verified":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "under-review":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const displayName =
    beneficiary.privacyMode === "anonymous" ? `Beneficiary #${beneficiary.id.slice(-6)}` : beneficiary.fullName

  return (
    <Card
      className={`hover:shadow-lg transition-shadow ${onSelect ? "cursor-pointer" : ""}`}
      onClick={() => onSelect?.(beneficiary)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={beneficiary.profileImage || "/placeholder.svg"} alt={displayName} />
            <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg truncate">{displayName}</h3>
                <p className="text-sm text-muted-foreground">Age: {beneficiary.age}</p>
              </div>
              <Badge className={getUrgencyColor(beneficiary.urgencyLevel)}>{beneficiary.urgencyLevel}</Badge>
            </div>

            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate">
                {beneficiary.location.district}, {beneficiary.location.division}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Need Category</span>
            <Badge variant="outline">{beneficiary.needCategory}</Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{beneficiary.needDescription}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Family: {beneficiary.familySize}</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-emerald-600">৳{beneficiary.amountRequested.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Requested</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Applied: {new Date(beneficiary.appliedDate).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            {getStatusIcon(beneficiary.applicationStatus)}
            <span className="text-sm font-medium">Status</span>
          </div>
          <Badge className={getStatusColor(beneficiary.applicationStatus)}>{beneficiary.applicationStatus}</Badge>
        </div>

        {showFullDetails && beneficiary.itemizedBreakdown && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium mb-2">Cost Breakdown:</p>
            <div className="space-y-1">
              {beneficiary.itemizedBreakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.item}</span>
                  <span className="font-medium">৳{item.cost.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {beneficiary.allocatedProviderId && (
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">Matched with Provider</span>
            </div>
          </div>
        )}

        {beneficiary.verificationStatus === "verified" && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <CheckCircle className="h-4 w-4" />
            <span>AI Verified</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
