"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Choose a theme (e.g., Tomorrow Night)
import 'prismjs/components/prism-python'; // Import Python language support

const codeExamples = [
  {
    id: "two-sum",
    title: "Two Sum",
    language: "Python",
    code: `def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
    aiAnalysis: {
      complexity: "O(n²) time, O(1) space",
      issues: [
        "Nested loops create quadratic time complexity",
        "Inefficient for large inputs"
      ],
      suggestions: [
        "Use hash map to achieve O(n) time complexity",
        "Store complement values while iterating"
      ],
      optimizedCode: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`
    }
  },
  {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    language: "JavaScript",
    code: `function isPalindrome(s) {
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
}`,
    aiAnalysis: {
      complexity: "O(n) time, O(n) space",
      issues: [
        "Creates unnecessary string copies",
        "Uses extra space for reversed string"
      ],
      suggestions: [
        "Use two pointers approach",
        "Check characters in-place without extra space"
      ],
      optimizedCode: `function isPalindrome(s) {
    let left = 0, right = s.length - 1;
    while (left < right) {
        while (left < right && !/[a-z0-9]/i.test(s[left])) left++;
        while (left < right && !/[a-z0-9]/i.test(s[right])) right--;
        if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
        left++; right--;
    }
    return true;
}`
    }
  }
];

export default function AICodeFeedback({ className }: { className?: string }) {
  const [activeExample, setActiveExample] = useState(0);
  const [showOptimized, setShowOptimized] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            setIsAnalyzing(false);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  const currentExample = codeExamples[activeExample];

  useEffect(() => {
    // Highlight code after component mounts or code changes
    Prism.highlightAll();
  }, [showOptimized, currentExample]); // Re-run when these change

  const analyzeCode = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setShowOptimized(false);
  };

  const toggleOptimized = () => {
    setShowOptimized(!showOptimized);
  };

  return (
    // REMOVED background gradient to let the page.tsx fixed background show through
    <section className={cn("py-20 relative overflow-hidden", className)}>
      {/* Background elements inspired by Nightwatch - Subtle vertical beams */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-brand/30 to-transparent animate-pulse"
              style={{
                left: `${8 + i * 7}%`,
                height: '100%',
                animationDelay: `${i * 0.6}s`,
                animationDuration: `${3 + i * 0.2}s`
              }}
            />
          ))}
        </div>
        {/* Subtle radial glow focused on the section content */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,224,194,0.03)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* ... (rest of content) ... */}
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge className="mb-6 bg-brand/10 border-brand/20 text-brand hover:bg-brand/20 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            AI-Powered Analysis
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-brand bg-clip-text text-transparent">
            Instant Code Feedback
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            Get real-time analysis of your code with AI-powered suggestions for optimization,
            complexity analysis, and best practices - just like having a senior engineer by your side.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Code Editor */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 3a1 1 0 0 0-1 1v3H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-3V4a1 1 0 0 0-1-1H8zM9 5h6v2H9V5zm-4 4h14v6H5V9z"/>
                  </svg>
                  {currentExample.title}
                </CardTitle>
                <Badge variant="outline" className="font-mono text-xs">
                  {currentExample.language}
                </Badge>
              </div>
              <div className="flex gap-2 mt-2">
                {codeExamples.map((example, index) => (
                  <button
                    key={example.id}
                    onClick={() => {
                      setActiveExample(index);
                      setShowOptimized(false);
                      setIsAnalyzing(false);
                      setAnalysisProgress(0);
                    }}
                    className={cn(
                      "px-3 py-1 text-xs rounded-3xl transition-all duration-200 cursor-pointer",
                      activeExample === index
                        ? "bg-brand/20 text-brand border border-brand/30"
                        : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    {example.title}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Code display */}
                <div className="bg-muted/20 rounded-lg p-4 border border-border/30 overflow-x-auto">
                  <pre className="text-sm font-mono leading-relaxed">
                    <code className="language-python text-foreground">
                      {showOptimized ? currentExample.aiAnalysis.optimizedCode : currentExample.code}
                    </code>
                  </pre>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mt-4">
                  <button
                  onClick={analyzeCode}
                  disabled={isAnalyzing}
                  className={cn(
                    "px-5 py-2 mt-2 font-semibold text-sm rounded-2xl transition-all duration-200 ease-out cursor-pointer rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400",
                    isAnalyzing
                      ? "bg-gray-600/50 text-gray-400 cursor-not-allowed shadow-none"
                      : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.03] shadow-md hover:shadow-lg"
                  )}
                >
                    {isAnalyzing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
                        Analyzing...
                      </div>
                    ) : (
                      "Analyze Code"
                    )}
                  </button>

                  {analysisProgress === 100 && (
                    <button
                      onClick={toggleOptimized}
                      className="px-5 py-2 mt-2 rounded-3xl font-medium text-sm bg-green-400/15 hover:bg-green-500/25 text-green-600 border border-green-500/30 hover:border-green-500/50 transition-all duration-200 cursor-pointer"
                    >
                      {showOptimized ? "Show Original" : "Show Optimized"}
                    </button>
                  )}
                </div>

                {/* Analysis progress */}
                {isAnalyzing && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Analyzing complexity...</span>
                      <span>{Math.round(analysisProgress)}%</span>
                    </div>
                    <div className="w-full bg-muted/20 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-brand to-orange-300 h-1.5 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${analysisProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis Results */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="m2 17 10 5 10-5"/>
                  <path d="m2 12 10 5 10-5"/>
                </svg>
                AI Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {analysisProgress === 100 ? (
                <>
                  {/* Complexity Analysis */}
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2 tracking-wide">COMPLEXITY</h4>
                    <Badge variant="outline" className="font-mono text-sm">
                      {currentExample.aiAnalysis.complexity}
                    </Badge>
                  </div>

                  {/* Issues */}
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-3 tracking-wide">IDENTIFIED ISSUES</h4>
                    <div className="space-y-2">
                      {currentExample.aiAnalysis.issues.map((issue, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                          <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          <span className="text-sm text-red-600">{issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-3 tracking-wide">AI SUGGESTIONS</h4>
                    <div className="space-y-2">
                      {currentExample.aiAnalysis.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                          <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <span className="text-sm text-green-600">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="m2 17 10 5 10-5"/>
                      <path d="m2 12 10 5 10-5"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Ready to Analyze</h3>
                  <p className="text-sm text-muted-foreground">
                    Click "Analyze Code" to get instant AI-powered feedback on complexity, issues, and optimizations.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Feature highlights */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              ),
              title: "Instant Analysis",
              description: "Get feedback in seconds, not hours"
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              ),
              title: "Best Practices",
              description: "Learn industry-standard patterns and optimizations"
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ),
              title: "Complexity Insights",
              description: "Understand time and space complexity with clear explanations"
            }
          ].map((feature, index) => (
            <Card key={index} className="border-border/0 bg-card/30 backdrop-blur-sm text-center p-6">
              <div className="w-12 h-12 bg-brand/15 text-brand rounded-full flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-2 text-lg">{feature.title}</h3>
              <p className="text-muted-foreground text-md">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}