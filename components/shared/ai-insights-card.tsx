import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AIInsight {
  id: string;
  type: "success" | "warning" | "info" | "alert";
  title: string;
  message: string;
  confidence: number; // 0-100
  actionLabel?: string;
  actionUrl?: string;
}

interface AIInsightsCardProps {
  insights: AIInsight[];
  className?: string;
}

const insightIcons = {
  success: TrendingUp,
  warning: AlertTriangle,
  info: Info,
  alert: TrendingDown,
};

const insightColors = {
  success:
    "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 border-green-200",
  warning:
    "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950 border-yellow-200",
  info: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border-blue-200",
  alert:
    "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border-red-200",
};

const badgeColors = {
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  warning:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  alert: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function AIInsightsCard({ insights, className }: AIInsightsCardProps) {
  if (insights.length === 0) {
    return null;
  }

  return (
    <Card className={cn("border-2", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI Insights
          <Badge variant="secondary" className="ml-auto text-xs">
            Powered by AI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight) => {
          const Icon = insightIcons[insight.type];
          const colorClass = insightColors[insight.type];
          const badgeClass = badgeColors[insight.type];

          return (
            <div
              key={insight.id}
              className={cn(
                "p-4 rounded-lg border-2 transition-all hover:shadow-md",
                colorClass
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 mt-0.5 shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                    <Badge className={cn("text-xs", badgeClass)}>
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm opacity-90">{insight.message}</p>
                  {insight.actionLabel && insight.actionUrl && (
                    <a
                      href={insight.actionUrl}
                      className="text-sm font-medium underline hover:opacity-80 transition inline-block mt-2"
                    >
                      {insight.actionLabel} →
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/**
 * Mock AI Insights Generator
 * Replace with real AI API calls in production
 */
export function generateDonorInsights(donorData: {
  totalDonated: number;
  allocations: number;
  completionRate: number;
}): AIInsight[] {
  const insights: AIInsight[] = [];

  // Insight 1: Donation pattern analysis
  if (donorData.totalDonated > 50000) {
    insights.push({
      id: "donor-1",
      type: "success",
      title: "High Impact Donor",
      message: `You're in the top 15% of donors. Your ${donorData.totalDonated.toLocaleString()}৳ has helped multiple families. Consider monthly recurring donations for consistent impact.`,
      confidence: 92,
      actionLabel: "Set up recurring donation",
      actionUrl: "/donate/new?recurring=true",
    });
  }

  // Insight 2: Completion rate analysis
  if (donorData.completionRate === 100 && donorData.allocations > 0) {
    insights.push({
      id: "donor-2",
      type: "success",
      title: "Perfect Track Record",
      message:
        "All your allocations completed successfully! Providers you've supported have 98% average trust score.",
      confidence: 100,
    });
  } else if (donorData.completionRate < 80) {
    insights.push({
      id: "donor-2",
      type: "warning",
      title: "Allocation Delays Detected",
      message: `${
        100 - donorData.completionRate
      }% of allocations are pending. This is normal for recent donations but consider diversifying providers.`,
      confidence: 85,
      actionLabel: "View allocation details",
      actionUrl: "/dashboard?tab=allocations",
    });
  }

  // Insight 3: AI recommendation
  insights.push({
    id: "donor-3",
    type: "info",
    title: "Smart Matching Available",
    message:
      "AI has identified 3 high-priority crises matching your donation preferences. Average delivery time: 4.2 days.",
    confidence: 88,
    actionLabel: "View matched crises",
    actionUrl: "/crises?filter=matched",
  });

  return insights;
}

export function generateProviderInsights(providerData: {
  trustScore: number;
  completedCases: number;
  avgResponseTime: number;
}): AIInsight[] {
  const insights: AIInsight[] = [];

  // Insight 1: Trust score analysis
  if (providerData.trustScore >= 90) {
    insights.push({
      id: "provider-1",
      type: "success",
      title: "Excellent Trust Score",
      message: `Your ${providerData.trustScore}% trust score is 12% above platform average. You're eligible for premium donor matching.`,
      confidence: 95,
    });
  } else if (providerData.trustScore < 75) {
    insights.push({
      id: "provider-1",
      type: "alert",
      title: "Trust Score Needs Improvement",
      message:
        "Your trust score dropped 8% this month. Focus on faster response times and document verification to improve.",
      confidence: 91,
      actionLabel: "View improvement tips",
      actionUrl: "/provider/analytics?focus=trust",
    });
  }

  // Insight 2: Response time analysis
  if (providerData.avgResponseTime < 2) {
    insights.push({
      id: "provider-2",
      type: "success",
      title: "Fast Response Champion",
      message: `Your ${providerData.avgResponseTime.toFixed(
        1
      )}h average response time is 65% faster than platform average.`,
      confidence: 93,
    });
  } else if (providerData.avgResponseTime > 5) {
    insights.push({
      id: "provider-2",
      type: "warning",
      title: "Response Time Alert",
      message:
        "Donors prefer providers with <2h response time. Consider enabling push notifications for new applications.",
      confidence: 87,
      actionLabel: "Enable notifications",
      actionUrl: "/settings?section=notifications",
    });
  }

  // Insight 3: AI opportunity
  insights.push({
    id: "provider-3",
    type: "info",
    title: "New Beneficiaries Matched",
    message: `AI has matched ${
      Math.floor(Math.random() * 5) + 3
    } beneficiaries to your organization based on location and expertise.`,
    confidence: 89,
    actionLabel: "Review matches",
    actionUrl: "/provider/matching",
  });

  return insights;
}

export function generateBeneficiaryInsights(beneficiaryData: {
  applicationsCount: number;
  completedCount: number;
  currentStatus: string;
}): AIInsight[] {
  const insights: AIInsight[] = [];

  // Insight 1: Application status
  if (beneficiaryData.currentStatus === "matched") {
    insights.push({
      id: "beneficiary-1",
      type: "success",
      title: "Provider Match Found!",
      message:
        "AI has matched you with a highly-rated provider (96% trust score). Expected delivery: 3-5 days.",
      confidence: 94,
      actionLabel: "View provider details",
      actionUrl: "/beneficiary/providers",
    });
  } else if (beneficiaryData.currentStatus === "pending") {
    insights.push({
      id: "beneficiary-1",
      type: "info",
      title: "Application Under Review",
      message:
        "Your documents are being verified by AI. Average verification time: 2-4 hours.",
      confidence: 88,
    });
  }

  // Insight 2: Alternative providers
  if (beneficiaryData.applicationsCount > 0) {
    insights.push({
      id: "beneficiary-2",
      type: "info",
      title: "Alternative Providers Available",
      message:
        "AI found 2 additional providers in your area with faster response times. Consider applying to increase chances.",
      confidence: 85,
      actionLabel: "Browse providers",
      actionUrl: "/beneficiary/providers",
    });
  }

  // Insight 3: Privacy tip
  insights.push({
    id: "beneficiary-3",
    type: "info",
    title: "Privacy Controls Active",
    message:
      "Your data is protected by triple-layer encryption. Only matched providers can see your contact information.",
    confidence: 100,
  });

  return insights;
}
