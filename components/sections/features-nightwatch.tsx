"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "interviews",
    title: "Mock Interviews",
    description: "Practice both sides of the interview process with peers from your university",
    detail: "Conduct and participate in realistic technical interviews with real-time feedback and performance analytics.",
    metric: "2,400+",
    metricLabel: "interviews this month",
    visual: (
      <div className="relative w-full h-48 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_49%,rgba(255,255,255,0.1)_50%,transparent_51%)] bg-[length:20px_20px]" />
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live Interview Session
          </div>
        </div>
        <div className="absolute bottom-4 right-4 space-y-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={cn("h-1 bg-purple-400 rounded", i === 0 ? "w-12" : i === 1 ? "w-8" : "w-6")} />
          ))}
        </div>
      </div>
    )
  },
  {
    id: "collaboration",
    title: "Live Collaboration",
    description: "Real-time coding sessions with integrated communication tools",
    detail: "Pair programming with synchronized code editing, voice chat, and collaborative whiteboarding.",
    metric: "15k+",
    metricLabel: "active students",
    visual: (
      <div className="relative w-full h-48 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-lg overflow-hidden">
        <div className="absolute inset-4">
          <div className="grid grid-cols-3 gap-2 h-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/10 rounded animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 300}ms` }} />
          ))}
        </div>
      </div>
    )
  },
  {
    id: "analysis",
    title: "AI Code Analysis",
    description: "Instant feedback on algorithm complexity and optimization opportunities",
    detail: "Advanced static analysis with performance insights, complexity calculations, and improvement suggestions.",
    metric: "94%",
    metricLabel: "accuracy rate",
    visual: (
      <div className="relative w-full h-48 bg-gradient-to-br from-emerald-900/50 to-teal-900/50 rounded-lg overflow-hidden">
        <div className="absolute inset-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-400 rounded-full" />
              <div className="h-2 bg-emerald-400/50 rounded flex-1" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full" />
              <div className="h-2 bg-yellow-400/50 rounded w-3/4" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-400 rounded-full" />
              <div className="h-2 bg-red-400/50 rounded w-1/2" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 text-xs text-emerald-400 font-mono">
          O(log n)
        </div>
      </div>
    )
  },
  {
    id: "progress",
    title: "Progress Tracking",
    description: "Comprehensive analytics to monitor your interview readiness",
    detail: "Detailed performance metrics, skill progression tracking, and personalized learning recommendations.",
    metric: "250k+",
    metricLabel: "problems solved",
    visual: (
      <div className="relative w-full h-48 bg-gradient-to-br from-violet-900/50 to-pink-900/50 rounded-lg overflow-hidden">
        <div className="absolute inset-4 flex items-end gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-t from-violet-400 to-pink-400 rounded-t"
              style={{
                height: `${30 + (i * 10)}%`,
                width: '12%',
                opacity: 0.7 + (i * 0.1)
              }}
            />
          ))}
        </div>
        <div className="absolute top-2 left-2 text-xs text-violet-300">
          Performance Trend
        </div>
      </div>
    )
  }
];

export default function FeaturesNightwatch({ className }: { className?: string }) {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.1 }
    );

    const element = document.getElementById('features-nightwatch');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features-nightwatch"
      className={cn("py-24 bg-gradient-to-b from-black via-gray-900 to-black text-white", className)}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              master interviews
            </span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Our comprehensive platform combines peer learning, AI assistance, and real-world practice
            to prepare you for any technical interview challenge.
          </p>
        </div>

        {/* Asymmetrical Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Left Column - Large Feature */}
          <div className="lg:row-span-2">
            <div
              className={cn(
                "group relative h-full bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl overflow-hidden transition-all duration-500 hover:border-purple-500/30",
                isVisible && "animate-in slide-in-from-left duration-700"
              )}
              onMouseEnter={() => setActiveFeature(features[0].id)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              <div className="p-8 h-full flex flex-col">
                <div className="mb-6">
                  {features[0].visual}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-300 transition-colors">
                    {features[0].title}
                  </h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {features[0].description}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {features[0].detail}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{features[0].metric}</div>
                    <div className="text-xs text-gray-500">{features[0].metricLabel}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center group-hover:border-purple-500 transition-colors">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Smaller Features */}
          <div className="space-y-8">
            {features.slice(1, 3).map((feature, index) => (
              <div
                key={feature.id}
                className={cn(
                  "group relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800/50 rounded-xl overflow-hidden transition-all duration-500 hover:border-purple-500/30",
                  isVisible && `animate-in slide-in-from-right duration-700 delay-${(index + 1) * 200}`
                )}
                onMouseEnter={() => setActiveFeature(feature.id)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div className="p-6">
                  <div className="mb-4 h-32">
                    {feature.visual}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-emerald-400">{feature.metric}</div>
                      <div className="text-xs text-gray-500">{feature.metricLabel}</div>
                    </div>
                    <div className="w-6 h-6 rounded-full border border-gray-700 flex items-center justify-center group-hover:border-purple-500 transition-colors">
                      <svg className="w-3 h-3 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Feature */}
        <div
          className={cn(
            "group relative bg-gradient-to-r from-gray-900/50 via-purple-900/20 to-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl overflow-hidden transition-all duration-500 hover:border-purple-500/30",
            isVisible && "animate-in slide-in-from-bottom duration-700 delay-600"
          )}
          onMouseEnter={() => setActiveFeature(features[3].id)}
          onMouseLeave={() => setActiveFeature(null)}
        >
          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4 group-hover:text-purple-300 transition-colors">
                  {features[3].title}
                </h3>
                <p className="text-gray-400 mb-4 text-lg leading-relaxed">
                  {features[3].description}
                </p>
                <p className="text-gray-300 leading-relaxed">
                  {features[3].detail}
                </p>
                <div className="mt-6 flex items-center gap-6">
                  <div>
                    <div className="text-3xl font-bold text-violet-400">{features[3].metric}</div>
                    <div className="text-sm text-gray-500">{features[3].metricLabel}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center group-hover:border-purple-500 transition-colors">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="h-64">
                {features[3].visual}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}