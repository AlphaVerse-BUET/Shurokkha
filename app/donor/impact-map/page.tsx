"use client"

import { useAppStore } from "@/store/app-store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockDonations, mockCrises, mockBeneficiaries } from "@/store/mock-data"
import Image from "next/image"
import { useCurrency } from "@/contexts/currency-context"

export default function ImpactMapPage() {
  const { currentUser, currentRole } = useAppStore()
  const router = useRouter()
  const { formatAmount } = useCurrency()
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    if (currentRole !== "donor") {
      router.push("/auth/login?role=donor")
    }

    const userDonations = mockDonations.filter((d) => d.donorId === currentUser?.id)
    const totalDonated = userDonations.reduce((sum, d) => sum + d.amount, 0)
    const beneficiariesReached = userDonations.reduce((sum, d) => sum + d.allocations.length, 0)
    const crisisTypesSupported = new Set(userDonations.map((d) => mockCrises.find((c) => c.id === d.crisisId)?.type))
      .size

    setStats({
      totalDonated,
      beneficiariesReached,
      crisisTypesSupported,
      donations: userDonations,
    })
  }, [currentUser?.id, currentRole, router])

  return (
    <main className="min-h-screen bg-background pb-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Impact Map</h1>

        {stats && (
          <div className="space-y-6">
            {/* Impact Summary */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">{formatAmount(stats.totalDonated)}</div>
                <div className="text-sm text-muted-foreground mt-2">Total Donated</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">{stats.beneficiariesReached}</div>
                <div className="text-sm text-muted-foreground mt-2">Beneficiaries Reached</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">{stats.crisisTypesSupported}</div>
                <div className="text-sm text-muted-foreground mt-2">Crisis Types Supported</div>
              </Card>
            </div>

            {/* Bangladesh Heatmap */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Geographic Impact Heatmap</h2>
              <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
                <Image
                  src="/bangladesh-donation-heatmap-impact-map.jpg"
                  alt="Bangladesh impact heatmap showing donation distribution across regions"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end">
                  <div className="p-4 text-white text-sm">
                    Green = High Impact | Yellow = Medium Impact | Red = Active Crises
                  </div>
                </div>
              </div>
            </Card>

            {/* Detailed Donation Timeline */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Donation Timeline</h2>
              <div className="space-y-4">
                {stats.donations.map((donation: any, idx: number) => {
                  const crisis = mockCrises.find((c) => c.id === donation.crisisId)
                  const beneficiaries = mockBeneficiaries.filter((b) =>
                    donation.allocations.some((a: any) => a.beneficiaryId === b.id),
                  )

                  return (
                    <div key={donation.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold">{crisis?.title}</h3>
                          <p className="text-sm text-muted-foreground">{crisis?.location.district}</p>
                        </div>
                        <Badge>{donation.status}</Badge>
                      </div>
                      <div className="text-2xl font-bold text-primary mb-3">{formatAmount(donation.amount)}</div>

                      {/* Beneficiaries */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Beneficiaries ({beneficiaries.length}):</p>
                        {beneficiaries.map((b) => (
                          <div key={b.id} className="flex items-start gap-3 p-2 bg-muted rounded">
                            {b.profileImage && (
                              <img
                                src={b.profileImage || "/placeholder.svg"}
                                alt={b.fullName}
                                className="w-8 h-8 rounded-full"
                              />
                            )}
                            <div className="flex-1 text-sm">
                              <div className="font-medium">{b.fullName}</div>
                              <div className="text-xs text-muted-foreground">
                                {b.needCategory} • {b.location.district}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="text-xs text-muted-foreground mt-3">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
