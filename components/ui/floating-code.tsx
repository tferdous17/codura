"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const codeSnippets = [
  { code: "def binary_search(arr, target):", language: "python", size: "lg" },
  { code: "class TreeNode:", language: "python", size: "md" },
  { code: "function quickSort(arr) {", language: "javascript", size: "lg" },
  { code: "public int maxProfit()", language: "java", size: "md" },
  { code: "vector<int> twoSum(", language: "cpp", size: "sm" },
  { code: "while left < right:", language: "python", size: "sm" },
  { code: "return nums[left] + nums[right]", language: "python", size: "md" },
  { code: "if (root == null) return;", language: "java", size: "md" },
  { code: "const result = []", language: "javascript", size: "sm" },
  { code: "dp[i] = Math.max(", language: "javascript", size: "lg" }
];

interface FloatingCodeProps {
  className?: string;
}

export default function FloatingCode({ className }: FloatingCodeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {codeSnippets.map((snippet, index) => (
        <div
          key={index}
          className={cn(
            "absolute animate-float opacity-20 hover:opacity-30 transition-opacity duration-500",
            snippet.size === "sm" && "text-sm px-3 py-1",
            snippet.size === "md" && "text-base px-4 py-2",
            snippet.size === "lg" && "text-lg px-5 py-2"
          )}
          style={{
            left: `${Math.random() * 85}%`,
            top: `${Math.random() * 85}%`,
            animationDelay: `${index * 0.8}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }}
        >
          <div className="font-mono bg-background/80 backdrop-blur-sm border border-border/30 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 px-3 py-1 border-b border-border/20 bg-muted/20">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-muted-foreground ml-auto">
                {snippet.language}
              </span>
            </div>
            <div className="p-2 text-foreground/70">
              {snippet.code}
            </div>
          </div>
        </div>
      ))}

      {/* Add some mathematical symbols and algorithm names */}
      {[
        { symbol: "O(n log n)", position: { left: "10%", top: "20%" } },
        { symbol: "BFS", position: { left: "80%", top: "15%" } },
        { symbol: "Dynamic Programming", position: { left: "15%", top: "75%" } },
        { symbol: "O(1)", position: { left: "85%", top: "60%" } },
        { symbol: "DFS", position: { left: "25%", top: "40%" } },
        { symbol: "Two Pointers", position: { left: "70%", top: "80%" } }
      ].map((item, index) => (
        <div
          key={`math-${index}`}
          className="absolute animate-bounce opacity-10 text-brand font-semibold"
          style={{
            ...item.position,
            animationDelay: `${index * 1.2 + 5}s`,
            animationDuration: "4s"
          }}
        >
          {item.symbol}
        </div>
      ))}
    </div>
  );
}