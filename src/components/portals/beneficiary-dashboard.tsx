"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Users,
  User,
  Clock,
  TrendingUp,
  AlertCircle,
  Package,
  MapPin,
  Phone,
  FileText,
  Eye,
  Calendar,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Search,
  Settings,
  ShieldCheck,
} from "lucide-react";
import {
  mockBeneficiaries,
  mockProviders,
  mockDistributionProofs,
} from "@/store/mock-data";
import { useRouter } from "next/navigation";
import { useBeneficiaryStatus } from "@/hooks/use-beneficiary-status";
import { DistributionProofViewer } from "@/components/shared/distribution-proof-viewer";
import { ApplicationTimeline } from "@/components/beneficiary/application-timeline";
import {
  AIInsightsCard,
  generateBeneficiaryInsights,
} from "../../../components/shared/ai-insights-card";
import { useState } from "react";
import type { Beneficiary } from "@/types";
import { useCurrency } from "@/contexts/currency-context";
import BeneficiaryApplicationFormImproved from "@/components/beneficiary/application-form-improved";
import BeneficiaryStatusTracking from "@/components/beneficiary/status-tracking";
import BeneficiaryPrivacyControls from "@/components/beneficiary/privacy-controls";
import ProviderBrowser from "@/components/beneficiary/provider-browser";

export default function BeneficiaryDashboard() {
  const router = useRouter();
  const beneficiary = mockBeneficiaries[0];
  const status = useBeneficiaryStatus(beneficiary);
  const {
    progress: applicationProgress,
    statusColor,
    statusLabel,
    verificationBadge,
  } = status;
  const { formatAmount } = useCurrency();

  const [activeTab, setActiveTab] = useState<
    "overview" | "providers" | "new-application" | "tracking" | "privacy"
  >("overview");

  // State for viewing application details
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showDistributionProof, setShowDistributionProof] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Get all applications from providerApplications
  const allApplications = beneficiary.providerApplications || [];

  // Separate current and historical applications
  const currentYearApplications = allApplications.filter((app) =>
    app.appliedDate.startsWith("2025")
  );
  const historicalApplications = allApplications.filter(
    (app) => !app.appliedDate.startsWith("2025")
  );

  // Get current application (most recent ongoing)
  const currentApplication =
    currentYearApplications.find(
      (app) =>
        app.status === "in-progress" ||
        app.status === "applied" ||
        app.status === "accepted"
    ) || currentYearApplications[0];

  // Pagination for historical applications
  const totalPages = Math.ceil(historicalApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = historicalApplications.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusConfig = (status: string) => {
    const configs = {
      completed: {
        color: "bg-green-500 text-white",
        icon: CheckCircle,
        label: "Completed",
      },
      "in-progress": {
        color: "bg-blue-500 text-white",
        icon: Clock,
        label: "In Progress",
      },
      accepted: {
        color: "bg-purple-500 text-white",
        icon: TrendingUp,
        label: "Accepted",
      },
      rejected: {
        color: "bg-red-500 text-white",
        icon: XCircle,
        label: "Rejected",
      },
      applied: {
        color: "bg-yellow-500 text-white",
        icon: AlertCircle,
        label: "Applied",
      },
    };
    return configs[status as keyof typeof configs] || configs.applied;
  };

  const getProviderForApplication = (providerId: string) => {
    return mockProviders.find((p) => p.id === providerId);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                Beneficiary Portal
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Protected
                </Badge>
              </h1>
              <p className="text-sm text-foreground/60 mt-1">
                Welcome back, {beneficiary.fullName}
              </p>
            </div>
            <Button
              onClick={() => router.push("/beneficiary/profile")}
              variant="outline"
              className="gap-2"
            >
              <User className="w-4 h-4" />
              My Profile
            </Button>
          </div>

          {/* Tab navigation */}
          <div className="flex gap-2 overflow-x-auto pb-4">
            {[
              { id: "overview", label: "Overview", icon: FileText },
              { id: "providers", label: "Browse Providers", icon: Search },
              {
                id: "new-application",
                label: "New Application",
                icon: Package,
              },
              { id: "tracking", label: "Track Application", icon: Clock },
              { id: "privacy", label: "Privacy Controls", icon: ShieldCheck },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border/50 text-foreground/70 hover:border-primary/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Applications
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {allApplications.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {
                      allApplications.filter((a) => a.status === "completed")
                        .length
                    }
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Successfully received
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    In Progress
                  </CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {
                      allApplications.filter(
                        (a) =>
                          a.status === "in-progress" ||
                          a.status === "applied" ||
                          a.status === "accepted"
                      ).length
                    }
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Active cases
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Received
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600">
                    {formatAmount(
                      allApplications.reduce(
                        (sum, a) => sum + (a.amountReceived || 0),
                        0
                      )
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Lifetime assistance
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Current Application Details */}
            {currentApplication && (
              <Card className="border-blue-500/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        Current Application (2025)
                      </CardTitle>
                      <CardDescription>
                        Your active application - {beneficiary.needCategory}{" "}
                        assistance
                      </CardDescription>
                    </div>
                    <Badge
                      className={
                        getStatusConfig(currentApplication.status).color
                      }
                    >
                      {getStatusConfig(currentApplication.status).label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Application Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Need Category
                      </p>
                      <p className="font-medium capitalize">
                        {beneficiary.needCategory}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Amount Requested
                      </p>
                      <p className="font-medium text-lg text-emerald-600">
                        {formatAmount(beneficiary.amountRequested)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Applied Date
                      </p>
                      <p className="font-medium">
                        {new Date(beneficiary.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Verification Status
                      </p>
                      <Badge className={verificationBadge.color}>
                        {verificationBadge.text}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Description
                    </p>
                    <p className="text-sm bg-muted p-3 rounded-lg">
                      {beneficiary.needDescription}
                    </p>
                  </div>

                  {/* Application Timeline */}
                  <ApplicationTimeline
                    beneficiary={beneficiary}
                    provider={
                      beneficiary.allocatedProviderId
                        ? getProviderForApplication(
                            beneficiary.allocatedProviderId
                          )
                        : null
                    }
                    showProofStatus={true}
                  />

                  {/* Provider Matching History for Current Year */}
                  {currentYearApplications.length > 1 && (
                    <div>
                      <h4 className="font-semibold mb-3">
                        Suggested Providers Based on Previous History (2025)
                      </h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        Based on your application history, the system has
                        suggested these providers as good matches for your
                        current needs
                      </p>
                      <div className="space-y-2">
                        {currentYearApplications.map((app, idx) => {
                          const provider = getProviderForApplication(
                            app.providerId
                          );
                          const statusConfig = getStatusConfig(app.status);
                          const StatusIcon = statusConfig.icon;

                          return (
                            <div
                              key={idx}
                              className="p-3 border rounded-lg flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <StatusIcon className="h-5 w-5" />
                                <div>
                                  <p className="font-medium">
                                    {provider?.organizationName ||
                                      "Unknown Provider"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Matched:{" "}
                                    {new Date(
                                      app.appliedDate
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <Badge className={statusConfig.color}>
                                {statusConfig.label}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Historical Applications */}
            {historicalApplications.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-purple-500" />
                        Previous Applications ({historicalApplications.length})
                      </CardTitle>
                      <CardDescription>
                        Your application history from previous years
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paginatedApplications.map((app, idx) => {
                    const provider = getProviderForApplication(app.providerId);
                    const statusConfig = getStatusConfig(app.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <Card key={idx} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                                <StatusIcon className="h-6 w-6 text-accent" />
                              </div>
                              <div>
                                <h4 className="font-semibold">
                                  {provider?.organizationName ||
                                    "Unknown Provider"}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Applied:{" "}
                                  {new Date(
                                    app.appliedDate
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Badge className={statusConfig.color}>
                              {statusConfig.label}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                            {app.responseDate && (
                              <div>
                                <p className="text-muted-foreground text-xs">
                                  Response Date
                                </p>
                                <p className="font-medium">
                                  {new Date(
                                    app.responseDate
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                            {app.completionDate && (
                              <div>
                                <p className="text-muted-foreground text-xs">
                                  Completed Date
                                </p>
                                <p className="font-medium">
                                  {new Date(
                                    app.completionDate
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                            {app.amountReceived && (
                              <div>
                                <p className="text-muted-foreground text-xs">
                                  Amount Received
                                </p>
                                <p className="font-medium text-green-600">
                                  {formatAmount(app.amountReceived)}
                                </p>
                              </div>
                            )}
                            {app.rating && (
                              <div>
                                <p className="text-muted-foreground text-xs">
                                  Your Rating
                                </p>
                                <div className="flex gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-4 h-4 rounded ${
                                        i < app.rating!
                                          ? "bg-yellow-400"
                                          : "bg-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {app.rejectionReason && (
                            <div className="p-2 bg-red-50 dark:bg-red-950 border border-red-200 rounded text-sm mb-3">
                              <p className="text-red-700 dark:text-red-300">
                                <strong>Reason:</strong> {app.rejectionReason}
                              </p>
                            </div>
                          )}

                          {app.feedback && (
                            <div className="p-2 bg-green-50 dark:bg-green-950 border border-green-200 rounded text-sm mb-3">
                              <p className="text-green-700 dark:text-green-300">
                                <strong>Your Feedback:</strong> "{app.feedback}"
                              </p>
                            </div>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2"
                            onClick={() => setSelectedApplication(app)}
                          >
                            <Eye className="h-4 w-4" />
                            View Full Details
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                          }
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Application Details Modal */}
            {selectedApplication && (
              <Card className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full z-50 shadow-2xl overflow-y-auto max-h-[90vh]">
                <CardHeader className="sticky top-0 bg-background border-b z-10">
                  <div className="flex items-center justify-between">
                    <CardTitle>Application Details</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedApplication(null)}
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {(() => {
                    const provider = getProviderForApplication(
                      selectedApplication.providerId
                    );
                    const statusConfig = getStatusConfig(
                      selectedApplication.status
                    );
                    const StatusIcon = statusConfig.icon;

                    return (
                      <>
                        <div className="flex items-center gap-3 pb-4 border-b">
                          <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center">
                            <StatusIcon className="h-8 w-8 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {provider?.organizationName}
                            </h3>
                            <Badge className={statusConfig.color}>
                              {statusConfig.label}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Applied Date
                            </p>
                            <p className="font-medium">
                              {new Date(
                                selectedApplication.appliedDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          {selectedApplication.responseDate && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                Response Date
                              </p>
                              <p className="font-medium">
                                {new Date(
                                  selectedApplication.responseDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {selectedApplication.completionDate && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                Completion Date
                              </p>
                              <p className="font-medium">
                                {new Date(
                                  selectedApplication.completionDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {selectedApplication.amountReceived && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                Amount Received
                              </p>
                              <p className="font-medium text-xl text-green-600">
                                {formatAmount(
                                  selectedApplication.amountReceived
                                )}
                              </p>
                            </div>
                          )}
                        </div>

                        {provider && (
                          <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-2">
                              Provider Information
                            </p>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{provider.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  {provider.geographicFocus.divisions.join(
                                    ", "
                                  )}
                                </span>
                              </div>
                              <div className="flex gap-2 flex-wrap mt-2">
                                <Badge>
                                  Trust Score: {provider.trustScore}/100
                                </Badge>
                                <Badge variant="outline">
                                  {provider.completionRate}% Completion
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedApplication.rejectionReason && (
                          <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg">
                            <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                              Rejection Reason
                            </p>
                            <p className="text-sm text-red-700 dark:text-red-300">
                              {selectedApplication.rejectionReason}
                            </p>
                          </div>
                        )}

                        {selectedApplication.rating && (
                          <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 rounded-lg">
                            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
                              Your Rating
                            </p>
                            <div className="flex gap-1 mb-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-6 h-6 rounded ${
                                    i < selectedApplication.rating!
                                      ? "bg-yellow-400"
                                      : "bg-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            {selectedApplication.feedback && (
                              <p className="text-sm text-green-700 dark:text-green-300 italic">
                                "{selectedApplication.feedback}"
                              </p>
                            )}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            )}

            {/* AI Insights - Moved to bottom */}
            <AIInsightsCard
              insights={generateBeneficiaryInsights({
                applicationsCount: allApplications.length,
                completedCount: allApplications.filter(
                  (app) => app.status === "completed"
                ).length,
                currentStatus: currentApplication?.status || "none",
              })}
            />
          </div>
        )}

        {/* Other tabs would go here */}
        {activeTab === "providers" && <ProviderBrowser />}

        {activeTab === "new-application" && (
          <BeneficiaryApplicationFormImproved />
        )}

        {activeTab === "tracking" && <BeneficiaryStatusTracking />}

        {activeTab === "privacy" && <BeneficiaryPrivacyControls />}
      </main>

      {/* Overlay for modal */}
      {selectedApplication && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
}
