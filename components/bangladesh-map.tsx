"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { bangladeshDivisions, generateMockHeatmapData } from "@/lib/bangladesh-divisions"
import { useEffect, useState } from "react"

export function BangladeshMap() {
  const [heatmapData, setHeatmapData] = useState(generateMockHeatmapData())

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setHeatmapData(generateMockHeatmapData())
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const maxValue = Math.max(...heatmapData.map((d) => d.value))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Impact Map - Bangladesh</CardTitle>
        <CardDescription>Geographic distribution of donations and crisis impact across divisions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Simplified map visualization */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bangladeshDivisions.map((division) => {
              const data = heatmapData.find((d) => d.division === division.name)
              const intensity = data ? data.value / maxValue : 0

              return (
                <div
                  key={division.id}
                  className="p-4 rounded-lg border-2 transition-all hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor: data?.color || "#f0f0f0",
                    borderColor: intensity > 0.5 ? "#dc2626" : "#10b981",
                  }}
                >
                  <div className="text-center">
                    <div className="font-bold text-white text-shadow">{division.name}</div>
                    <div className="text-sm text-white text-shadow mt-1">{division.nameBn}</div>
                    {data && (
                      <div className="mt-2 text-xs font-semibold text-white">৳{(data.value / 1000000).toFixed(1)}M</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t">
            <span className="text-sm font-medium">Impact Level:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-emerald-500"></div>
              <span className="text-xs">Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-lime-500"></div>
              <span className="text-xs">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-500"></div>
              <span className="text-xs">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-600"></div>
              <span className="text-xs">Very High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-600"></div>
              <span className="text-xs">Critical</span>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                ৳{(heatmapData.reduce((sum, d) => sum + d.value, 0) / 10000000).toFixed(1)}Cr
              </div>
              <div className="text-sm text-muted-foreground">Total Distributed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{bangladeshDivisions.length}</div>
              <div className="text-sm text-muted-foreground">Divisions Covered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.floor(heatmapData.reduce((sum, d) => sum + d.value, 0) / 8000)}
              </div>
              <div className="text-sm text-muted-foreground">Families Helped</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
