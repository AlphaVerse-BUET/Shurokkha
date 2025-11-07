"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowRight } from "lucide-react"

export default function BeneficiaryRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard after a short delay for users to see the message
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-8 space-y-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 mx-auto">
          <AlertCircle className="w-6 h-6 text-blue-600" />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Welcome to Beneficiary Portal</h1>
          <p className="text-muted-foreground">
            All beneficiary features are now available in the main dashboard
          </p>
        </div>

        <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
          <p className="font-semibold">Access these features from Dashboard:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>✓ Browse Providers with real reviews</li>
            <li>✓ View your Dashboard overview</li>
            <li>✓ Submit new applications</li>
            <li>✓ Track application status</li>
            <li>✓ Manage privacy controls</li>
          </ul>
        </div>

        <Button onClick={() => router.push("/dashboard")} className="w-full gap-2">
          Go to Dashboard
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Card>
    </div>
  )
}
