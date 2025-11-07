"use client"

import { useAppStore } from "@/store/app-store"
import { mockDonations } from "@/store/mock-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Download, FileText } from "lucide-react"

export default function ReceiptPage() {
  const router = useRouter()
  const { isAuthenticated, currentRole } = useAppStore()

  useEffect(() => {
    if (!isAuthenticated || currentRole !== "donor") {
      router.push("/auth/login?role=donor")
    }
  }, [isAuthenticated, currentRole, router])

  const handleDownloadReceipt = (donationId: string) => {
    console.log("[v0] Downloading receipt for donation:", donationId)
    const element = document.createElement("a")
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," +
        encodeURIComponent(
          `SHUROKKHA TAX RECEIPT\n\nDonation ID: ${donationId}\nAmount: ৳5,000\nDate: ${new Date().toLocaleDateString()}\n\nThis is a placeholder receipt.`,
        ),
    )
    element.setAttribute("download", `receipt-${donationId}.txt`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-background to-accent/5">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tax Receipts</h1>
          <p className="text-muted-foreground">Download tax-certified receipts for your donations</p>
        </div>

        <div className="space-y-4">
          {mockDonations.map((donation) => (
            <Card key={donation.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg">Donation Receipt</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">ID:</span>
                      <div className="font-medium">{donation.id}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Amount:</span>
                      <div className="font-medium">৳{donation.amount.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <div className="font-medium">{new Date(donation.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <div className="font-medium capitalize">{donation.status}</div>
                    </div>
                  </div>
                </div>
                <Button onClick={() => handleDownloadReceipt(donation.id)} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
