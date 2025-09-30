"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Combined and reorganized snippets with guaranteed non-overlapping positions (4 rows x 5 columns)
const codeSnippets = [
  // Row 1 (Top)
  { code: "def binary_search(arr, target):", language: "python", size: "lg", left: "5%", top: "10%" },
  { code: "function quickSort(arr) {", language: "javascript", size: "lg", left: "25%", top: "10%" },
  { code: "int max_flow = 0;", language: "cpp", size: "md", left: "45%", top: "10%" },
  { code: "graph.add_node('S')", language: "python", size: "lg", left: "65%", top: "10%" },
  { code: "const seen = new Set()", language: "javascript", size: "lg", left: "85%", top: "10%" },

  // Row 2
  { code: "class TreeNode:", language: "python", size: "md", left: "5%", top: "30%" },
  { code: "public int maxProfit()", language: "java", size: "md", left: "25%", top: "30%" },
  { code: "for i in range(n):", language: "python", size: "sm", left: "45%", top: "30%" },
  { code: "new HashMap()", language: "java", size: "md", left: "65%", top: "30%" },
  { code: "Two Pointers Method:", language: "python", size: "lg", left: "85%", top: "30%" },

  // Row 3
  { code: "vector<int> twoSum(", language: "cpp", size: "sm", left: "5%", top: "50%" },
  { code: "while left < right:", language: "python", size: "sm", left: "25%", top: "50%" },
  { code: "let j = n - 1;", language: "javascript", size: "md", left: "45%", top: "50%" },
  { code: "return max_val", language: "python", size: "sm", left: "65%", top: "50%" },
  { code: "def dfs(node):", language: "python", size: "md", left: "85%", top: "50%" },

  // Row 4
  { code: "return nums[left] + nums[right]", language: "python", size: "md", left: "5%", top: "70%" },
  { code: "if (root == null) return;", language: "java", size: "md", left: "25%", top: "70%" },
  { code: "const result = []", language: "javascript", size: "sm", left: "45%", top: "70%" },
  { code: "dp[i] = Math.max(", language: "javascript", size: "lg", left: "65%", top: "70%" },
  { code: "long long count = 0;", language: "cpp", size: "sm", left: "85%", top: "70%" }
];

// Symbols are intentionally sparse and large to cover open areas without cluttering
const abstractSymbols = [
    { symbol: "O(n log n)", left: "15%", top: "5%", animation: 'animate-blob', size: 'text-3xl' },
    { symbol: "Dynamic Programming", left: "70%", top: "5%", animation: 'animate-blob-reverse', size: 'text-4xl' },
    { symbol: "BFS", left: "5%", top: "85%", animation: 'animate-float-slow', size: 'text-2xl' },
    { symbol: "O(1)", left: "85%", top: "90%", animation: 'animate-float', size: 'text-3xl' },
    { symbol: "DFS", left: "45%", top: "95%", animation: 'animate-blob', size: 'text-xl' },
    { symbol: "Two Pointers", left: "80%", top: "35%", animation: 'animate-float', size: 'text-3xl' },
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
            "absolute text-sm font-mono opacity-50 hover:opacity-60 transition-opacity duration-1000", 
            "select-none animate-float-slow",
            snippet.size === "sm" && "text-xs",
            snippet.size === "md" && "text-sm",
            snippet.size === "lg" && "text-base"
          )}
          style={{
            // FIX: Removed randomized duration and delay for synchronous motion
            left: snippet.left, 
            top: snippet.top,
            animationDuration: '30s', // Fixed duration for synchronized loop
            animationDelay: '0s',    // Start immediately
          }}
        >
          {/* Box background and border restored */}
          <div className="bg-background/10 backdrop-blur-sm border border-border/20 rounded-lg shadow-xl">
            <div className="flex items-center gap-2 px-3 py-1 border-b border-border/10 bg-muted/10">
              {/* Subtle traffic lights */}
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
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

      {/* Mathematical Symbols and Algorithm Names (The dynamic 'spazzaz' elements) */}
      {abstractSymbols.map((item, index) => (
        <div
          key={`math-${index}`}
          className={cn(
            "absolute opacity-20 text-brand font-semibold",
            item.animation, 
            item.size,
            "select-none"
          )}
          style={{
            // FIX: Removed randomized duration and delay for more synchronous blob motion
            left: item.left,
            top: item.top,
            animationDelay: '0s',
            animationDuration: '10s',
          }}
        >
          {item.symbol}
        </div>
      ))}
    </div>
  );
}