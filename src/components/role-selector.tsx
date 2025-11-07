"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface RoleSelectorProps {
  onSelectRole: (role: "guest" | "donor" | "provider" | "beneficiary" | "admin") => void
}

export default function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const roles = [
    {
      id: "guest",
      name: "Browse as Guest",
      description: "Explore crises without account",
      icon: "👁️",
      color: "bg-muted",
    },
    {
      id: "donor",
      name: "Donor",
      description: "Fund crisis relief transparently",
      icon: "💝",
      color: "bg-primary",
    },
    {
      id: "provider",
      name: "Provider (NGO)",
      description: "Distribute verified aid",
      icon: "🤝",
      color: "bg-secondary",
    },
    {
      id: "beneficiary",
      name: "Beneficiary",
      description: "Request crisis assistance",
      icon: "🙋",
      color: "bg-accent",
    },
    {
      id: "admin",
      name: "Admin",
      description: "Platform oversight & fraud detection",
      icon: "⚙️",
      color: "bg-destructive",
    },
  ]

  return (
    <div className="min-h-screen bg-linear-to-b from-primary/5 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">Shurokkha</h1>
          <p className="text-xl text-muted-foreground mb-2 text-balance">Transparent Donation Platform</p>
          <p className="text-sm text-muted-foreground text-balance">
            "Donate with confidence. Track with precision. Impact with certainty."
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {roles.map((role) => (
            <button key={role.id} onClick={() => setSelectedRole(role.id)} className="text-left">
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                  selectedRole === role.id ? "border-primary shadow-lg" : "border-border hover:border-primary/50"
                }`}
              >
                <CardHeader>
                  <div className="text-4xl mb-2">{role.icon}</div>
                  <CardTitle className="text-lg">{role.name}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
              </Card>
            </button>
          ))}
        </div>

        {selectedRole && (
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setSelectedRole(null)}>
              Back
            </Button>
            <Button onClick={() => onSelectRole(selectedRole as any)} className="bg-primary text-primary-foreground">
              Continue as {roles.find((r) => r.id === selectedRole)?.name}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
