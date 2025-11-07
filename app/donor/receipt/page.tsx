"use client"

import { useAppStore } from "@/store/app-store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { mockDonations, mockCrises, mockBeneficiaries } from "@/store/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCurrency } from "@/contexts/currency-context"

export default function ReceiptPage() {
  const { currentUser, currentRole } = useAppStore()
  const router = useRouter()
  const { formatAmount } = useCurrency()
  const [donations, setDonations] = useState<any[]>([])

  useEffect(() => {
    if (currentRole !== "donor") {
      router.push("/auth/login?role=donor")
    }

    const userDonations = mockDonations
      .filter((d) => d.donorId === currentUser?.id)
      .map((d) => ({
        ...d,
        crisis: mockCrises.find((c) => c.id === d.crisisId),
        beneficiaries: mockBeneficiaries.filter((b) => d.allocations.some((a) => a.beneficiaryId === b.id)),
      }))

    setDonations(userDonations)
  }, [currentUser?.id, currentRole, router])

  const handleDownloadReceipt = (donation: any) => {
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Tax Receipt - Shurokkha</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .receipt-number { color: #666; font-size: 12px; }
          .details { margin: 20px 0; line-height: 1.8; }
          .section { margin: 20px 0; }
          .label { font-weight: bold; color: #333; }
          .value { color: #666; margin-left: 10px; }
          .total { font-size: 18px; font-weight: bold; color: #2d5016; margin-top: 20px; }
          .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { text-align: left; padding: 10px; border-bottom: 1px solid #ddd; }
          th { background-color: #f5f5f5; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🤝 Shurokkha</div>
          <div>Transparent Donation Platform</div>
          <div class="receipt-number">Receipt #${donation.id.toUpperCase()}</div>
        </div>

        <div class="details">
          <div class="section">
            <div><span class="label">Date:</span><span class="value">${new Date(donation.createdAt).toLocaleDateString()}</span></div>
            <div><span class="label">Donor:</span><span class="value">${currentUser?.name}</span></div>
            <div><span class="label">Email:</span><span class="value">${currentUser?.email}</span></div>
          </div>

          <div class="section">
            <div class="label">Crisis Supported:</div>
            <div>${donation.crisis?.title}</div>
            <div style="font-size: 12px; color: #666;">${donation.crisis?.location.district}, ${donation.crisis?.location.division}</div>
          </div>

          <div class="section">
            <div class="label">Beneficiaries Helped:</div>
            <table>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Location</th>
              </tr>
              ${donation.beneficiaries
                .map(
                  (b: any) => `
                <tr>
                  <td>${b.fullName}</td>
                  <td>${b.needCategory}</td>
                  <td>${b.location.district}</td>
                </tr>
              `,
                )
                .join("")}
            </table>
          </div>

          <div class="section">
            <div><span class="label">Donation Amount:</span><span class="value">${formatAmount(donation.amount)}</span></div>
            <div><span class="label">Transaction Fee (2.5%):</span><span class="value">${formatAmount(donation.transactionFee)}</span></div>
            <div class="total">Total: ${formatAmount(donation.amount + donation.transactionFee)}</div>
          </div>

          <div class="section">
            <div><span class="label">Status:</span><span class="value">${donation.status.toUpperCase()}</span></div>
          </div>
        </div>

        <div class="footer">
          <p>This is an official tax receipt from Shurokkha Platform.</p>
          <p>For inquiries, contact: info@shurokkha.org</p>
          <p>Generated: ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `

    const blob = new Blob([receiptHTML], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `receipt-${donation.id}.html`
    link.click()
  }

  return (
    <main className="min-h-screen bg-background pb-12">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tax Receipts</h1>

        <div className="space-y-4">
          {donations.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No donations yet. Make your first donation to get a receipt!</p>
            </Card>
          ) : (
            donations.map((donation) => (
              <Card key={donation.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{donation.crisis?.title}</h3>
                    <p className="text-sm text-muted-foreground">{donation.crisis?.location.district}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{formatAmount(donation.amount)}</div>
                    <p className="text-xs text-muted-foreground">{new Date(donation.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {donation.beneficiaries.length > 0 && (
                  <div className="mb-4 pb-4 border-b">
                    <p className="text-sm text-muted-foreground mb-2">Beneficiaries Helped:</p>
                    <div className="flex flex-wrap gap-3">
                      {donation.beneficiaries.map((beneficiary: any) => (
                        <div
                          key={beneficiary.id}
                          className="flex items-center gap-2 bg-muted/50 rounded-full pr-3 py-1"
                        >
                          <Avatar className="h-8 w-8 border-2 border-primary/20">
                            <AvatarImage
                              src={beneficiary.profileImage || "/placeholder.svg"}
                              alt={beneficiary.fullName}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                              {beneficiary.fullName?.charAt(0) || "B"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{beneficiary.fullName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b">
                  <div>
                    <span className="text-sm text-muted-foreground">Beneficiaries</span>
                    <div className="font-bold">{donation.beneficiaries.length}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Status</span>
                    <div className="font-bold capitalize">{donation.status}</div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button onClick={() => handleDownloadReceipt(donation)} variant="outline" className="flex-1">
                    📥 Download Receipt (HTML)
                  </Button>
                  <Button variant="outline">View Details</Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
