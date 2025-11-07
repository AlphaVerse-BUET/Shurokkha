"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowRight } from "lucide-react"


export default function ProviderBrowserRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard with providers tab after a short delay
    const timer = setTimeout(() => {
      router.push("/dashboard?tab=providers")
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
          <h1 className="text-2xl font-bold">Provider Browser Moved</h1>
          <p className="text-muted-foreground">
            Browse providers is now integrated into your main dashboard
          </p>
        </div>

        <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
          <p className="font-semibold">You can now:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>✓ Access from Dashboard → Browse Providers tab</li>
            <li>✓ Read Daraz-style reviews</li>
            <li>✓ Filter by ratings and trust scores</li>
            <li>✓ Write your own reviews</li>
            <li>✓ Save providers to preferences</li>
          </ul>
        </div>

        <Button onClick={() => router.push("/dashboard?tab=providers")} className="w-full gap-2">
          Go to Provider Browser
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Card>
    </div>
  )
}

