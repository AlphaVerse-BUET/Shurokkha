"use client"

import { useState } from "react"
import { useAppStore } from "@/store/app-store"
import { mockDonors } from "@/store/mock-data"
import DonorDashboard from "@/components/portals/donor-dashboard"
import ProviderDashboard from "@/components/portals/provider-dashboard"
import BeneficiaryPortal from "@/components/portals/beneficiary-portal"
import AdminDashboard from "@/components/portals/admin-dashboard"
import CrisisIssueDetection from "@/components/portals/issue-detection"
import RoleSelector from "@/components/role-selector"

export default function Home() {
  const { currentRole, login, logout, isAuthenticated } = useAppStore()
  const [showRoleSelector, setShowRoleSelector] = useState(!isAuthenticated)

  const handleRoleSelect = (role: typeof currentRole) => {
    if (role === "guest") {
      setShowRoleSelector(false)
      logout()
    } else if (role === "donor") {
      const donorUser = mockDonors[0]
      login({
        ...donorUser,
        role: "donor",
      })
      setShowRoleSelector(false)
    } else {
      // Will be implemented for other roles
      login({
        id: `${role}-1`,
        role,
        name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
        email: `${role}@shurokkha.com`,
        phone: "+88017XXXXXXXX",
        verified: true,
        createdAt: new Date().toISOString(),
      })
      setShowRoleSelector(false)
    }
  }

  if (showRoleSelector) {
    return <RoleSelector onSelectRole={handleRoleSelect} />
  }

  return (
    <main className="min-h-screen bg-background">
      {currentRole === "guest" && <CrisisIssueDetection />}
      {currentRole === "donor" && <DonorDashboard />}
      {currentRole === "provider" && <ProviderDashboard />}
      {currentRole === "beneficiary" && <BeneficiaryPortal />}
      {currentRole === "admin" && <AdminDashboard />}
    </main>
  )
}
