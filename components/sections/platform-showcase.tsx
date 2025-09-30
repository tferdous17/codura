"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const platformFeatures = [
  {
    id: "interviews",
    title: "Mock Interviews",
    description: "Practice both sides of the interview process",
    metric: "7800+",
    metricLabel: "interviews conducted",
    progressWidth: "80%",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: "collaboration",
    title: "Live Collaboration",
    description: "Real-time coding with peers",
    metric: "15K+",
    metricLabel: "active students",
    progressWidth: "80%",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    )
  },
  {
    id: "analysis",
    title: "AI Code Analysis",
    description: "Instant feedback and optimization",
    metric: "94%",
    metricLabel: "accuracy rate",
    progressWidth: "94%",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 14.5M14.25 3.104c.251.023.501.05.75.082M19.8 14.5l-5.69 5.69c-.77.77-2.05.77-2.82 0L5.6 14.5m14.2 0l-.82.82a5.25 5.25 0 01-7.42 0l-.82-.82m15.64 0a2.25 2.25 0 00-.659-1.591L19.8 7.5" />
      </svg>
    )
  },
  {
    id: "progress",
    title: "Progress Tracking",
    description: "Monitor your interview readiness",
    metric: "44K+",
    metricLabel: "problems solved",
    progressWidth: "80%",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    )
  }
];

export default function PlatformShowcase({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.2 }
    );

    const element = document.getElementById('platform-showcase');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="platform-showcase"
      // REMOVED background gradient. Standardized padding.
      className={cn("py-20 relative overflow-hidden", className)}
    >
      {/* Glassmorphism glow effects matching hero elevated */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-brand/8 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-brand-foreground/8 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge className="mb-6 px-4 py-1 text-sm bg-brand/10 border-brand/20 text-brand hover:bg-brand/20 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
              Platform Insights
            </div>
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-brand bg-clip-text text-transparent leading-tight">
            Built for your success
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Join thousands of students preparing for technical interviews with
            our comprehensive, community-driven platform designed specifically
            for university students.
          </p>
        </div>
        {/* Feature Grid - Side by side like Nightwatch */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {platformFeatures.map((feature, index) => (
            <Card
              key={feature.id}
              className={cn(
                "rounded-xl border-border/25 bg-neutral-800/15 backdrop-blur-sm hover:border-border transition-all duration-500 hover:shadow-lg",
                isVisible && `animate-in slide-in-from-bottom-4 duration-700`,
                isVisible && `delay-${index * 150}`
              )}
            >
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 group-hover:bg-muted transition-colors flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">
                      {feature.metric}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {feature.metricLabel}
                    </div>
                  </div>
                </div>

                {/* Visual indicator */}
                <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: isVisible ? feature.progressWidth : "0%",
                      transitionDelay: `${index * 150 + 500}ms`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Side-by-side call out sections */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* University Focus */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-border transition-all duration-300 hover:shadow-lg overflow-hidden rounded-xl">
            <CardContent className="p-8 relative">
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl" />
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-600 flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  University Communities
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Connect with peers from your university, participate in
                  school-specific competitions, and build your professional
                  network within your academic community.
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-blue-600">
                    50+ Universities
                  </span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    Active leaderboards
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interview Ready */}
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm hover:border-border transition-all duration-300 hover:shadow-lg overflow-hidden rounded-xl">
            <CardContent className="p-8 relative">
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-xl" />
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-600 flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Interview Excellence
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Master both technical and behavioral interviews with our
                  comprehensive preparation tools, real-time feedback, and
                  industry-standard assessment criteria.
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-emerald-600">
                    95% Success Rate
                  </span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    AI-powered feedback
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}