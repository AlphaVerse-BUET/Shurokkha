"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mockCrises } from "@/store/mock-data";
import { useAppStore } from "@/store/app-store";
import CrisisCard from "@/components/crisis-card";
import CrisisDetailModal from "@/components/crisis-detail-modal";
import DonationFlowModal from "@/components/donation-flow-modal";
import CreateCrisisModal from "@/components/create-crisis-modal";
import { Filter, AlertCircle, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type FilterType = "type" | "severity" | "location";
type CrisisTypeFilter =
  | "flood"
  | "fire"
  | "medical"
  | "poverty"
  | "education"
  | "livelihood"
  | "all";

const CRISIS_TYPES = [
  "flood",
  "fire",
  "medical",
  "poverty",
  "education",
  "livelihood",
] as const;
const DIVISIONS = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Khulna",
  "Rajshahi",
  "Barisal",
  "Rangpur",
  "Mymensingh",
];

export default function CrisisIssueDetection() {
  const { login, isAuthenticated, currentRole } = useAppStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters state
  const [selectedTypes, setSelectedTypes] = useState<CrisisTypeFilter[]>([
    "all",
  ]);
  const [severityMin, setSeverityMin] = useState(0);
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<
    "trending" | "newest" | "severity" | "funding-gap"
  >("trending");

  // Modal states
  const [selectedCrisis, setSelectedCrisis] = useState<string | null>(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationCrisisId, setDonationCrisisId] = useState<string | null>(null);
  const [showCreateCrisisModal, setShowCreateCrisisModal] = useState(false);

  // Check URL params for modal trigger
  useEffect(() => {
    const addCrisis = searchParams.get("addCrisis");
    if (addCrisis === "true" && (currentRole === "admin" || currentRole === "provider")) {
      setShowCreateCrisisModal(true);
      // Clean up URL without reloading
      const url = new URL(window.location.href);
      url.searchParams.delete("addCrisis");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, currentRole]);

  // Filter crises
  const filteredCrises = useMemo(() => {
    let result = [...mockCrises];

    // Type filter
    if (!selectedTypes.includes("all")) {
      result = result.filter((c) =>
        selectedTypes.includes(c.type as CrisisTypeFilter)
      );
    }

    // Severity filter
    result = result.filter((c) => c.severity >= severityMin);

    // Division filter
    if (selectedDivisions.length > 0) {
      result = result.filter((c) =>
        selectedDivisions.includes(c.location.division)
      );
    }

    // Sort
    if (sortBy === "trending") {
      result.sort((a, b) => {
        if (a.trending && !b.trending) return -1;
        if (!a.trending && b.trending) return 1;
        return b.upvotes - a.upvotes;
      });
    } else if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === "severity") {
      result.sort((a, b) => b.severity - a.severity);
    } else if (sortBy === "funding-gap") {
      result.sort(
        (a, b) =>
          b.fundingNeeded -
          b.fundingReceived -
          (a.fundingNeeded - a.fundingReceived)
      );
    }

    return result;
  }, [selectedTypes, severityMin, selectedDivisions, sortBy]);

  const handleCrisisDonate = (crisisId: string) => {
    setDonationCrisisId(crisisId);
    setShowDonationModal(true);
    setSelectedCrisis(null);
  };

  const handleDonationStart = () => {
    // Transition to donor login
    const donor = {
      id: "donor-" + Math.random().toString(36).substr(2, 9),
      role: "donor" as const,
      name: "New Donor",
      email: "donor@shurokkha.com",
      phone: "+88017XXXXXXXX",
      verified: false,
      createdAt: new Date().toISOString(),
    };
    login(donor);
  };

  const toggleTypeFilter = (type: CrisisTypeFilter) => {
    if (type === "all") {
      setSelectedTypes(["all"]);
    } else {
      setSelectedTypes((prev) => {
        const newTypes = prev.filter((t) => t !== "all");
        if (newTypes.includes(type)) {
          return newTypes.filter((t) => t !== type);
        } else {
          return [...newTypes, type];
        }
      });
    }
  };

  const toggleDivision = (division: string) => {
    setSelectedDivisions((prev) =>
      prev.includes(division)
        ? prev.filter((d) => d !== division)
        : [...prev, division]
    );
  };

  const fundingStats = useMemo(() => {
    const total = filteredCrises.reduce((sum, c) => sum + c.fundingNeeded, 0);
    const received = filteredCrises.reduce(
      (sum, c) => sum + c.fundingReceived,
      0
    );
    const affected = filteredCrises.reduce(
      (sum, c) => sum + c.affectedPopulation,
      0
    );
    return { total, received, gap: total - received, affected };
  }, [filteredCrises]);

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-accent/5">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Crisis Detection Hub
              </h1>
              <p className="text-foreground/60 text-sm mt-1">
                Real-time AI monitoring • Satellite verification • Community
                validated
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col sm:text-right">
                <div className="text-2xl font-bold text-primary">
                  ৳{(fundingStats.gap / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs text-foreground/60">Funding Gap</div>
              </div>
              {isAuthenticated && (currentRole === "admin" || currentRole === "provider") && (
                <Button
                  onClick={() => setShowCreateCrisisModal(true)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Crisis
                </Button>
              )}
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-3 mt-6 p-3 bg-card rounded-lg border border-border/50">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {filteredCrises.length}
              </div>
              <div className="text-xs text-foreground/60">Active Crises</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-accent">
                {fundingStats.affected.toLocaleString()}
              </div>
              <div className="text-xs text-foreground/60">Affected People</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-primary">
                {((fundingStats.received / fundingStats.total) * 100).toFixed(
                  0
                )}
                %
              </div>
              <div className="text-xs text-foreground/60">Funded</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar filters */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Sort */}
              <div className="bg-card border border-border/50 rounded-lg p-4">
                <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full px-3 py-2 bg-background border border-border/50 rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label="Sort crises by"
                >
                  <option value="trending">Trending Now</option>
                  <option value="newest">Newest First</option>
                  <option value="severity">Most Severe</option>
                  <option value="funding-gap">Highest Gap</option>
                </select>
              </div>

              {/* Crisis Type Filter */}
              <div className="bg-card border border-border/50 rounded-lg p-4">
                <h3 className="font-semibold text-foreground text-sm mb-3">
                  Crisis Type
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes("all")}
                      onChange={() => toggleTypeFilter("all")}
                      className="w-4 h-4 rounded border-border/50 text-primary cursor-pointer"
                    />
                    <span className="text-sm text-foreground">All Types</span>
                  </label>
                  {CRISIS_TYPES.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedTypes.includes(type) &&
                          !selectedTypes.includes("all")
                        }
                        onChange={() => toggleTypeFilter(type)}
                        className="w-4 h-4 rounded border-border/50 text-primary cursor-pointer"
                      />
                      <span className="text-sm text-foreground capitalize">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Severity Filter */}
              <div className="bg-card border border-border/50 rounded-lg p-4">
                <h3 className="font-semibold text-foreground text-sm mb-3">
                  Min Severity
                </h3>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={severityMin}
                  onChange={(e) => setSeverityMin(Number(e.target.value))}
                  className="w-full h-2 bg-border/50 rounded-lg appearance-none cursor-pointer"
                  aria-label="Minimum severity filter"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-foreground/60">0</span>
                  <span className="text-sm font-medium text-primary">
                    {severityMin}
                  </span>
                  <span className="text-xs text-foreground/60">100</span>
                </div>
              </div>

              {/* Location Filter */}
              <div className="bg-card border border-border/50 rounded-lg p-4">
                <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Division
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {DIVISIONS.map((division) => (
                    <label
                      key={division}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDivisions.includes(division)}
                        onChange={() => toggleDivision(division)}
                        className="w-4 h-4 rounded border-border/50 text-primary cursor-pointer"
                      />
                      <span className="text-sm text-foreground">
                        {division}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {(selectedTypes.length > 1 ||
                selectedTypes[0] !== "all" ||
                severityMin > 0 ||
                selectedDivisions.length > 0) && (
                <button
                  onClick={() => {
                    setSelectedTypes(["all"]);
                    setSeverityMin(0);
                    setSelectedDivisions([]);
                  }}
                  className="w-full px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </aside>

          {/* Crisis grid */}
          <main className="lg:col-span-3">
            {filteredCrises.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
                <p className="text-foreground/60">
                  No crises match your filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCrises.map((crisis) => (
                  <div
                    key={crisis.id}
                    className="group cursor-pointer"
                    onClick={() => setSelectedCrisis(crisis.id)}
                  >
                    <CrisisCard
                      crisis={crisis}
                      onView={() => setSelectedCrisis(crisis.id)}
                      onDonate={() => handleCrisisDonate(crisis.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Crisis detail modal */}
      {selectedCrisis && (
        <CrisisDetailModal
          crisisId={selectedCrisis}
          onClose={() => setSelectedCrisis(null)}
          onDonate={() => handleCrisisDonate(selectedCrisis)}
        />
      )}

      {/* Donation flow modal */}
      {showDonationModal && donationCrisisId && (
        <DonationFlowModal
          crisisId={donationCrisisId}
          onClose={() => {
            setShowDonationModal(false);
            setDonationCrisisId(null);
          }}
          onComplete={handleDonationStart}
        />
      )}

      {/* Create crisis modal */}
      <CreateCrisisModal
        open={showCreateCrisisModal}
        onClose={() => setShowCreateCrisisModal(false)}
      />
    </div>
  );
}
