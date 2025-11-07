"use client";

import { useAppStore } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BangladeshMap } from "../../components/bangladesh-map";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, AlertTriangle, DollarSign } from "lucide-react";

export default function ImpactMapPage() {
  const router = useRouter();
  const { isAuthenticated, currentRole } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated || currentRole !== "donor") {
      router.push("/auth/login?role=donor");
    }
  }, [isAuthenticated, currentRole, router]);

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-background to-accent/5">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                Bangladesh Impact Map
              </h1>
              <p className="text-muted-foreground">
                Real-time visualization of crisis severity and aid distribution
                across Bangladesh divisions
              </p>
            </div>
            <Badge variant="secondary" className="text-sm font-medium">
              🤖 AI-Powered Analytics
            </Badge>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 border-l-4 border-l-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Population at Risk
                </p>
                <p className="text-2xl font-bold mt-1">287K+</p>
              </div>
              <Users className="h-8 w-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-destructive">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Crises</p>
                <p className="text-2xl font-bold mt-1">247</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive opacity-20" />
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  High Severity Divisions
                </p>
                <p className="text-2xl font-bold mt-1">3</p>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Funding Gap</p>
                <p className="text-2xl font-bold mt-1">৳42.3M</p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-500 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Real Bangladesh Impact Visualization Map */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <Card className="p-6 bg-linear-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-950/20 dark:via-blue-950/20 dark:to-purple-950/20">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                🗺️ Geographic Impact Distribution Map
                <Badge variant="secondary" className="text-xs">
                  Your Donations
                </Badge>
              </h2>
              <p className="text-sm text-muted-foreground">
                Visual representation of where your donations have made real
                impact across Bangladesh - showing aid distribution density and
                verified delivery locations
              </p>
            </div>
            <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden border-2 border-primary/20 bg-linear-to-br from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30">
              <img
                src="https://www.researchgate.net/profile/Kabir-Uddin/publication/352515872/figure/fig7/AS:1076161652240407@1633588340135/Flood-hazard-map-of-Bangladesh.jpg"
                alt="Bangladesh Impact Map - Geographic distribution of aid and donations across divisions"
                className="w-full h-full object-contain bg-white dark:bg-slate-900"
                onError={(e) => {
                  // Fallback: Show placeholder if image fails to load
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget
                    .nextElementSibling as HTMLElement;
                  if (fallback) fallback.classList.remove("hidden");
                }}
              />
              <div className="hidden absolute inset-0 items-center justify-center bg-muted">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="text-xl font-bold mb-2">
                    Bangladesh Impact Distribution Map
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Geographic visualization of verified aid delivery and
                    donation impact zones
                  </p>
                  <div className="mt-6 grid grid-cols-5 gap-2 max-w-md mx-auto">
                    <div className="text-center">
                      <div className="w-full h-8 bg-emerald-600 rounded mb-1"></div>
                      <span className="text-xs">Very High Impact</span>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-8 bg-blue-500 rounded mb-1"></div>
                      <span className="text-xs">High Impact</span>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-8 bg-yellow-500 rounded mb-1"></div>
                      <span className="text-xs">Medium</span>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-8 bg-orange-500 rounded mb-1"></div>
                      <span className="text-xs">Low</span>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-8 bg-gray-400 rounded mb-1"></div>
                      <span className="text-xs">No Data</span>
                    </div>
                  </div>
                  <div className="mt-6 text-xs text-muted-foreground">
                    <p>
                      📍 Darker areas = Higher concentration of verified
                      deliveries
                    </p>
                    <p>✓ All locations GPS-verified with photo proof</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                📊 Impact density visualization based on your contribution
                history
              </span>
              <span>🔄 Updated: Real-time as deliveries are verified</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center text-sm">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded">
                <div className="font-bold text-emerald-600 dark:text-emerald-400">
                  42 Locations
                </div>
                <div className="text-xs text-muted-foreground">
                  Verified Deliveries
                </div>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
                <div className="font-bold text-blue-600 dark:text-blue-400">
                  6 Divisions
                </div>
                <div className="text-xs text-muted-foreground">
                  Coverage Area
                </div>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded">
                <div className="font-bold text-purple-600 dark:text-purple-400">
                  100% GPS
                </div>
                <div className="text-xs text-muted-foreground">
                  Location Verified
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6 bg-linear-to-br from-primary/5 via-secondary/5 to-accent/5">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">
                  Interactive Division Map
                </h2>
                <p className="text-sm text-muted-foreground">
                  Click on any division to view detailed crisis information,
                  affected population, and funding needs
                </p>
              </div>
              <BangladeshMap />
            </Card>
          </div>

          {/* Side Panel - Impact Summary & Top Crises */}
          <div className="space-y-4">
            <Card className="p-6 border-l-4 border-l-primary">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Your Impact Summary
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <div className="text-3xl font-bold text-primary">৳40,000</div>
                  <div className="text-sm text-muted-foreground">
                    Total Donated This Year
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    🎯 Top 5% of donors
                  </div>
                </div>
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <div className="text-3xl font-bold text-secondary">42</div>
                  <div className="text-sm text-muted-foreground">
                    Beneficiaries Reached
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    📍 Across 6 divisions
                  </div>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg">
                  <div className="text-3xl font-bold text-accent">6</div>
                  <div className="text-sm text-muted-foreground">
                    Divisions Helped
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    🌟 Nationwide impact
                  </div>
                </div>
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    100%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Delivery Success Rate
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    ✓ All verified with GPS + Photo
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-destructive">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Top Crises You Helped
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm">
                      Sylhet Flooding
                    </span>
                    <span className="font-bold text-primary">৳25,000</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    38,000 affected • Severity: 92/100
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                    ✓ Delivered to 18 families
                  </div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm">
                      Cyclone Recovery (Khulna)
                    </span>
                    <span className="font-bold text-primary">৳15,000</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    32,000 affected • Severity: 88/100
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                    ✓ Delivered to 12 families
                  </div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm">
                      Urban Poverty (Dhaka)
                    </span>
                    <span className="font-bold text-secondary">৳8,000</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    45,000 affected • Severity: 75/100
                  </div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    🚚 In delivery (4/8 families)
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-linear-to-br from-primary/10 to-secondary/10">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Users className="h-5 w-5" />
                AI Insight
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your donations have reached beneficiaries{" "}
                <span className="font-bold text-primary">88% faster</span> than
                traditional charity methods.
                <span className="block mt-2">
                  Based on your preferences, we recommend donating to{" "}
                  <span className="font-bold text-secondary">
                    Chittagong Division
                  </span>{" "}
                  next—high need with 94% verified providers.
                </span>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
