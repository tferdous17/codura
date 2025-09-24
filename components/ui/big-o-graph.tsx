"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BigOComplexity {
  id: string;
  name: string;
  notation: string;
  color: string;
  description: string;
  examples: string[];
  func: (n: number) => number;
  severity: "excellent" | "good" | "fair" | "poor" | "terrible";
}

const complexities: BigOComplexity[] = [
  {
    id: "constant",
    name: "Constant",
    notation: "O(1)",
    color: "hsl(var(--chart-2))",
    description: "Execution time remains constant regardless of input size",
    examples: ["Array index access", "Hash table lookup", "Stack push/pop"],
    func: (n: number) => 1,
    severity: "excellent",
  },
  {
    id: "logarithmic",
    name: "Logarithmic",
    notation: "O(log n)",
    color: "hsl(var(--chart-1))",
    description: "Execution time grows logarithmically with input size",
    examples: ["Binary search", "Balanced BST operations", "Binary heap operations"],
    func: (n: number) => Math.log2(Math.max(1, n)),
    severity: "excellent",
  },
  {
    id: "linear",
    name: "Linear",
    notation: "O(n)",
    color: "hsl(var(--chart-3))",
    description: "Execution time scales linearly with input size",
    examples: ["Array traversal", "Linear search", "Finding min/max"],
    func: (n: number) => n,
    severity: "good",
  },
  {
    id: "linearithmic",
    name: "Linearithmic",
    notation: "O(n log n)",
    color: "hsl(var(--chart-4))",
    description: "Optimal for comparison-based sorting algorithms",
    examples: ["Merge sort", "Quick sort (average)", "Heap sort"],
    func: (n: number) => n * Math.log2(Math.max(1, n)),
    severity: "good",
  },
  {
    id: "quadratic",
    name: "Quadratic",
    notation: "O(n²)",
    color: "hsl(var(--chart-5))",
    description: "Execution time grows quadratically - avoid for large inputs",
    examples: ["Bubble sort", "Insertion sort", "Nested loops"],
    func: (n: number) => n * n,
    severity: "fair",
  },
  {
    id: "cubic",
    name: "Cubic",
    notation: "O(n³)",
    color: "hsl(0 84.2% 60.2%)",
    description: "Execution time grows cubically - very inefficient",
    examples: ["Triple nested loops", "Floyd-Warshall", "Matrix multiplication"],
    func: (n: number) => Math.pow(n, 3),
    severity: "poor",
  },
  {
    id: "exponential",
    name: "Exponential",
    notation: "O(2ⁿ)",
    color: "hsl(0 90% 50%)",
    description: "Execution time doubles with each input - extremely inefficient",
    examples: ["Fibonacci (naive)", "Power set generation", "Brute force solutions"],
    func: (n: number) => Math.pow(2, Math.min(n, 20)),
    severity: "terrible",
  },
  {
    id: "factorial",
    name: "Factorial",
    notation: "O(n!)",
    color: "hsl(0 100% 30%)",
    description: "Factorial growth - avoid at all costs",
    examples: ["Permutation generation", "Traveling salesman (brute force)"],
    func: (n: number) => {
      if (n <= 1) return 1;
      if (n > 10) return Math.pow(10, n * 0.4);
      let result = 1;
      for (let i = 2; i <= n; i++) result *= i;
      return result;
    },
    severity: "terrible",
  },
];

const getSeverityBadgeVariant = (severity: string) => {
  switch (severity) {
    case "excellent": return "default";
    case "good": return "secondary";
    case "fair": return "outline";
    case "poor": return "destructive";
    case "terrible": return "destructive";
    default: return "default";
  }
};

interface BigOGraphProps {
  className?: string;
  interactive?: boolean;
  showLegend?: boolean;
}

export default function BigOGraph({ className, interactive = true, showLegend = true }: BigOGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedComplexity, setSelectedComplexity] = useState<string | null>(null);
  const [hoveredComplexity, setHoveredComplexity] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (svgRef.current) {
      observer.observe(svgRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const animate = () => {
      setAnimationProgress(prev => {
        if (prev < 1) {
          requestAnimationFrame(animate);
          return Math.min(prev + 0.015, 1);
        }
        return 1;
      });
    };

    animate();
  }, [isVisible]);

  const generatePath = (complexity: BigOComplexity, width: number, height: number, padding: number) => {
    const maxN = 30;
    const steps = complexity.id === 'exponential' || complexity.id === 'factorial' ? 25 : 50;
    const stepSize = maxN / steps;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    // Calculate max value for normalization
    const maxValue = complexity.id === 'exponential' || complexity.id === 'factorial'
      ? complexity.func(12)
      : complexity.func(maxN);

    let path = '';

    for (let i = 0; i <= steps; i++) {
      const n = Math.max(1, i * stepSize);
      const x = padding + (n / maxN) * graphWidth;
      const value = complexity.func(n);
      const normalizedValue = Math.min(value / maxValue, 1);
      const y = height - padding - normalizedValue * graphHeight * animationProgress;

      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }

    return path;
  };

  const getActiveComplexity = () => {
    if (selectedComplexity) {
      return complexities.find(c => c.id === selectedComplexity);
    }
    if (hoveredComplexity) {
      return complexities.find(c => c.id === hoveredComplexity);
    }
    return null;
  };

  const activeComplexity = getActiveComplexity();
  const width = 600;
  const height = 400;
  const padding = 60;

  const visibleComplexities = complexities.filter(complexity => {
    const isSelected = selectedComplexity === complexity.id;
    const isHovered = hoveredComplexity === complexity.id;
    return !selectedComplexity || isSelected || isHovered;
  });

  return (
    <Card className={cn("border-border/40 bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Algorithm Complexity Analysis</CardTitle>
            <CardDescription className="mt-1">
              Interactive visualization of time complexities
            </CardDescription>
          </div>
          {interactive && (
            <button
              onClick={() => setSelectedComplexity(null)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1 rounded-md border border-border/40 hover:border-border/60"
            >
              Show All
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Modern SVG Graph */}
          <div className="lg:col-span-2">
            <div className="relative">
              <svg
                ref={svgRef}
                width="100%"
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                className="rounded-lg border border-border/20 bg-muted/10"
              >
                {/* Grid */}
                <defs>
                  <pattern id="grid" width="40" height="35" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 35" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" opacity="0.2"/>
                  </pattern>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--background))" stopOpacity="0" />
                    <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                <rect width="100%" height="100%" fill="url(#grid)" />
                <rect width="100%" height="100%" fill="url(#chartGradient)" />

                {/* Axes */}
                <g stroke="hsl(var(--muted-foreground))" strokeWidth="2" opacity="0.6">
                  <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} />
                  <line x1={padding} y1={height - padding} x2={padding} y2={padding} />
                </g>

                {/* Axis labels */}
                <text
                  x={width / 2}
                  y={height - 15}
                  textAnchor="middle"
                  className="text-xs fill-muted-foreground font-mono"
                >
                  Input Size (n)
                </text>
                <text
                  x={20}
                  y={height / 2}
                  textAnchor="middle"
                  className="text-xs fill-muted-foreground font-mono"
                  transform={`rotate(-90, 20, ${height / 2})`}
                >
                  Time
                </text>

                {/* Complexity curves */}
                {visibleComplexities.map(complexity => {
                  const isSelected = selectedComplexity === complexity.id;
                  const isHovered = hoveredComplexity === complexity.id;
                  const path = generatePath(complexity, width, height, padding);

                  return (
                    <g key={complexity.id}>
                      <path
                        d={path}
                        fill="none"
                        stroke={complexity.color}
                        strokeWidth={isSelected || isHovered ? "3" : "2"}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={isSelected || isHovered ? "1" : "0.8"}
                        className="transition-all duration-300"
                        style={{
                          filter: isSelected || isHovered ? `drop-shadow(0 0 8px ${complexity.color})` : 'none',
                        }}
                      />
                    </g>
                  );
                })}

                {/* Curve labels */}
                {animationProgress > 0.7 && visibleComplexities.map(complexity => {
                  const isSelected = selectedComplexity === complexity.id;
                  const isHovered = hoveredComplexity === complexity.id;

                  return (
                    <text
                      key={`label-${complexity.id}`}
                      x={width - 80}
                      y={50 + visibleComplexities.indexOf(complexity) * 25}
                      className="text-xs font-mono font-semibold"
                      fill={complexity.color}
                      opacity={isSelected || isHovered ? "1" : "0.8"}
                    >
                      {complexity.notation}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Enhanced Legend */}
          <div className="space-y-4">
            {showLegend && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground tracking-wide">
                  COMPLEXITIES
                </h4>
                <div className="space-y-2">
                  {complexities.map(complexity => (
                    <button
                      key={complexity.id}
                      onClick={() => interactive ? setSelectedComplexity(
                        selectedComplexity === complexity.id ? null : complexity.id
                      ) : undefined}
                      onMouseEnter={() => interactive ? setHoveredComplexity(complexity.id) : undefined}
                      onMouseLeave={() => interactive ? setHoveredComplexity(null) : undefined}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg w-full text-left transition-all duration-200 border border-transparent",
                        interactive && "hover:bg-muted/30 hover:border-border/40",
                        selectedComplexity === complexity.id && "bg-muted/40 border-border/60 shadow-sm"
                      )}
                    >
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0 border border-white/20"
                        style={{ backgroundColor: complexity.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm font-semibold">
                          {complexity.notation}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {complexity.name}
                        </div>
                      </div>
                      <Badge
                        variant={getSeverityBadgeVariant(complexity.severity)}
                        className="text-xs"
                      >
                        {complexity.severity}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Active Complexity Info */}
            {activeComplexity && (
              <Card className="border-border/40 bg-muted/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: activeComplexity.color }}
                    />
                    <h4 className="font-mono font-semibold text-lg">
                      {activeComplexity.notation}
                    </h4>
                    <Badge variant={getSeverityBadgeVariant(activeComplexity.severity)}>
                      {activeComplexity.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {activeComplexity.description}
                  </p>
                  <div>
                    <h5 className="text-xs font-semibold text-muted-foreground mb-2 tracking-wide">
                      COMMON EXAMPLES
                    </h5>
                    <ul className="space-y-1">
                      {activeComplexity.examples.map((example, index) => (
                        <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-muted-foreground/60" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}