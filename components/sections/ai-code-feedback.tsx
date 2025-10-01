"use client";

import { useState, useEffect, useRef } from "react";
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section className={cn("py-20 relative overflow-hidden", className)}>
      {/* Enhanced glassmorphism glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[550px] h-[550px] bg-brand/9 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-purple-500/8 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-blue-500/6 rounded-full blur-[80px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Animated beam lines */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-brand/30 to-transparent animate-pulse"
            style={{
              left: `${15 + i * 17}%`,
              height: '100%',
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + i * 0.3}s`
            }}
          />
        ))}
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,224,194,0.03)_0%,transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Enhanced Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge className="mb-6 bg-brand/10 border-brand/20 text-brand hover:bg-brand/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <div className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
              AI-Powered Analysis
            </div>
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-brand bg-clip-text text-transparent leading-tight">
            Instant Code Feedback
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            Get real-time analysis of your code with AI-powered suggestions for optimization,
            complexity analysis, and best practices - just like having a senior engineer by your side.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Enhanced Code Editor Card */}
          <Card className="relative border-2 border-border/20 bg-gradient-to-br from-card/50 via-card/30 to-transparent backdrop-blur-2xl overflow-hidden group hover:border-brand/30 transition-all duration-500 shadow-xl">
            {/* Top gradient accent */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

            {/* Floating particles */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-500/30 rounded-full opacity-40 animate-float"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${15 + i * 25}%`,
                  animationDelay: `${i * 0.7}s`,
                  animationDuration: `${4 + i * 0.5}s`
                }}
              />
            ))}

            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <div className="relative">
                    <svg className="w-5 h-5 text-blue-500 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 3a1 1 0 0 0-1 1v3H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-3V4a1 1 0 0 0-1-1H8zM9 5h6v2H9V5zm-4 4h14v6H5V9z"/>
                    </svg>
                    <div className="absolute inset-0 bg-blue-500/20 blur-lg" />
                  </div>
                  {currentExample.title}
                </CardTitle>
                <Badge variant="outline" className="font-mono text-xs bg-background/40 backdrop-blur-sm">
                  {currentExample.language}
                </Badge>
              </div>
              <div className="flex gap-2 mt-4">
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
                      "px-3 py-1.5 text-xs rounded-full transition-all duration-300 cursor-pointer font-medium",
                      activeExample === index
                        ? "bg-gradient-to-r from-brand/20 to-orange-300/20 text-brand border border-brand/40 shadow-lg shadow-brand/10 scale-105"
                        : "bg-muted/30 text-muted-foreground hover:bg-muted/50 border border-transparent hover:border-muted/50 hover:scale-105"
                    )}
                  >
                    {example.title}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="relative">
                {/* Enhanced Code display */}
                <div className="relative bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl p-5 border border-border/30 overflow-x-auto backdrop-blur-sm group/code hover:border-brand/20 transition-all duration-300">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent opacity-0 group-hover/code:opacity-100 transition-opacity duration-500" />
                  <pre className="text-sm font-mono leading-relaxed">
                    <code className="language-python text-foreground">
                      {showOptimized ? currentExample.aiAnalysis.optimizedCode : currentExample.code}
                    </code>
                  </pre>
                  {showOptimized && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                      <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="text-xs font-semibold text-green-500">Optimized</span>
                    </div>
                  )}
                </div>

                {/* Enhanced Action buttons */}
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={analyzeCode}
                    disabled={isAnalyzing}
                    className={cn(
                      "relative px-6 py-3 font-semibold text-sm rounded-2xl transition-all duration-300 overflow-hidden group/btn",
                      isAnalyzing
                        ? "bg-muted/40 text-muted-foreground cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:scale-[1.02] shadow-lg hover:shadow-xl hover:shadow-blue-500/30"
                    )}
                  >
                    {!isAnalyzing && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 bg-[length:200%_100%] animate-shimmer" />
                        <span className="relative z-10 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          Analyze Code
                        </span>
                      </>
                    )}
                    {isAnalyzing && (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                        Analyzing...
                      </div>
                    )}
                  </button>

                  {analysisProgress === 100 && (
                    <button
                      onClick={toggleOptimized}
                      className="relative px-6 py-3 rounded-2xl font-semibold text-sm bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-500 border border-green-500/40 hover:border-green-500/60 transition-all duration-300 cursor-pointer hover:scale-[1.02] shadow-lg hover:shadow-green-500/20 overflow-hidden group/opt"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/10 opacity-0 group-hover/opt:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        {showOptimized ? "Show Original" : "Show Optimized"}
                      </span>
                    </button>
                  )}
                </div>

                {/* Enhanced Analysis progress */}
                {isAnalyzing && (
                  <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-background/60 to-background/40 backdrop-blur-lg border border-border/20">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span className="font-medium">Analyzing complexity and patterns...</span>
                      <span className="font-bold text-brand">{Math.round(analysisProgress)}%</span>
                    </div>
                    <div className="relative w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-brand via-orange-300 to-brand h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${analysisProgress}%` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced AI Analysis Results Card */}
          <Card
            ref={cardRef}
            onMouseMove={handleMouseMove}
            className="relative border-2 border-border/20 bg-gradient-to-br from-card/50 via-card/30 to-transparent backdrop-blur-2xl overflow-hidden group hover:border-purple-500/30 transition-all duration-500 shadow-xl"
          >
            {/* Ambient light following cursor */}
            <div
              className="absolute w-96 h-96 rounded-full blur-3xl opacity-15 transition-all duration-300 pointer-events-none"
              style={{
                background: `radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)`,
                left: mousePosition.x - 192,
                top: mousePosition.y - 192,
              }}
            />

            {/* Top gradient accent */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

            {/* Floating particles */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-purple-500/30 rounded-full opacity-40 animate-float"
                style={{
                  left: `${25 + i * 30}%`,
                  top: `${20 + i * 25}%`,
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: `${4 + i * 0.6}s`
                }}
              />
            ))}

            <CardHeader className="relative z-10">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <div className="relative">
                  <svg className="w-5 h-5 text-purple-500 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="m2 17 10 5 10-5"/>
                    <path d="m2 12 10 5 10-5"/>
                  </svg>
                  <div className="absolute inset-0 bg-purple-500/20 blur-lg animate-pulse" />
                </div>
                AI Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              {analysisProgress === 100 ? (
                <>
                  {/* Enhanced Complexity Analysis */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-background/60 to-background/40 backdrop-blur-lg border border-border/20">
                    <h4 className="font-bold text-xs text-muted-foreground mb-3 tracking-wider uppercase flex items-center gap-2">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                      Complexity
                    </h4>
                    <Badge variant="outline" className="font-mono text-sm bg-brand/10 text-brand border-brand/30 px-3 py-1.5">
                      {currentExample.aiAnalysis.complexity}
                    </Badge>
                  </div>

                  {/* Enhanced Issues */}
                  <div>
                    <h4 className="font-bold text-xs text-muted-foreground mb-3 tracking-wider uppercase flex items-center gap-2">
                      <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      Identified Issues
                    </h4>
                    <div className="space-y-2.5">
                      {currentExample.aiAnalysis.issues.map((issue, index) => (
                        <div key={index} className="relative group/issue p-4 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/30 hover:border-red-500/50 transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover/issue:opacity-100 transition-opacity duration-300" />
                          <div className="flex items-start gap-3 relative z-10">
                            <div className="relative mt-0.5">
                              <svg className="w-4 h-4 text-red-500 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                              </svg>
                              <div className="absolute inset-0 bg-red-500/20 blur-md" />
                            </div>
                            <span className="text-sm text-red-500 leading-relaxed font-medium">{issue}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Suggestions */}
                  <div>
                    <h4 className="font-bold text-xs text-muted-foreground mb-3 tracking-wider uppercase flex items-center gap-2">
                      <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      AI Suggestions
                    </h4>
                    <div className="space-y-2.5">
                      {currentExample.aiAnalysis.suggestions.map((suggestion, index) => (
                        <div key={index} className="relative group/suggestion p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 hover:border-green-500/50 transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent opacity-0 group-hover/suggestion:opacity-100 transition-opacity duration-300" />
                          <div className="flex items-start gap-3 relative z-10">
                            <div className="relative mt-0.5">
                              <svg className="w-4 h-4 text-green-500 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              <div className="absolute inset-0 bg-green-500/20 blur-md" />
                            </div>
                            <span className="text-sm text-green-500 leading-relaxed font-medium">{suggestion}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="relative w-20 h-20 bg-gradient-to-br from-muted/30 to-muted/10 rounded-full flex items-center justify-center mb-6 group/icon">
                    <svg className="w-10 h-10 text-muted-foreground group-hover/icon:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="m2 17 10 5 10-5"/>
                      <path d="m2 12 10 5 10-5"/>
                    </svg>
                    <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-xl opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Ready to Analyze</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                    Click "Analyze Code" to get instant AI-powered feedback on complexity, issues, and optimizations.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Feature highlights */}
        <div className="mt-20 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              ),
              title: "Instant Analysis",
              description: "Get feedback in seconds, not hours",
              color: "from-yellow-500/20 to-orange-500/10",
              iconColor: "text-brand",
              glowColor: "rgba(255, 224, 194, 0.15)"
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              ),
              title: "Best Practices",
              description: "Learn industry-standard patterns and optimizations",
              color: "from-green-500/20 to-emerald-500/10",
              iconColor: "text-green-500",
              glowColor: "rgba(34, 197, 94, 0.15)"
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ),
              title: "Complexity Insights",
              description: "Understand time and space complexity with clear explanations",
              color: "from-purple-500/20 to-pink-500/10",
              iconColor: "text-purple-500",
              glowColor: "rgba(168, 85, 247, 0.15)"
            }
          ].map((feature, index) => (
            <Card
              key={index}
              className="relative border-2 border-border/20 bg-gradient-to-br from-card/40 via-card/20 to-transparent backdrop-blur-xl text-center p-8 group hover:border-brand/30 transition-all duration-500 overflow-hidden hover:scale-[1.02] shadow-lg hover:shadow-xl"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Top gradient accent */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Background glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"
                style={{ background: `radial-gradient(circle at center, ${feature.glowColor}, transparent 70%)` }}
              />

              {/* Icon */}
              <div className={cn(
                "relative w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:scale-110",
                "bg-gradient-to-br backdrop-blur-lg border border-border/30 group-hover:border-brand/40",
                feature.color
              )}>
                <div className="relative z-10">
                  <div className={cn("relative", feature.iconColor)}>
                    {feature.icon}
                  </div>
                </div>
                {/* Icon glow */}
                <div
                  className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ backgroundColor: feature.glowColor }}
                />
              </div>

              <div className="relative z-10">
                <h3 className="font-bold mb-3 text-lg group-hover:text-brand transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Bottom shine */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}