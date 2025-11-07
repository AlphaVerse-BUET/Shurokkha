"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import {
  mockDonors,
  mockProviders,
  mockBeneficiaries,
} from "@/store/mock-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import type { UserRole } from "@/types";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAppStore();

  const [selectedRole, setSelectedRole] = useState<UserRole>("donor");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "", // Only for providers
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock signup - in real app, this would call an API
    const newUser = {
      id: `${selectedRole}-${Date.now()}`,
      name: selectedRole === "provider" ? formData.organization : formData.name,
      email: formData.email,
      phone: formData.phone,
      role: selectedRole,
      verified: true,
      createdAt: new Date().toISOString(),
      profileImage: undefined,
    };

    // Add user to mock data arrays
    if (selectedRole === "donor") {
      mockDonors.push(newUser);
    } else if (selectedRole === "provider") {
      mockProviders.push({
        id: newUser.id,
        organizationName: formData.organization,
        registrationType: "ngo",
        email: newUser.email,
        phone: newUser.phone,
        description: "New provider organization",
        registrationCertificate: "",
        bankStatement: "",
        officeAddressProof: "",
        portfolioImages: [],
        leadershipNIDCopies: [],
        references: [],
        trustScore: 50,
        completionRate: 0,
        averageRating: 0,
        responseTimeHours: 24,
        yearsActive: 0,
        fraudIncidents: 0,
        specialization: [],
        geographicFocus: {
          divisions: [],
          districts: [],
        },
        maxActiveBeneficiaries: 50,
        monthlyFundCap: 1000000,
        totalAidedBeneficiaries: 0,
        verified: true,
        status: "active" as const,
        badges: [],
        createdAt: newUser.createdAt,
        lastActivityAt: newUser.createdAt,
      });
    } else if (selectedRole === "beneficiary") {
      mockBeneficiaries.push({
        id: newUser.id,
        nidNumber: `NID-${Date.now()}`,
        nidFrontImage: "",
        nidBackImage: "",
        fullName: formData.name,
        phone: newUser.phone,
        address: "",
        location: {
          division: "Dhaka",
          district: "Dhaka",
          upazila: "",
          coordinates: { lat: 23.8103, lng: 90.4125 },
        },
        needCategory: "food",
        needDescription: "",
        amountRequested: 0,
        urgencyLevel: "medium",
        itemizedBreakdown: [],
        crisisProofImages: [],
        familySize: 1,
        dependents: 0,
        dependentDetails: [],
        incomeSources: [],
        geographicPreference: "local" as const,
        organizationSizePreference: "medium" as const,
        paymentMethod: "bkash" as const,
        accountNumber: "",
        applicationStatus: "pending" as const,
        verificationStatus: "pending" as const,
        privacyMode: "limited" as const,
        allocatedProviderId: undefined,
        providerApplications: [],
        appliedDate: newUser.createdAt,
        allocationDate: undefined,
        completionDate: undefined,
      });
    }

    login(newUser);
    toast.success("Account created successfully!");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-muted-foreground">
            Join Shurokkha to make a transparent impact
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Role Selection */}
          <div className="space-y-2">
            <Label>I want to join as</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={selectedRole === "donor" ? "default" : "outline"}
                onClick={() => setSelectedRole("donor")}
                className="justify-start"
              >
                💰 Donor
              </Button>
              <Button
                type="button"
                variant={selectedRole === "provider" ? "default" : "outline"}
                onClick={() => setSelectedRole("provider")}
                className="justify-start"
              >
                🏢 Provider
              </Button>
              <Button
                type="button"
                variant={selectedRole === "beneficiary" ? "default" : "outline"}
                onClick={() => setSelectedRole("beneficiary")}
                className="justify-start"
              >
                🙏 Beneficiary
              </Button>
              <Button
                type="button"
                variant={selectedRole === "admin" ? "default" : "outline"}
                onClick={() => setSelectedRole("admin")}
                className="justify-start"
              >
                ⚙️ Admin
              </Button>
            </div>
          </div>

          {/* Provider Organization Name */}
          {selectedRole === "provider" && (
            <div className="space-y-2">
              <Label htmlFor="organization">Organization Name</Label>
              <Input
                id="organization"
                placeholder="Your organization name"
                value={formData.organization}
                onChange={(e) =>
                  setFormData({ ...formData, organization: e.target.value })
                }
                required
              />
            </div>
          )}

          {/* Name (for non-providers) */}
          {selectedRole !== "provider" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+8801XXXXXXXXX"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>

        {/* Link to Login */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            Already have an account?{" "}
          </span>
          <Link
            href="/auth/login"
            className="text-primary font-medium hover:underline"
          >
            Login here
          </Link>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </Card>
    </div>
  );
}
