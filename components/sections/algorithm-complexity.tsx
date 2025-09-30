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
    case "excellent": 
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-emerald-500/20 backdrop-blur-sm hover:bg-emerald-500/20 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/30";
    case "good": 
      return "text-blue-400 bg-blue-500/10 border-blue-500/30 shadow-blue-500/20 backdrop-blur-sm hover:bg-blue-500/20 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/30";
    case "poor": 
      return "text-orange-400 bg-orange-500/10 border-orange-500/30 shadow-orange-500/20 backdrop-blur-sm hover:bg-orange-500/20 hover:border-orange-400/50 hover:shadow-lg hover:shadow-orange-500/30";
    case "terrible": 
      return "text-red-400 bg-red-500/10 border-red-500/30 shadow-red-500/20 backdrop-blur-sm hover:bg-red-500/20 hover:border-red-400/50 hover:shadow-lg hover:shadow-red-500/30";
    default: 
      return "text-slate-400 bg-slate-500/10 border-slate-500/30 shadow-slate-500/20 backdrop-blur-sm hover:bg-slate-500/20 hover:border-slate-400/50 hover:shadow-lg hover:shadow-slate-500/30";
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
      // REMOVED background gradient to let the page.tsx fixed background show through
      // Standardized padding to align with other sections
      className={cn("py-20 relative overflow-hidden", className)}
    >
      {/* Background Effect: Subtle, floating blur orb */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob-reverse" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge className="mb-6 bg-brand/10 border-brand/20 text-brand hover:bg-brand/20 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
              Algorithm Analysis
            </div>
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-brand bg-clip-text text-transparent leading-tight">
            Master Time Complexity
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Learn to analyze and optimize your algorithms with interactive
            complexity insights that prepare you for technical interviews.
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
                // Enhanced base styling with gradient borders and better depth
                "group relative cursor-pointer transition-all duration-500 border-white/20 overflow-hidden rounded-3xl",
                "bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md",
                // Animated gradient border effect
                "before:absolute before:inset-0 before:-z-10 before:rounded-lg before:p-[2px]",
                "before:bg-gradient-to-br before:from-primary/20 before:via-primary/5 before:to-transparent",
                "before:transition-opacity before:duration-500",
                // Hover effects - lift and glow
                "hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30",
                "hover:before:opacity-100",
                // Selected state - bold ring and enhanced glow
                selectedComplexity === complexity.id
                  ? "ring-4 ring-primary/30 shadow-2xl shadow-primary/20 border-primary/50 scale-[1.02] before:opacity-100"
                  : "before:opacity-0",
                // Staggered entrance animations
                isVisible && `animate-in slide-in-from-bottom-4 fade-in duration-700`,
                isVisible && `delay-${index * 100}`
              )}
              onClick={() =>
                setSelectedComplexity(
                  selectedComplexity === complexity.id ? null : complexity.id
                )
              }
            >
              <CardContent className="p-6 relative">
                {/* Subtle corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
                
                <div className="flex items-start justify-between mb-4 relative">
                  <div className="space-y-1">
                    <div className="font-mono text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/70 transition-all duration-500">
                      {complexity.notation}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground/80 group-hover:text-muted-foreground transition-colors">
                      {complexity.name}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-semibold px-3 py-1 shadow-sm border-2 transition-all duration-300",
                      "group-hover:scale-110 group-hover:shadow-md",
                      getPerformanceColor(complexity.performance)
                    )}
                  >
                    {complexity.performance}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground/90 mb-4 leading-relaxed group-hover:text-muted-foreground transition-colors">
                  {complexity.description}
                </p>

                {selectedComplexity === complexity.id && (
                  <div className="space-y-3 animate-in slide-in-from-top-4 fade-in duration-300">
                    {/* Gradient divider instead of plain line */}
                    <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    <div className="bg-muted/20 rounded-lg p-4 border border-border/50">
                      <h4 className="text-xs font-bold text-foreground/70 mb-3 tracking-wider uppercase flex items-center gap-2">
                        <div className="w-1 h-4 bg-primary/60 rounded-full" />
                        Common Examples
                      </h4>
                      <div className="space-y-2">
                        {complexity.examples.map((example, idx) => (
                          <div
                            key={idx}
                            className="text-xs text-muted-foreground flex items-start gap-3 animate-in slide-in-from-left-2 fade-in"
                            style={{ animationDelay: `${idx * 50}ms` }}
                          >
                            <div className="w-1.5 h-1.5 bg-primary/60 rounded-full mt-1.5 flex-shrink-0" />
                            <span className="leading-relaxed">{example}</span>
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
            <Card className="group border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-muted transition-colors">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Interactive Analysis
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Real-time complexity insights
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Get instant feedback on your algorithm performance with
                  detailed complexity breakdowns, optimization suggestions, and
                  best practice recommendations.
                </p>
              </CardContent>
            </Card>

            {/* Interview Preparation */}
            <Card className="group border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-muted transition-colors">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Interview Ready</h3>
                    <p className="text-sm text-muted-foreground">
                      Master technical discussions
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Build confidence explaining time and space complexity in
                  technical interviews with practical examples and clear mental
                  models.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}