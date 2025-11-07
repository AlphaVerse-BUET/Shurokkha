"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Info,
  Zap
} from "lucide-react"
import { useState } from "react"

interface MatchingFactor {
  name: string
  weight: number
  value: number
  reasoning: string
  icon: React.ReactNode
}

interface MatchingExplainerProps {
  providerName: string
  trustScore: number
  matchScore: number
  factors: MatchingFactor[]
  donorPreferences: {
    minRating?: number
    divisions?: string[]
    crisisTypes?: string[]
  }
}

export function MatchingExplainer({
  providerName,
  trustScore,
  matchScore,
  factors,
  donorPreferences,
}: MatchingExplainerProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="space-y-4">
      <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Why {providerName}?
              </CardTitle>
              <CardDescription>
                AI matched this provider based on your preferences and their performance
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-base px-3 py-2">
              {matchScore}% Match
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground">Trust Score</p>
              <p className="text-2xl font-bold text-primary">{trustScore}</p>
              <p className="text-xs text-green-600 mt-1">✓ Verified Provider</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground">Your Preferences</p>
              <p className="text-lg font-bold text-blue-600">{factors.filter(f => f.value > 0.7).length}/{factors.length}</p>
              <p className="text-xs text-blue-600 mt-1">✓ Aligned</p>
            </div>
          </div>

          {/* Matching Factors Breakdown */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between"
            onClick={() => setExpanded(!expanded)}
          >
            <span className="font-semibold">See How AI Decided</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>

          {expanded && (
            <div className="space-y-3 pt-3 border-t border-border/30">
              {factors.map((factor, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {factor.icon}
                      <span className="font-medium text-sm">{factor.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {(factor.weight * 100).toFixed(0)}% weight
                      </Badge>
                    </div>
                    <span className="font-bold text-primary">{(factor.value * 100).toFixed(0)}%</span>
                  </div>
                  
                  {/* Visual bar */}
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        factor.value > 0.8
                          ? "bg-green-500"
                          : factor.value > 0.6
                          ? "bg-blue-500"
                          : factor.value > 0.4
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${factor.value * 100}%` }}
                    />
                  </div>
                  
                  <p className="text-xs text-muted-foreground italic">{factor.reasoning}</p>
                </div>
              ))}

              {/* Donor Preference Alignment */}
              <div className="mt-4 pt-4 border-t border-border/30 space-y-2">
                <p className="font-semibold text-sm">✓ Your Preferences Matched</p>
                {donorPreferences.minRating && (
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>
                      Provider rating {trustScore >= donorPreferences.minRating ? `✓` : `✗`} {donorPreferences.minRating}+ stars
                    </span>
                  </div>
                )}
                {donorPreferences.divisions && (
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Operating in your preferred divisions</span>
                  </div>
                )}
                {donorPreferences.crisisTypes && (
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Specializes in {donorPreferences.crisisTypes.join(", ")}</span>
                  </div>
                )}
              </div>

              {/* Confidence Score */}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">AI Confidence</p>
                    <p className="text-xs text-blue-800 dark:text-blue-400">
                      {matchScore}% confidence this provider will successfully deliver your donation based on historical data, current capacity, and your preferences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default MatchingExplainer
