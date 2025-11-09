"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/store/app-store";
import { useCurrency } from "@/contexts/currency-context";
import AdminFinancialCenter from "@/components/admin/financial-center";
import AdminFraudDetection from "@/components/admin/fraud-detection";
import AdminCrisisManagement from "@/components/admin/crisis-management";
import AdminProviderManagement from "@/components/admin/provider-management";
import {
  BarChart3,
  AlertTriangle,
  Globe,
  Users,
  Shield,
  Plus,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockDonations, mockProviders } from "@/store/mock-data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { currentUser } = useAppStore();
  const { formatAbbreviated } = useCurrency();
  const [activeTab, setActiveTab] = useState<
    "financial" | "fraud" | "crises" | "providers"
  >("financial");
  const router = useRouter();

  // Calculate key metrics
  const metrics = useMemo(() => {
    const totalDonated = mockDonations.reduce((sum, d) => sum + d.amount, 0);
    const totalFees = mockDonations.reduce(
      (sum, d) => sum + d.transactionFee,
      0
    );
    const activeProviders = mockProviders.filter(
      (p) => p.status === "active"
    ).length;
    const totalBeneficiaries = mockProviders.reduce(
      (sum, p) => sum + p.totalAidedBeneficiaries,
      0
    );

    return {
      totalDonated,
      totalFees,
      activeProviders,
      totalBeneficiaries,
      platformHealth: 98,
    };
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-red-900/5">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                Admin Dashboard
                <Badge variant="destructive" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  AI Fraud Detection
                </Badge>
              </h1>
              <p className="text-sm text-foreground/60 mt-1">
                Welcome back, Admin {currentUser?.name || "User"}
              </p>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Manual Add
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => router.push("/crises?addCrisis=true")}
                  >
                    Add Crisis
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/admin/providers/add")}
                  >
                    Add Provider
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/admin/beneficiaries/add")}
                  >
                    Add Beneficiary
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={() => router.push("/admin/profile")}
                variant="outline"
                className="gap-2"
              >
                <User className="w-4 h-4" />
                My Profile
              </Button>
            </div>
          </div>

          {/* Quick metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            <div className="bg-card border border-border/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-primary">
                {formatAbbreviated(metrics.totalDonated)}
              </div>
              <p className="text-xs text-foreground/60 mt-1">Total Donations</p>
            </div>
            <div className="bg-card border border-border/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-accent">
                {formatAbbreviated(metrics.totalFees)}
              </div>
              <p className="text-xs text-foreground/60 mt-1">Platform Fees</p>
            </div>
            <div className="bg-card border border-border/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-secondary">
                {metrics.activeProviders}
              </div>
              <p className="text-xs text-foreground/60 mt-1">
                Active Providers
              </p>
            </div>
            <div className="bg-card border border-border/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">
                {metrics.totalBeneficiaries.toLocaleString()}
              </div>
              <p className="text-xs text-foreground/60 mt-1">
                Beneficiaries Helped
              </p>
            </div>
            <div className="bg-card border border-border/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {metrics.platformHealth}%
              </div>
              <p className="text-xs text-foreground/60 mt-1">Platform Health</p>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="flex gap-2 overflow-x-auto pb-4">
            {[
              { id: "financial", label: "Financial Center", icon: BarChart3 },
              { id: "fraud", label: "Fraud Detection", icon: AlertTriangle },
              { id: "crises", label: "Crisis Management", icon: Globe },
              { id: "providers", label: "Provider Management", icon: Users },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === id
                    ? "bg-red-600 text-white"
                    : "bg-card border border-border/50 text-foreground/70 hover:border-red-600/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "financial" && (
          <AdminFinancialCenter metrics={metrics} />
        )}
        {activeTab === "fraud" && <AdminFraudDetection />}
        {activeTab === "crises" && <AdminCrisisManagement />}
        {activeTab === "providers" && <AdminProviderManagement />}
      </div>
    </div>
  );
}
