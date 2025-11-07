"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/app-store"
import { mockBeneficiaries, mockProviders } from "@/store/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  User,
  MapPin,
  Phone,
  Calendar,
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle,
  AlertCircle,
  Users,
  TrendingUp,
  ArrowLeft,
} from "lucide-react"
import type { Beneficiary, NeedCategory } from "@/types"

export default function ProviderBeneficiariesPage() {
  const router = useRouter()
  const { currentUser } = useAppStore()
  const provider = mockProviders.find((p) => p.email === currentUser?.email) || mockProviders[0]

  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterLocation, setFilterLocation] = useState<string>("all")
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null)

  // Filter beneficiaries based on provider's specialization and geographic focus
  const compatibleBeneficiaries = mockBeneficiaries.filter((b) => {
    const isTypeMatch = provider.specialization.includes(b.needCategory as any)
    const isLocationMatch = provider.geographicFocus.divisions.includes(b.location.division)
    const isVerified = b.verificationStatus === "verified"
    
    return isTypeMatch && isLocationMatch && isVerified
  })

  // Apply filters
  const filteredBeneficiaries = compatibleBeneficiaries.filter((b) => {
    const matchesSearch = b.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         b.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || b.needCategory === filterCategory
    const matchesStatus = filterStatus === "all" || b.applicationStatus === filterStatus
    const matchesLocation = filterLocation === "all" || b.location.division === filterLocation

    return matchesSearch && matchesCategory && matchesStatus && matchesLocation
  })

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      submitted: "bg-blue-500",
      verified: "bg-green-500",
      matched: "bg-purple-500",
      "in-progress": "bg-yellow-500",
      completed: "bg-gray-500",
      pending: "bg-orange-500",
    }
    return colors[status] || "bg-gray-500"
  }

  const getUrgencyColor = (urgency: string) => {
    const colors: Record<string, string> = {
      critical: "bg-red-600 text-white",
      emergency: "bg-orange-600 text-white",
      high: "bg-yellow-600 text-white",
      medium: "bg-blue-600 text-white",
    }
    return colors[urgency] || "bg-gray-600 text-white"
  }

  const uniqueDivisions = Array.from(new Set(compatibleBeneficiaries.map(b => b.location.division)))

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold">Beneficiary Applications</h1>
            <p className="text-muted-foreground">Browse and select beneficiaries matching your organization's focus</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{compatibleBeneficiaries.length}</p>
                  <p className="text-xs text-muted-foreground">Compatible Matches</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {compatibleBeneficiaries.filter(b => b.urgencyLevel === "critical").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Critical Cases</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {compatibleBeneficiaries.filter(b => b.applicationStatus === "pending" || b.applicationStatus === "submitted").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Available Now</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">
                    ৳{(compatibleBeneficiaries.reduce((sum, b) => sum + b.amountRequested, 0) / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-muted-foreground">Total Need</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="shelter">Shelter</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="livelihood">Livelihood</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="matched">Matched</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueDivisions.map(div => (
                    <SelectItem key={div} value={div}>{div}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Beneficiaries List */}
        <div className="grid gap-4">
          {filteredBeneficiaries.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  {compatibleBeneficiaries.length === 0 
                    ? "No matching beneficiaries available" 
                    : "No beneficiaries found"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {compatibleBeneficiaries.length === 0 
                    ? `No beneficiaries match your organization's specialization (${provider.specialization.join(", ")}) and geographic focus (${provider.geographicFocus.divisions.join(", ")}).` 
                    : "Try adjusting your filters to see more results"}
                </p>
                {compatibleBeneficiaries.length === 0 && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg max-w-md mx-auto">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>Tip:</strong> Beneficiaries are matched based on your organization's specialization and service areas. Consider expanding your geographic focus or specialization in your profile settings.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredBeneficiaries.map((beneficiary) => (
              <Card 
                key={beneficiary.id} 
                className={`hover:shadow-lg transition-all cursor-pointer ${
                  beneficiary.urgencyLevel === "critical" ? "border-l-4 border-l-red-500" : ""
                }`}
                onClick={() => setSelectedBeneficiary(beneficiary)}
                data-testid={`beneficiary-card-${beneficiary.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                          <User className="h-6 w-6 text-accent" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold">
                              {beneficiary.privacyMode === "anonymous" 
                                ? "Anonymous Beneficiary" 
                                : beneficiary.fullName}
                            </h3>
                            <Badge className={getUrgencyColor(beneficiary.urgencyLevel)}>
                              {beneficiary.urgencyLevel.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {beneficiary.location.district}, {beneficiary.location.division}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Applied {new Date(beneficiary.appliedDate).toLocaleDateString()}
                            </span>
                            {beneficiary.privacyMode !== "anonymous" && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {beneficiary.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Need Category</p>
                          <Badge variant="outline" className="capitalize">
                            {beneficiary.needCategory}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Family Size</p>
                          <p className="font-semibold">{beneficiary.familySize} members ({beneficiary.dependents} dependents)</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-muted-foreground mb-1">Description</p>
                        <p className="text-sm line-clamp-2">{beneficiary.needDescription}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(beneficiary.applicationStatus)}>
                          {beneficiary.applicationStatus}
                        </Badge>
                        <Badge className="bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {beneficiary.verificationStatus}
                        </Badge>
                        {/* Show matched services badge */}
                        <Badge className="bg-blue-600 text-white">
                          <Users className="h-3 w-3 mr-1" />
                          Matched to Your Services
                        </Badge>
                        {beneficiary.crisisProofImages.length > 0 && (
                          <Badge variant="outline" className="gap-1">
                            <FileText className="h-3 w-3" />
                            {beneficiary.crisisProofImages.length} Proof Documents
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary">
                        ৳{beneficiary.amountRequested.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">Requested Amount</p>
                      <Button size="sm" className="gap-2" data-testid={`btn-view-${beneficiary.id}`}>
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Beneficiary Detail Modal */}
      {selectedBeneficiary && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedBeneficiary(null)}
        >
          <Card className="max-w-4xl w-full my-8" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {selectedBeneficiary.privacyMode === "anonymous" 
                      ? "Anonymous Beneficiary" 
                      : selectedBeneficiary.fullName}
                  </CardTitle>
                  <CardDescription>
                    Application ID: {selectedBeneficiary.id}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedBeneficiary(null)}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image and Basic Info */}
              <div className="flex items-start gap-6">
                {selectedBeneficiary.profileImage && selectedBeneficiary.privacyMode !== "anonymous" && (
                  <div className="h-32 w-32 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img 
                      src={selectedBeneficiary.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p className="font-semibold">{selectedBeneficiary.age} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Family Size</p>
                      <p className="font-semibold">{selectedBeneficiary.familySize} members</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold">{selectedBeneficiary.location.upazila}, {selectedBeneficiary.location.district}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Method</p>
                      <p className="font-semibold capitalize">{selectedBeneficiary.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Need Details */}
              <div>
                <h3 className="font-semibold mb-2">Need Description</h3>
                <p className="text-sm">{selectedBeneficiary.needDescription}</p>
              </div>

              {/* Itemized Breakdown */}
              <div>
                <h3 className="font-semibold mb-2">Itemized Breakdown</h3>
                <div className="space-y-2">
                  {selectedBeneficiary.itemizedBreakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">{item.item}</span>
                      <span className="font-semibold">৳{item.cost.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between p-3 bg-primary/10 rounded-lg border-2 border-primary/30">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary text-lg">
                      ৳{selectedBeneficiary.amountRequested.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dependent Details */}
              {selectedBeneficiary.dependentDetails && selectedBeneficiary.dependentDetails.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Dependent Information</h3>
                  <div className="grid gap-2">
                    {selectedBeneficiary.dependentDetails.map((dep, idx) => (
                      <div key={idx} className="p-3 bg-muted rounded-lg text-sm">
                        <span className="font-medium">{dep.name}</span>
                        {dep.age && <span className="text-muted-foreground ml-2">Age: {dep.age}</span>}
                        {dep.education && <span className="text-muted-foreground ml-2">• {dep.education}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification Documents */}
              <div>
                <h3 className="font-semibold mb-2">Verification Documents</h3>
                <div className="grid grid-cols-3 gap-4">
                  {selectedBeneficiary.nidFrontImage && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">NID Front</p>
                      <img 
                        src={selectedBeneficiary.nidFrontImage} 
                        alt="NID Front" 
                        className="w-full aspect-[3/2] object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                  )}
                  {selectedBeneficiary.nidBackImage && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">NID Back</p>
                      <img 
                        src={selectedBeneficiary.nidBackImage} 
                        alt="NID Back" 
                        className="w-full aspect-[3/2] object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                  )}
                  {selectedBeneficiary.crisisProofImages.map((img, idx) => (
                    <div key={idx}>
                      <p className="text-xs text-muted-foreground mb-1">Crisis Proof {idx + 1}</p>
                      <img 
                        src={img} 
                        alt={`Crisis Proof ${idx + 1}`} 
                        className="w-full aspect-[3/2] object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button className="flex-1" size="lg">
                  Select for Distribution
                </Button>
                <Button variant="outline" onClick={() => setSelectedBeneficiary(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
