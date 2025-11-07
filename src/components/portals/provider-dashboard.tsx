"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/store/app-store";
import { mockProviders, mockDonations } from "@/store/mock-data";
import ProviderOverview from "@/components/provider/overview";
import ProviderMatchingPool from "@/components/provider/matching-pool";
import ProviderApplicationSubmission from "@/components/provider/application-submission";
import ProviderActiveDistributions from "@/components/provider/active-distributions";
import {
  AIInsightsCard,
  generateProviderInsights,
} from "../../../components/shared/ai-insights-card";
import {
  BarChart3,
  Users,
  FileText,
  Zap,
  Sparkles,
  User,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProviderDashboard() {
  const { currentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState<
    "overview" | "matching" | "applications" | "distributions"
  >("overview");
  const router = useRouter();

  // Get provider data
  const provider = useMemo(() => {
    return mockProviders[0]; // Demo with first provider
  }, []);

  // Calculate metrics
  const metrics = useMemo(() => {
    const availableMatching = mockDonations
      .filter((d) => d.status === "pending")
      .reduce((sum, d) => sum + d.amount, 0);

    return {
      trustScore: provider.trustScore,
      completionRate: provider.completionRate,
      averageRating: provider.averageRating,
      responseTimeHours: provider.responseTimeHours,
      totalAidedBeneficiaries: provider.totalAidedBeneficiaries,
      availableMatchingPool: availableMatching,
      activeBeneficiaries: mockDonations
        .flatMap((d) => d.allocations)
        .filter((a) => a.status === "in-progress").length,
    };
  }, [provider]);

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-secondary/5">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                Provider Dashboard
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Verified
                </Badge>
              </h1>
              <p className="text-sm text-foreground/60 mt-1">
                Welcome back, {provider.organizationName}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => router.push("/provider/bulk-upload")}
                variant="default"
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Bulk Upload
              </Button>
              <Button
                onClick={() => router.push("/provider/profile")}
                variant="outline"
                className="gap-2"
              >
                <User className="w-4 h-4" />
                My Profile
              </Button>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="flex gap-2 overflow-x-auto pb-4">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "matching", label: "Matching Pool", icon: Users },
              {
                id: "applications",
                label: "Submit Application",
                icon: FileText,
              },
              { id: "distributions", label: "Distributions", icon: Zap },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === id
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-card border border-border/50 text-foreground/70 hover:border-secondary/50"
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
        {activeTab === "overview" && (
          <div className="space-y-6">
            <ProviderOverview provider={provider} metrics={metrics} />
            <AIInsightsCard
              insights={generateProviderInsights({
                trustScore: provider.trustScore,
                completedCases: provider.totalAidedBeneficiaries,
                avgResponseTime: provider.responseTimeHours,
              })}
            />
          </div>
        )}
        {activeTab === "matching" && (
          <ProviderMatchingPool provider={provider} metrics={metrics} />
        )}
        {activeTab === "applications" && (
          <ProviderApplicationSubmission provider={provider} />
        )}
        {activeTab === "distributions" && (
          <ProviderActiveDistributions provider={provider} />
        )}
      </div>
    </div>
  );
}
