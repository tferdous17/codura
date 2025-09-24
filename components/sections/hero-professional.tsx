"use client";

import { useEffect, useState } from "react";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

const codeExamples = [
  { language: "Python", code: "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i" },
  { language: "JavaScript", code: "function binarySearch(arr, target) {\n    let left = 0, right = arr.length - 1;\n    while (left <= right) {\n        const mid = Math.floor((left + right) / 2);\n        if (arr[mid] === target) return mid;\n        arr[mid] < target ? left = mid + 1 : right = mid - 1;\n    }\n    return -1;\n}" },
  { language: "Java", code: "public ListNode reverseList(ListNode head) {\n    ListNode prev = null;\n    ListNode current = head;\n    while (current != null) {\n        ListNode next = current.next;\n        current.next = prev;\n        prev = current;\n        current = next;\n    }\n    return prev;\n}" }
];

export default function HeroProfessional() {
  const [currentExample, setCurrentExample] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % codeExamples.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Section className="pt-24 pb-20 bg-gradient-to-b from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/40 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Used by 15,000+ students across 89 universities
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Master technical interviews with{" "}
                <span className="bg-gradient-to-r from-foreground via-foreground to-brand bg-clip-text text-transparent">
                  confidence
                </span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Practice coding problems, conduct mock interviews, and compete with peers from your university.
                Build the skills that land you the job.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 bg-foreground text-background hover:bg-foreground/90 rounded-lg font-semibold transition-all duration-200 hover:scale-[1.02]">
                Start practicing
              </button>
              <button className="px-8 py-3 border border-border hover:bg-muted/50 rounded-lg font-semibold transition-all duration-200">
                Watch demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/40">
              <div>
                <div className="text-2xl font-bold">15K+</div>
                <div className="text-sm text-muted-foreground">Active students</div>
              </div>
              <div>
                <div className="text-2xl font-bold">89</div>
                <div className="text-sm text-muted-foreground">Universities</div>
              </div>
              <div>
                <div className="text-2xl font-bold">94%</div>
                <div className="text-sm text-muted-foreground">Success rate</div>
              </div>
            </div>
          </div>

          {/* Right Content - Code Example */}
          <div className="relative">
            <div className="relative p-6 bg-card border border-border/40 rounded-xl shadow-2xl">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 pb-4 border-b border-border/40">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="text-sm text-muted-foreground ml-auto">
                  {codeExamples[currentExample].language}
                </div>
              </div>

              {/* Code Content */}
              <div className="pt-4">
                <pre className="text-sm font-mono text-foreground/90 leading-relaxed overflow-hidden">
                  <code>{codeExamples[currentExample].code}</code>
                </pre>
              </div>

              {/* Language indicators */}
              <div className="flex gap-2 mt-6">
                {codeExamples.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      currentExample === index ? "bg-brand" : "bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-brand/20 to-transparent rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-xl" />
          </div>
        </div>
      </div>
    </Section>
  );
}