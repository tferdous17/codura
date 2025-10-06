"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ComplexityData {
  name: string;
  notation: string;
  color: string;
  description: string;
  examples: string[];
  values: number[];
}

const complexities: ComplexityData[] = [
  {
    name: "Constant",
    notation: "O(1)",
    color: "#10b981", // green
    description: "Best possible time complexity - always takes the same time",
    examples: ["Array access", "Hash map lookup", "Stack push/pop"],
    values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    name: "Logarithmic",
    notation: "O(log n)",
    color: "#3b82f6", // blue
    description: "Very efficient - time grows slowly as input increases",
    examples: ["Binary search", "Balanced tree operations", "Heap operations"],
    values: [1, 2, 2.5, 3, 3.3, 3.6, 3.8, 4, 4.2, 4.3]
  },
  {
    name: "Linear",
    notation: "O(n)",
    color: "#f59e0b", // yellow
    description: "Good performance - time grows proportionally with input",
    examples: ["Array traversal", "Linear search", "Simple loops"],
    values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  {
    name: "Linearithmic",
    notation: "O(n log n)",
    color: "#f97316", // orange
    description: "Efficient for complex operations - common in good sorting algorithms",
    examples: ["Merge sort", "Quick sort (avg)", "Heap sort"],
    values: [1, 4, 7.5, 12, 16.6, 21.6, 26.6, 32, 37.8, 43.4]
  },
  {
    name: "Quadratic",
    notation: "O(n²)",
    color: "#ef4444", // red
    description: "Slower for large inputs - avoid when possible",
    examples: ["Bubble sort", "Nested loops", "Brute force algorithms"],
    values: [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
  },
  {
    name: "Exponential",
    notation: "O(2ⁿ)",
    color: "#dc2626", // darker red
    description: "Very slow - only usable for small inputs",
    examples: ["Recursive fibonacci", "Tower of Hanoi", "Brute force TSP"],
    values: [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]
  }
];

export default function AlgorithmComplexityChart() {
  const [selectedComplexity, setSelectedComplexity] = useState<ComplexityData | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationProgress((prev) => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const maxValue = Math.max(...complexities.flatMap(c => c.values));
  const chartHeight = 300;
  const chartWidth = 400;

  return (
    <div className="bg-card/50 border border-border/40 rounded-lg p-6 hover:bg-card/70 transition-colors">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-foreground mb-2">
          Algorithm Time Complexity
        </h3>
        <p className="text-sm text-muted-foreground">
          Interactive visualization of common time complexities
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Chart */}
        <div className="flex-1">
          <div className="relative bg-background/50 rounded-lg p-4 border border-border/20">
            <svg
              width={chartWidth}
              height={chartHeight}
              className="overflow-visible"
            >
              {/* Grid lines */}
              {[...Array(5)].map((_, i) => {
                const y = (chartHeight / 4) * i;
                return (
                  <line
                    key={i}
                    x1={0}
                    y1={y}
                    x2={chartWidth}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth={0.5}
                    className="text-border/30"
                  />
                );
              })}

              {/* Complexity curves */}
              {complexities.map((complexity, complexityIndex) => {
                const points = complexity.values
                  .slice(0, 10)
                  .map((value, i) => {
                    const x = (chartWidth / 9) * i;
                    const y = chartHeight - (value / maxValue) * chartHeight * 0.8;
                    return `${x},${y}`;
                  })
                  .join(' ');

                const isSelected = selectedComplexity?.name === complexity.name;
                const opacity = selectedComplexity ? (isSelected ? 1 : 0.3) : 0.8;

                return (
                  <g key={complexity.name}>
                    {/* Line */}
                    <polyline
                      points={points}
                      fill="none"
                      stroke={complexity.color}
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-all duration-300"
                      style={{ opacity }}
                    />

                    {/* Data points */}
                    {complexity.values.slice(0, 10).map((value, i) => {
                      const x = (chartWidth / 9) * i;
                      const y = chartHeight - (value / maxValue) * chartHeight * 0.8;

                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r={isSelected ? 4 : 3}
                          fill={complexity.color}
                          className="transition-all duration-300"
                          style={{ opacity }}
                        />
                      );
                    })}
                  </g>
                );
              })}

              {/* Axes labels */}
              <text
                x={chartWidth / 2}
                y={chartHeight + 25}
                textAnchor="middle"
                className="text-xs text-muted-foreground"
              >
                Input Size (n)
              </text>
              <text
                x={-chartHeight / 2}
                y={-10}
                textAnchor="middle"
                transform="rotate(-90)"
                className="text-xs text-muted-foreground"
              >
                Time
              </text>
            </svg>
          </div>
        </div>

        {/* Legend and details */}
        <div className="lg:w-80">
          <div className="space-y-2 mb-6">
            {complexities.map((complexity) => (
              <button
                key={complexity.name}
                onClick={() => setSelectedComplexity(
                  selectedComplexity?.name === complexity.name ? null : complexity
                )}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200",
                  selectedComplexity?.name === complexity.name
                    ? "bg-muted/50 border border-border/40"
                    : "hover:bg-muted/20"
                )}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: complexity.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {complexity.notation}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {complexity.name}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Selected complexity details */}
          {selectedComplexity && (
            <div className="bg-muted/10 border border-border/30 rounded-lg p-4 animate-in slide-in-from-bottom-2">
              <h4 className="font-medium text-foreground mb-2">
                {selectedComplexity.notation} - {selectedComplexity.name}
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                {selectedComplexity.description}
              </p>
              <div>
                <h5 className="text-sm font-medium text-foreground mb-2">Examples:</h5>
                <ul className="space-y-1">
                  {selectedComplexity.examples.map((example, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-current opacity-50" />
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {!selectedComplexity && (
            <div className="text-center p-8 text-muted-foreground">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-sm">
                Click on any complexity above to explore examples and learn more
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}