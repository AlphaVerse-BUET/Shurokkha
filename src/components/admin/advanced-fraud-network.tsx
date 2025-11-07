"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  Network,
  ChevronDown,
  ChevronUp,
  Zap,
  User,
  Building2,
  Link2,
  TrendingDown,
} from "lucide-react"
import { useState, useMemo } from "react"

interface FraudNode {
  id: string
  name: string
  type: "beneficiary" | "provider" | "donor"
  riskScore: number
  incidents: number
  status: "flagged" | "blacklisted" | "watchlist"
}

interface FraudConnection {
  from: string
  to: string
  reason: string
  confidence: number
  type: "duplicate-nid" | "cost-inflation" | "rapid-submission" | "network-ring" | "collusion"
}

interface FraudNetworkProps {
  nodes: FraudNode[]
  connections: FraudConnection[]
  totalFraudPrevented: number
  fraudRate: number
}

export function FraudDetectionNetwork({
  nodes,
  connections,
  totalFraudPrevented,
  fraudRate,
}: FraudNetworkProps) {
  const [expanded, setExpanded] = useState(false)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null)

  // Network analysis
  const networkAnalysis = useMemo(() => {
    const nodeMap = new Map(nodes.map(n => [n.id, n]))
    const connectionTypes = new Map<FraudConnection["type"], number>()
    const riskNodeGroups: Record<string, FraudNode[]> = {
      critical: [],
      high: [],
      medium: [],
    }

    connections.forEach(c => {
      const count = connectionTypes.get(c.type) || 0
      connectionTypes.set(c.type, count + 1)
    })

    nodes.forEach(node => {
      if (node.riskScore >= 80) riskNodeGroups.critical.push(node)
      else if (node.riskScore >= 60) riskNodeGroups.high.push(node)
      else if (node.riskScore >= 40) riskNodeGroups.medium.push(node)
    })

    const fraudRings = nodes.filter(n => {
      const connectedCount = connections.filter(c => c.from === n.id || c.to === n.id).length
      return connectedCount >= 3
    })

    return {
      connectionTypes,
      riskNodeGroups,
      fraudRings,
      totalConnections: connections.length,
      highestRiskNode: nodes.sort((a, b) => b.riskScore - a.riskScore)[0],
    }
  }, [nodes, connections])

  const fraudTypeLabels: Record<FraudConnection["type"], { label: string; color: string; icon: string }> = {
    "duplicate-nid": { label: "Duplicate NID", color: "text-red-600", icon: "🔴" },
    "cost-inflation": { label: "Cost Inflation", color: "text-orange-600", icon: "📈" },
    "rapid-submission": { label: "Rapid Submission", color: "text-yellow-600", icon: "⚡" },
    "network-ring": { label: "Fraud Ring", color: "text-red-700", icon: "🔗" },
    collusion: { label: "Donor-Provider Collusion", color: "text-purple-600", icon: "🤝" },
  }

  const getTypeColor = (type: FraudNode["type"]) => {
    switch (type) {
      case "beneficiary":
        return "bg-blue-100 dark:bg-blue-900 border-blue-300"
      case "provider":
        return "bg-green-100 dark:bg-green-900 border-green-300"
      case "donor":
        return "bg-purple-100 dark:bg-purple-900 border-purple-300"
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-2 border-red-200 dark:border-red-900 bg-linear-to-br from-red-50/50 to-transparent dark:from-red-950/20">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Network className="w-6 h-6 text-red-600" />
                  Fraud Detection Network
                </CardTitle>
                <CardDescription>
                  AI analysis of suspicious patterns and connections
                </CardDescription>
              </div>
              <div className="text-right space-y-2">
                <Badge variant="destructive" className="text-base px-3 py-2">
                  {fraudRate}% Fraud Rate
                </Badge>
                <Badge variant="secondary" className="block">
                  ৳{(totalFraudPrevented / 10000000).toFixed(1)}Cr Prevented
                </Badge>
              </div>
            </div>

            {/* Key metrics grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground">Nodes Analyzed</p>
                <p className="text-2xl font-bold text-primary">{nodes.length}</p>
                <p className="text-xs text-red-600 mt-1">Active Accounts</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground">Connections Found</p>
                <p className="text-2xl font-bold text-orange-600">{networkAnalysis.totalConnections}</p>
                <p className="text-xs text-orange-600 mt-1">Suspicious Links</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground">Fraud Rings Detected</p>
                <p className="text-2xl font-bold text-red-600">{networkAnalysis.fraudRings.length}</p>
                <p className="text-xs text-red-600 mt-1">Network Groups</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground">Critical Risk</p>
                <p className="text-2xl font-bold text-red-700">{networkAnalysis.riskNodeGroups.critical.length}</p>
                <p className="text-xs text-red-700 mt-1">High Priority</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* High-risk alert */}
          {networkAnalysis.highestRiskNode && (
            <div className="p-3 rounded-lg border-2 border-red-400 bg-red-50 dark:bg-red-950/30 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm text-red-900 dark:text-red-300">Highest Risk Node</p>
                <p className="text-sm text-red-800 dark:text-red-400 mt-1">
                  <strong>{networkAnalysis.highestRiskNode.name}</strong> (Risk Score: {networkAnalysis.highestRiskNode.riskScore}/100) - Connected to {connections.filter(c => c.from === networkAnalysis.highestRiskNode.id || c.to === networkAnalysis.highestRiskNode.id).length}{" "}
                  other accounts
                </p>
              </div>
            </div>
          )}

          {/* Fraud type distribution */}
          <div className="space-y-2">
            <p className="font-semibold text-sm">Fraud Pattern Distribution</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Array.from(networkAnalysis.connectionTypes.entries()).map(([type, count]) => (
                <div
                  key={type}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border/50"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>{fraudTypeLabels[type].icon}</span>
                    <span className="text-xs font-semibold">{fraudTypeLabels[type].label}</span>
                  </div>
                  <p className="text-xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">
                    {((count / networkAnalysis.totalConnections) * 100).toFixed(0)}% of fraud
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Toggle detailed view */}
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between"
            onClick={() => setExpanded(!expanded)}
          >
            <span className="font-semibold">
              {expanded ? "Hide" : "Show"} Network Details
            </span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>

          {expanded && (
            <div className="space-y-4 pt-4 border-t border-border/30">
              {/* Risk nodes */}
              {Object.entries(networkAnalysis.riskNodeGroups).map(([level, nodes]) =>
                nodes.length > 0 ? (
                  <div key={level} className="space-y-2">
                    <p className="font-semibold text-sm capitalize flex items-center gap-2">
                      {level === "critical" && <AlertTriangle className="w-4 h-4 text-red-600" />}
                      {level === "high" && <Zap className="w-4 h-4 text-orange-600" />}
                      {level === "medium" && <TrendingDown className="w-4 h-4 text-yellow-600" />}
                      {level} Risk ({nodes.length})
                    </p>
                    <div className="space-y-2">
                      {nodes.map(node => {
                        const connectedAccounts = connections.filter(
                          c => c.from === node.id || c.to === node.id
                        )
                        return (
                          <div
                            key={node.id}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedNode === node.id
                                ? "border-primary bg-primary/5"
                                : getTypeColor(node.type)
                            }`}
                            onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-2 flex-1">
                                {node.type === "beneficiary" && <User className="w-4 h-4 mt-0.5 shrink-0" />}
                                {node.type === "provider" && <Building2 className="w-4 h-4 mt-0.5 shrink-0" />}
                                {node.type === "donor" && <Zap className="w-4 h-4 mt-0.5 shrink-0" />}
                                <div className="min-w-0">
                                  <p className="font-semibold text-sm">{node.name}</p>
                                  <p className="text-xs text-muted-foreground capitalize">{node.type}</p>
                                </div>
                              </div>
                              <div className="text-right ml-2">
                                <Badge
                                  variant={node.status === "blacklisted" ? "destructive" : "secondary"}
                                  className="text-xs"
                                >
                                  {node.status}
                                </Badge>
                                <p className="text-xs font-bold text-red-600 mt-1">
                                  Risk: {node.riskScore}/100
                                </p>
                              </div>
                            </div>

                            {selectedNode === node.id && (
                              <div className="mt-3 pt-3 border-t border-border/30 space-y-2">
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <p className="text-muted-foreground">Incidents</p>
                                    <p className="font-bold text-red-600">{node.incidents}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Connected To</p>
                                    <p className="font-bold">{connectedAccounts.length} accounts</p>
                                  </div>
                                </div>

                                {connectedAccounts.length > 0 && (
                                  <div className="space-y-1">
                                    <p className="font-semibold text-xs">Connections:</p>
                                    {connectedAccounts.map((conn, idx) => (
                                      <div
                                        key={idx}
                                        className="text-xs p-2 bg-slate-100 dark:bg-slate-800 rounded flex items-start gap-2"
                                      >
                                        <Link2 className="w-3 h-3 mt-0.5 shrink-0" />
                                        <div className="min-w-0">
                                          <p className="font-mono text-xs">
                                            {conn.from === node.id ? "→" : "←"}{" "}
                                            {conn.from === node.id ? conn.to : conn.from}
                                          </p>
                                          <p className="text-muted-foreground">{conn.reason}</p>
                                          <Badge variant="outline" className="text-xs mt-1">
                                            {(conn.confidence * 100).toFixed(0)}% confidence
                                          </Badge>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <div className="flex gap-2 pt-2">
                                  <Button size="sm" variant="outline" className="text-xs">
                                    Investigate
                                  </Button>
                                  <Button size="sm" variant="destructive" className="text-xs">
                                    Blacklist
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : null
              )}

              {/* Statistics note */}
              <div className="text-xs text-muted-foreground italic p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-border/50">
                ℹ️ Network is analyzed in real-time using graph neural networks. Fraud rings are identified through
                pattern matching across NIDs, phone numbers, IP addresses, and transaction patterns.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default FraudDetectionNetwork
