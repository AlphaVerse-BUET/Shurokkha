"use client";

import { useAppStore } from "@/store/app-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DonorDashboard from "@/components/portals/donor-dashboard";
import ProviderDashboard from "@/components/portals/provider-dashboard";
import BeneficiaryDashboard from "@/components/portals/beneficiary-dashboard";
import AdminDashboard from "@/components/portals/admin-dashboard";

export default function DashboardPage() {
  const { isAuthenticated, currentRole } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-background">
      {currentRole === "donor" && <DonorDashboard />}
      {currentRole === "provider" && <ProviderDashboard />}
      {currentRole === "beneficiary" && <BeneficiaryDashboard />}
      {currentRole === "admin" && <AdminDashboard />}
    </main>
  );
}
