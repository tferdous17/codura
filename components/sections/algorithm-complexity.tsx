"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const complexities = [
  {
    id: "constant",
    name: "Constant",
    notation: "O(1)",
    description: "Best case - execution time stays constant",
    examples: ["Hash table lookup", "Array index access"],
    performance: "excellent",
    color: "emerald"
  },
  {
    id: "logarithmic",
    name: "Logarithmic",
    notation: "O(log n)",
    description: "Efficient - time grows slowly with input size",
    examples: ["Binary search", "Balanced tree operations"],
    performance: "excellent",
    color: "blue"
  },
  {
    id: "linear",
    name: "Linear",
    notation: "O(n)",
    description: "Good - time scales directly with input size",
    examples: ["Array traversal", "Linear search"],
    performance: "good",
    color: "violet"
  },
  {
    id: "linearithmic",
    name: "Linearithmic",
    notation: "O(n log n)",
    description: "Acceptable - optimal for comparison sorts",
    examples: ["Merge sort", "Heap sort"],
    performance: "good",
    color: "amber"
  },
  {
    id: "quadratic",
    name: "Quadratic",
    notation: "O(n²)",
    description: "Poor - avoid for large datasets",
    examples: ["Bubble sort", "Nested loops"],
    performance: "poor",
    color: "orange"
  },
  {
    id: "exponential",
    name: "Exponential",
    notation: "O(2ⁿ)",
    description: "Terrible - only for small inputs",
    examples: ["Recursive Fibonacci", "Brute force"],
    performance: "terrible",
    color: "red"
  }
];

const getPerformanceColor = (performance: string) => {
  switch (performance) {
    case "excellent": return "text-emerald-600 bg-emerald-50 border-emerald-200";
    case "good": return "text-blue-600 bg-blue-50 border-blue-200";
    case "poor": return "text-orange-600 bg-orange-50 border-orange-200";
    case "terrible": return "text-red-600 bg-red-50 border-red-200";
    default: return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

export default function AlgorithmComplexity({ className }: { className?: string }) {
  const [selectedComplexity, setSelectedComplexity] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.2 }
    );

    const element = document.getElementById('complexity-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="complexity-section"
      className={cn("py-24 bg-gradient-to-b from-background via-muted/20 to-background", className)}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="outline" className="mb-6 border-foreground/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-foreground rounded-full animate-pulse" />
              Algorithm Analysis
            </div>
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
            Master Time Complexity
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Learn to analyze and optimize your algorithms with interactive complexity insights
            that prepare you for technical interviews.
          </p>
        </div>

        {/* Modern Grid Layout */}
        <div className="grid gap-6 lg:gap-8">
          {/* Complexity Cards - Responsive Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {complexities.map((complexity, index) => (
              <Card
                key={complexity.id}
                className={cn(
                  "group cursor-pointer transition-all duration-300 hover:shadow-lg border-border/50",
                  selectedComplexity === complexity.id
                    ? "ring-2 ring-foreground/20 shadow-lg"
                    : "hover:border-border",
                  isVisible && `animate-in slide-in-from-bottom-4 duration-500`,
                  isVisible && `delay-${index * 100}`
                )}
                onClick={() => setSelectedComplexity(
                  selectedComplexity === complexity.id ? null : complexity.id
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <div className="font-mono text-lg font-semibold">
                        {complexity.notation}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {complexity.name}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-medium",
                        getPerformanceColor(complexity.performance)
                      )}
                    >
                      {complexity.performance}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {complexity.description}
                  </p>

                  {selectedComplexity === complexity.id && (
                    <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                      <div className="h-px bg-border" />
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground mb-2 tracking-wide">
                          COMMON EXAMPLES
                        </h4>
                        <div className="space-y-1">
                          {complexity.examples.map((example, idx) => (
                            <div key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                              <div className="w-1 h-1 bg-muted-foreground/60 rounded-full" />
                              {example}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Side-by-side Feature Cards */}
          <div className="grid lg:grid-cols-2 gap-8 mt-12">
            {/* Interactive Learning */}
            <Card className="group border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-muted transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Interactive Analysis</h3>
                    <p className="text-sm text-muted-foreground">Real-time complexity insights</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Get instant feedback on your algorithm performance with detailed complexity breakdowns,
                  optimization suggestions, and best practice recommendations.
                </p>
              </CardContent>
            </Card>

            {/* Interview Preparation */}
            <Card className="group border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-muted transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Interview Ready</h3>
                    <p className="text-sm text-muted-foreground">Master technical discussions</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Build confidence explaining time and space complexity in technical interviews
                  with practical examples and clear mental models.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}