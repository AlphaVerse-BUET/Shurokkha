"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Star,
  MapPin,
  Users,
  CheckCircle,
  Heart,
  MessageCircle,
  Share2,
  Search,
  ChevronDown,
} from "lucide-react"

// Mock provider data with detailed ratings
const mockProviders = [
  {
    id: 1,
    name: "Grameen Bangladesh",
    location: "Dhaka, Chittagong",
    logo: "🏢",
    trustScore: 94,
    averageRating: 4.8,
    totalReviews: 2847,
    completionRate: 96,
    familiesServed: 45000,
    yearsActive: 8,
    responseTime: "1.2 hours",
    reviews: [
      {
        id: 1,
        author: "Fatima Khan",
        rating: 5,
        date: "2 days ago",
        title: "Excellent service during flood relief",
        content:
          "They arrived within 5 days with complete aid. Verified everything transparently. Very professional team. Highly recommend!",
        verified: true,
        helpful: 342,
        images: ["📸", "📸"],
      },
      {
        id: 2,
        author: "Ahmed Hassan",
        rating: 5,
        date: "1 week ago",
        title: "Life-changing support",
        content:
          "This organization saved our family during the cyclone. They not only provided immediate relief but also helped us rebuild. Trustworthy and efficient.",
        verified: true,
        helpful: 256,
      },
      {
        id: 3,
        author: "Rehana Begum",
        rating: 4,
        date: "2 weeks ago",
        title: "Good overall, minor delays",
        content:
          "Got the aid within a week. Good quality items. Documentation was thorough. Only minor delay in distribution day.",
        verified: true,
        helpful: 178,
      },
    ],
  },
  {
    id: 2,
    name: "BRAC Bangladesh",
    location: "Nationwide Coverage",
    logo: "🌐",
    trustScore: 92,
    averageRating: 4.7,
    totalReviews: 3102,
    completionRate: 94,
    familiesServed: 52000,
    yearsActive: 12,
    responseTime: "2.1 hours",
    reviews: [
      {
        id: 4,
        author: "Karim Ahmed",
        rating: 5,
        date: "3 days ago",
        title: "Professional and transparent",
        content:
          "Best experience during crisis. Everything was explained clearly. They verified every step with photos and GPS. Highly satisfied!",
        verified: true,
        helpful: 421,
        images: ["📸"],
      },
      {
        id: 5,
        author: "Nasrin Akter",
        rating: 4,
        date: "1 week ago",
        title: "Fast response, good execution",
        content:
          "They responded within 2 hours. Distributed aid efficiently. The team was polite and professional. Would request again if needed.",
        verified: true,
        helpful: 189,
      },
    ],
  },
  {
    id: 3,
    name: "Islamic Relief Bangladesh",
    location: "Cox's Bazar, Kushtia",
    logo: "☪️",
    trustScore: 89,
    averageRating: 4.6,
    totalReviews: 1923,
    completionRate: 91,
    familiesServed: 38000,
    yearsActive: 6,
    responseTime: "2.8 hours",
    reviews: [
      {
        id: 6,
        author: "Salma Khatun",
        rating: 5,
        date: "5 days ago",
        title: "Compassionate and efficient",
        content:
          "They not only gave aid but also treated us with dignity. No discrimination, just genuine support. Their team showed real compassion.",
        verified: true,
        helpful: 334,
      },
    ],
  },
]

export default function ProviderBrowser() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"rating" | "trust" | "reviews">("rating")
  const [expandedProviders, setExpandedProviders] = useState<Record<number, boolean>>({})

  // Filter and sort providers
  const filteredProviders = mockProviders
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "rating") return b.averageRating - a.averageRating
      if (sortBy === "trust") return b.trustScore - a.trustScore
      return b.totalReviews - a.totalReviews
    })

  const toggleProviderExpand = (providerId: number) => {
    setExpandedProviders((prev) => ({
      ...prev,
      [providerId]: !prev[providerId],
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Verified Providers</h2>
        <p className="text-muted-foreground">Browse all providers and read real reviews from beneficiaries</p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search providers by name or location..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2 border rounded-lg bg-background"
            >
              <option value="rating">Sort by Rating</option>
              <option value="trust">Sort by Trust Score</option>
              <option value="reviews">Sort by Reviews</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Providers List */}
      <div className="space-y-6">
        {filteredProviders.map((provider) => (
          <Card key={provider.id} className="overflow-hidden">
            <CardHeader className="bg-linear-to-r from-primary/5 to-secondary/5 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{provider.logo}</span>
                    <div>
                      <CardTitle className="text-2xl">{provider.name}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-4 h-4" />
                        {provider.location}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => toggleProviderExpand(provider.id)}
                  className="gap-2"
                >
                  {expandedProviders[provider.id] ? "Hide" : "View"} Reviews
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedProviders[provider.id] ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                <div className="bg-white dark:bg-black/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Trust Score</p>
                  <p className="text-2xl font-bold text-primary">{provider.trustScore}</p>
                </div>
                <div className="bg-white dark:bg-black/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Star className="w-3 h-3" /> Rating
                  </p>
                  <p className="text-2xl font-bold text-yellow-500">{provider.averageRating}</p>
                </div>
                <div className="bg-white dark:bg-black/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground"># Reviews</p>
                  <p className="text-2xl font-bold">{provider.totalReviews}</p>
                </div>
                <div className="bg-white dark:bg-black/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Completion</p>
                  <p className="text-2xl font-bold text-green-600">{provider.completionRate}%</p>
                </div>
                <div className="bg-white dark:bg-black/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Response</p>
                  <p className="text-sm font-bold">{provider.responseTime}</p>
                </div>
              </div>
            </CardHeader>

            {/* Expanded Reviews Section */}
            {expandedProviders[provider.id] && (
              <CardContent className="pt-6 space-y-6">
                {/* Provider Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b">
                  <div>
                    <p className="text-xs text-muted-foreground">Families Served</p>
                    <p className="text-lg font-bold flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {provider.familiesServed.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Years Active</p>
                    <p className="text-lg font-bold">{provider.yearsActive} years</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge className="bg-green-600">✓ Verified</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Preference</p>
                    <Button size="sm" variant="outline">
                      Save to Preferences
                    </Button>
                  </div>
                </div>

                {/* Reviews */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Recent Reviews ({provider.reviews.length})</h3>

                  {provider.reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition">
                      {/* Review Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{review.author}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                ✓ Verified Beneficiary
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                        <div className="flex gap-1">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                              />
                            ))}
                        </div>
                      </div>

                      {/* Review Title */}
                      <p className="font-semibold">{review.title}</p>

                      {/* Review Content */}
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{review.content}</p>

                        {/* Images if any */}
                        {review.images && (
                          <div className="flex gap-2 mt-2">
                            {review.images.map((img, idx) => (
                              <div key={idx} className="w-12 h-12 bg-muted rounded flex items-center justify-center text-lg">
                                {img}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Review Actions */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                        <button className="flex items-center gap-1 hover:text-primary transition">
                          <Heart className="w-4 h-4" />
                          Helpful ({review.helpful})
                        </button>
                        <button className="flex items-center gap-1 hover:text-primary transition">
                          <MessageCircle className="w-4 h-4" />
                          Reply
                        </button>
                        <button className="flex items-center gap-1 hover:text-primary transition">
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Write Review Section */}
                <div className="bg-muted/50 p-4 rounded-lg space-y-3 border-2 border-dashed">
                  <p className="font-semibold text-sm flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Have you received aid from this provider?
                  </p>
                  <Textarea
                    placeholder="Share your experience... What was the quality of aid? How professional was the team? How long did it take?"
                    className="text-sm"
                    rows={3}
                  />
                  <Button className="w-full" size="sm">
                    Submit Review
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-900">
        <CardContent className="p-6 space-y-3">
          <p className="font-bold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Why Read Reviews Before Applying?
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Understand how each provider works and what to expect</li>
            <li>✓ See real experiences from beneficiaries like you</li>
            <li>✓ Build your preferences based on trusted information</li>
            <li>✓ Know response times, quality of aid, and professionalism</li>
            <li>✓ Make informed decisions before applying</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
