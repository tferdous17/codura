"use client";

import { useState, useEffect } from "react";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

const universities = [
  {
    id: 1,
    name: "Massachusetts Institute of Technology",
    code: "MIT",
    students: 2847,
    problems: 18394,
    avgScore: 94.2,
    growth: "+12%",
    featured: true
  },
  {
    id: 2,
    name: "Stanford University",
    code: "STAN",
    students: 2341,
    problems: 15678,
    avgScore: 92.8,
    growth: "+8%",
    featured: false
  },
  {
    id: 3,
    name: "Farmingdale State College",
    code: "FSC",
    students: 1892,
    problems: 12456,
    avgScore: 88.9,
    growth: "+15%",
    featured: false
  },
  {
    id: 4,
    name: "University of California Berkeley",
    code: "UCB",
    students: 1743,
    problems: 11234,
    avgScore: 91.5,
    growth: "+6%",
    featured: false
  },
  {
    id: 5,
    name: "Carnegie Mellon University",
    code: "CMU",
    students: 1654,
    problems: 10987,
    avgScore: 93.1,
    growth: "+9%",
    featured: false
  }
];

const metrics = [
  { label: "Total Students", value: "15,847", change: "+23%" },
  { label: "Problems Solved", value: "1.2M", change: "+45%" },
  { label: "Universities", value: "89", change: "+12%" },
  { label: "Success Rate", value: "94%", change: "+3%" }
];

export default function UniversityLeaderboardProfessional() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("month");

  return (
    <Section className="py-20 bg-gradient-to-b from-background/50 to-background" id="universities">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            University Performance Dashboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-time analytics showing how universities perform in technical interview preparation.
            Foster healthy competition and collaborative learning.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className="p-6 bg-card border border-border/40 rounded-lg hover:shadow-sm transition-all duration-200"
            >
              <div className="text-2xl font-bold mb-1">{metric.value}</div>
              <div className="text-sm text-muted-foreground mb-2">{metric.label}</div>
              <div className="text-sm text-green-600 font-medium">{metric.change}</div>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="bg-card border border-border/40 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border/40 bg-muted/20">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">University Rankings</h3>
              <div className="flex gap-2">
                {["week", "month", "quarter"].map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={cn(
                      "px-3 py-1 text-sm font-medium rounded-md transition-all duration-200",
                      selectedTimeframe === timeframe
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/10">
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="px-6 py-4 font-medium">Rank</th>
                  <th className="px-6 py-4 font-medium">University</th>
                  <th className="px-6 py-4 font-medium">Students</th>
                  <th className="px-6 py-4 font-medium">Problems Solved</th>
                  <th className="px-6 py-4 font-medium">Avg Score</th>
                  <th className="px-6 py-4 font-medium">Growth</th>
                </tr>
              </thead>
              <tbody>
                {universities.map((university, index) => (
                  <tr
                    key={university.id}
                    className={cn(
                      "border-b border-border/20 hover:bg-muted/20 transition-colors duration-150",
                      university.featured && "bg-brand/5 hover:bg-brand/10"
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm",
                        index === 0 && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                        index === 1 && "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
                        index === 2 && "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
                        index > 2 && "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold">{university.code}</div>
                        <div className="text-sm text-muted-foreground">{university.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{university.students.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{university.problems.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{university.avgScore}%</div>
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                            style={{ width: `${university.avgScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-green-600 font-medium">{university.growth}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="inline-flex flex-col sm:flex-row gap-4 p-6 bg-card border border-border/40 rounded-lg">
            <div className="text-left sm:text-center">
              <h3 className="font-semibold mb-1">Join your university channel</h3>
              <p className="text-sm text-muted-foreground">Connect with peers and climb the leaderboard</p>
            </div>
            <button className="px-6 py-2 bg-foreground text-background hover:bg-foreground/90 rounded-md font-medium transition-colors duration-200 whitespace-nowrap">
              Find my university
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}