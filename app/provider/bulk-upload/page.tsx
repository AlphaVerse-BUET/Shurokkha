"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { BulkBeneficiaryUpload } from "@/components/provider/bulk-upload"

export default function ProviderBulkUploadPage() {
  const router = useRouter()

  return (
    <div className="container max-w-6xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Bulk Beneficiary Upload</h1>
          <p className="text-muted-foreground">Upload multiple beneficiaries at once with AI validation</p>
        </div>
      </div>

      <BulkBeneficiaryUpload />
    </div>
  )
}
