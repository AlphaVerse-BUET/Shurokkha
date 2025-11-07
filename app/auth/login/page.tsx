"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppStore } from "@/store/app-store"
import { mockDonors, mockProviders, mockBeneficiaries } from "@/store/mock-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import type { UserRole } from "@/types"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAppStore()

  const initialRole = (searchParams.get("role") as UserRole) || "donor"
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  const userOptions = {
    donor: mockDonors.map((d) => ({ ...d, label: `${d.name} (${d.email})` })),
    provider: mockProviders.map((p) => ({
      ...p,
      id: p.id,
      name: p.organizationName,
      email: p.email,
      label: `${p.organizationName}`,
      role: "provider" as const,
      phone: p.phone,
      verified: p.verified,
      createdAt: p.createdAt,
    })),
    beneficiary: mockBeneficiaries.map((b) => ({
      ...b,
      label: `${b.fullName} (${b.needCategory})`,
      role: "beneficiary" as const,
      email: `${b.id}@beneficiary.local`,
      phone: b.phone,
      verified: true,
      createdAt: b.appliedDate,
    })),
    admin: [
      {
        id: "admin-1",
        name: "Admin User",
        email: "admin@shurokkha.com",
        phone: "+88017XXXXXXXX",
        role: "admin" as const,
        verified: true,
        createdAt: new Date().toISOString(),
        label: "System Admin",
      },
    ],
    guest: [],
  }

  const handleLogin = (userOrId: any) => {
    if (selectedRole === "provider") {
      login({
        id: userOrId.id,
        name: userOrId.organizationName,
        email: userOrId.email,
        phone: userOrId.phone,
        role: "provider",
        verified: userOrId.verified,
        createdAt: userOrId.createdAt,
      })
    } else if (selectedRole === "beneficiary") {
      login({
        id: userOrId.id,
        name: userOrId.fullName,
        email: userOrId.email,
        phone: userOrId.phone,
        role: "beneficiary",
        verified: true,
        createdAt: userOrId.appliedDate,
      })
    } else if (selectedRole === "admin") {
      login({
        id: userOrId.id,
        name: userOrId.name,
        email: userOrId.email,
        phone: userOrId.phone,
        role: "admin",
        verified: true,
        createdAt: userOrId.createdAt,
      })
    } else {
      login(userOrId)
    }
    router.push("/dashboard")
  }

  const options = userOptions[selectedRole as keyof typeof userOptions] || []

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to Shurokkha</h1>
          <p className="text-muted-foreground">Select your role to continue</p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">User Role</label>
          <div className="grid grid-cols-2 gap-2">
            {(["donor", "provider", "beneficiary", "admin"] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => {
                  setSelectedRole(role)
                  setSelectedUser(null)
                }}
                className={`p-3 rounded-lg border-2 transition font-medium capitalize ${
                  selectedRole === role ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                {role === "provider" && "🏢"}
                {role === "donor" && "💰"}
                {role === "beneficiary" && "🙏"}
                {role === "admin" && "⚙️"} {role}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Select {selectedRole} Account</label>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {options.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user.id)}
                className={`w-full p-3 rounded-lg border-2 transition text-left ${
                  selectedUser === user.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <div className="font-medium">{user.label}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={() => {
            if (selectedUser && options.length > 0) {
              const user = options.find((u) => u.id === selectedUser)
              if (user) handleLogin(user)
            }
          }}
          disabled={!selectedUser}
          className="w-full"
          size="lg"
        >
          Login
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Back to Home
          </Link>
        </div>
      </Card>
    </div>
  )
}
