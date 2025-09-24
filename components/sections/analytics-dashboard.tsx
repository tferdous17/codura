"use client";

import { useState, useEffect } from "react";
import { Section } from "@/components/ui/section";
import { Chart } from "@/components/ui/chart";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { cn } from "@/lib/utils";

const monthlyGrowth = [
  { label: "Jan", value: 1200 },
  { label: "Feb", value: 1890 },
  { label: "Mar", value: 2340 },
  { label: "Apr", value: 2100 },
  { label: "May", value: 2800 },
  { label: "Jun", value: 3200 }
];

const problemDifficulty = [
  { label: "Easy", value: 45, color: "#10b981" },
  { label: "Medium", value: 35, color: "#f59e0b" },
  { label: "Hard", value: 20, color: "#ef4444" }
];

const universityPerformance = [
  { label: "MIT", value: 94 },
  { label: "Stanford", value: 92 },
  { label: "FSC", value: 89 },
  { label: "Berkeley", value: 91 },
  { label: "CMU", value: 93 }
];

export default function AnalyticsDashboard() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('analytics');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <Section id="analytics" className="py-20 bg-gradient-to-b from-background via-muted/5 to-background relative overflow-hidden">
      {/* Nightwatch-inspired background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-300/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 bg-brand/10 border border-brand/20 rounded-full text-sm font-medium text-brand mb-6 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            Real-time Analytics
          </div>
          <h2 className={cn(
            "text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-brand bg-clip-text text-transparent transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            Data-Driven Interview Preparation
          </h2>
          <p className={cn(
            "text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            Track progress, analyze performance, and optimize your learning path with comprehensive analytics and insights.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Student Growth Chart */}
          <div className={cn(
            "lg:col-span-2 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <div className="p-6 bg-card/50 backdrop-blur-sm border border-border/40 rounded-xl hover:border-border/60 hover:bg-card/70 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand/10 rounded-lg text-brand group-hover:bg-brand/20 transition-colors duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Student Growth</h3>
                </div>
                <div className="text-sm text-muted-foreground">Last 6 months</div>
              </div>
              <div className="h-64">
                <Chart data={monthlyGrowth} type="line" />
              </div>
            </div>
          </div>

          {/* Problem Distribution */}
          <div className={cn(
            "space-y-8 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <div className="p-6 bg-card/50 backdrop-blur-sm border border-border/40 rounded-xl hover:border-border/60 hover:bg-card/70 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand/10 rounded-lg text-brand group-hover:bg-brand/20 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Problem Distribution</h3>
              </div>
              <div className="h-48">
                <Chart data={problemDifficulty} type="donut" />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-card/50 backdrop-blur-sm border border-border/40 rounded-lg text-center hover:border-border/60 hover:bg-card/70 transition-all duration-300 group">
                <div className="text-2xl font-bold text-brand mb-2">
                  <AnimatedCounter from={0} to={1200000} />
                </div>
                <div className="text-sm text-muted-foreground">Problems Solved</div>
              </div>
              <div className="p-4 bg-card/50 backdrop-blur-sm border border-border/40 rounded-lg text-center hover:border-border/60 hover:bg-card/70 transition-all duration-300 group">
                <div className="text-2xl font-bold text-green-500 mb-2">
                  <AnimatedCounter from={0} to={94} suffix="%" />
                </div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* University Performance Comparison */}
        <div className={cn(
          "mt-12 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        )}>
          <div className="p-6 bg-card/50 backdrop-blur-sm border border-border/40 rounded-xl hover:border-border/60 hover:bg-card/70 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand/10 rounded-lg text-brand group-hover:bg-brand/20 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">University Performance Comparison</h3>
              </div>
              <div className="text-sm text-muted-foreground">Average interview success rate</div>
            </div>
            <div className="h-64">
              <Chart data={universityPerformance} type="bar" />
            </div>
          </div>
        </div>

        {/* Feature Highlights with enhanced animations */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            {
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
              title: "Performance Tracking",
              description: "Monitor your progress with detailed analytics and performance metrics.",
              color: "blue"
            },
            {
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
              title: "Peer Comparison",
              description: "Compare your performance with peers from your university and beyond.",
              color: "green"
            },
            {
              icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
              title: "Growth Insights",
              description: "Get personalized insights to optimize your learning path and improve faster.",
              color: "purple"
            }
          ].map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "text-center p-6 bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl hover:border-border/60 hover:bg-card/50 transition-all duration-500 group",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${(index + 1) * 200}ms` }}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110",
                feature.color === "blue" && "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
                feature.color === "green" && "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
                feature.color === "purple" && "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
              )}>
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-2 group-hover:text-brand transition-colors duration-300">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Additional analytics insight section */}
        <div className={cn(
          "mt-16 bg-gradient-to-r from-card/30 to-card/50 backdrop-blur-sm border border-border/40 rounded-2xl p-8 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        )}>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-brand mb-2">
                <AnimatedCounter from={0} to={15000} suffix="+" />
              </div>
              <div className="text-muted-foreground">Active students</div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-brand mb-2">
                <AnimatedCounter from={0} to={250000} suffix="+" />
              </div>
              <div className="text-muted-foreground">Problems solved</div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-brand mb-2">
                <AnimatedCounter from={0} to={95} suffix="%" />
              </div>
              <div className="text-muted-foreground">Interview success rate</div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}