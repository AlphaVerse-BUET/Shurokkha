"use client"

import { useAppStore } from "@/store/app-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import DonorDashboard from "@/components/portals/donor-dashboard"
import ProviderDashboard from "@/components/portals/provider-dashboard"
import BeneficiaryPortal from "@/components/portals/beneficiary-portal"
import AdminDashboard from "@/components/portals/admin-dashboard"

export default function DashboardPage() {
  const { isAuthenticated, currentRole } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <main className="min-h-screen bg-background">
      {currentRole === "donor" && <DonorDashboard />}
      {currentRole === "provider" && <ProviderDashboard />}
      {currentRole === "beneficiary" && <BeneficiaryPortal />}
      {currentRole === "admin" && <AdminDashboard />}
    </main>
  )
}
