"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  bangladeshDivisions,
  generateMockHeatmapData,
  type HeatmapData,
  type Division,
} from "../lib/bangladesh-divisions";
import { useEffect, useState } from "react";
import { AlertCircle, TrendingUp, Users } from "lucide-react";

export function BangladeshMap() {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>(
    generateMockHeatmapData()
  );
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);

  useEffect(() => {
    // Simulate real-time updates every 5 seconds
    const interval = setInterval(() => {
      setHeatmapData(generateMockHeatmapData());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const maxValue = Math.max(...heatmapData.map((d: HeatmapData) => d.value));
  const totalFundingGap = heatmapData.reduce(
    (sum: number, d: HeatmapData) => sum + d.value,
    0
  );
  const totalPopulation = heatmapData.reduce(
    (sum: number, d: HeatmapData) => sum + d.affectedPopulation,
    0
  );
  const totalCrises = heatmapData.reduce(
    (sum: number, d: HeatmapData) => sum + d.activeCrises,
    0
  );
  const highSeverityCrises = heatmapData.filter(
    (d: HeatmapData) => d.severity >= 70
  ).length;

  const selectedData = selectedDivision
    ? heatmapData.find((d: HeatmapData) => d.division === selectedDivision)
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Impact Map - Bangladesh</CardTitle>
        <CardDescription>
          Real-time geographic distribution of humanitarian needs across
          divisions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium">Population at Risk</span>
              </div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {(totalPopulation / 1000).toFixed(0)}K
              </div>
            </div>
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">Funding Gap</span>
              </div>
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                ৳{(totalFundingGap / 1000000).toFixed(1)}M
              </div>
            </div>
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-medium">Active Crises</span>
              </div>
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                {totalCrises}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-medium">High Severity</span>
              </div>
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {highSeverityCrises}
              </div>
            </div>
          </div>

          {/* Map visualization */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bangladeshDivisions.map((division) => {
              const data = heatmapData.find(
                (d) => d.division === division.name
              );
              const intensity = data ? data.value / maxValue : 0;
              const isSelected = selectedDivision === division.name;

              return (
                <div
                  key={division.id}
                  className={`p-4 rounded-lg border-2 transition-all hover:scale-105 cursor-pointer ${
                    isSelected ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}
                  style={{
                    backgroundColor: data?.color || "#f0f0f0",
                    borderColor: intensity > 0.5 ? "#dc2626" : "#10b981",
                  }}
                  onClick={() =>
                    setSelectedDivision(isSelected ? null : division.name)
                  }
                >
                  <div className="text-center">
                    <div className="font-bold text-white text-shadow-lg">
                      {division.name}
                    </div>
                    <div className="text-sm text-white/90 text-shadow mt-1">
                      {division.nameBn}
                    </div>
                    {data && (
                      <>
                        <div className="mt-2 text-xs font-semibold text-white text-shadow">
                          ৳{(data.value / 1000000).toFixed(1)}M needed
                        </div>
                        <div className="mt-1 text-xs text-white/90 text-shadow">
                          {data.activeCrises} crises
                        </div>
                        <div className="mt-1">
                          <span className="text-xs px-2 py-0.5 rounded bg-white/20 text-white font-medium">
                            {data.severity >= 80
                              ? "Critical"
                              : data.severity >= 60
                              ? "High"
                              : "Medium"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Division Details */}
          {selectedData && (
            <div className="p-4 rounded-lg bg-muted border border-border">
              <h3 className="font-semibold text-lg mb-3">
                {selectedData.division} - Detailed Breakdown
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <div className="text-sm text-muted-foreground">Food Aid</div>
                  <div className="text-lg font-semibold">
                    ৳{(selectedData.needsBreakdown.food / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Medical</div>
                  <div className="text-lg font-semibold">
                    ৳
                    {(selectedData.needsBreakdown.medical / 1000000).toFixed(1)}
                    M
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Shelter</div>
                  <div className="text-lg font-semibold">
                    ৳
                    {(selectedData.needsBreakdown.shelter / 1000000).toFixed(1)}
                    M
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Education</div>
                  <div className="text-lg font-semibold">
                    ৳
                    {(selectedData.needsBreakdown.education / 1000000).toFixed(
                      1
                    )}
                    M
                  </div>
                </div>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                <strong>
                  {selectedData.affectedPopulation.toLocaleString()}
                </strong>{" "}
                people affected across{" "}
                <strong>{selectedData.activeCrises}</strong> active crises
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t">
            <span className="text-sm font-medium">Severity Scale:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-emerald-500"></div>
              <span className="text-xs">Low (0-40)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-lime-500"></div>
              <span className="text-xs">Medium (40-60)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-500"></div>
              <span className="text-xs">High (60-80)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-600"></div>
              <span className="text-xs">Very High (80-90)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-600"></div>
              <span className="text-xs">Critical (90-100)</span>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                ৳
                {(
                  heatmapData.reduce((sum, d) => sum + d.value, 0) / 10000000
                ).toFixed(1)}
                Cr
              </div>
              <div className="text-sm text-muted-foreground">
                Total Funding Needed
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {bangladeshDivisions.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Divisions Monitored
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.floor(totalPopulation / 5)}
              </div>
              <div className="text-sm text-muted-foreground">
                Families Affected
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
