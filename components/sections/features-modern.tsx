"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    title: "Mock Interviews",
    description: "Practice both sides - interview others and get interviewed by peers from your university.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: "Live Collaboration",
    description: "Real-time pair programming with integrated chat, whiteboarding, and voice communication.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    )
  },
  {
    title: "AI Code Analysis",
    description: "Get instant feedback on complexity, optimization suggestions, and best practices.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 14.5M14.25 3.104c.251.023.501.05.75.082M19.8 14.5l-5.69 5.69c-.77.77-2.05.77-2.82 0L5.6 14.5m14.2 0l-.82.82a5.25 5.25 0 01-7.42 0l-.82-.82m15.64 0a2.25 2.25 0 00-.659-1.591L19.8 7.5" />
      </svg>
    )
  },
  {
    title: "University Communities",
    description: "School-specific channels with leaderboards, competitions, and peer mentorship programs.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    )
  },
  {
    title: "Live Code Judge",
    description: "Real-time code evaluation with comprehensive test cases and detailed performance feedback.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    )
  },
  {
    title: "Progress Tracking",
    description: "Monitor your interview readiness with detailed analytics and personalized insights.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    )
  },
  {
    title: "Interview Recording",
    description: "Record practice sessions for self-review and get feedback from mentors and peers.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
      </svg>
    )
  },
  {
    title: "Student Pricing",
    description: "Core features completely free for university students with optional premium add-ons.",
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12s-1.536-.219-2.121-.659c-1.172-.879-1.172-2.303 0-3.182C10.464 7.681 11.232 7.5 12 7.5s1.536.219 2.121.659" />
      </svg>
    )
  }
];

export default function FeaturesModern({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.1 }
    );

    const element = document.getElementById("features-modern");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    // REMOVED background. Standardized padding.
    <section id="features" className="relative py-20 overflow-hidden">
      {/* Glassmorphism glow effects matching hero elevated */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-brand-foreground/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="flex flex-col items-center text-center mb-16">

          <Badge className="mb-6 px-4 py-1 text-sm bg-brand/10 text-brand hover:bg-brand/20 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            Core Features
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-brand bg-clip-text text-transparent leading-tight">
            Everything you need to succeed
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From mock interviews to real-time collaboration, we have everything you need to prepare for technical interviews.
          </p>
          
        </div>

        <div
          id="features-modern"
          className={cn("grid sm:grid-cols-2 lg:grid-cols-4 gap-5", className)}
        >
          {features.map((feature, index) => (
            <Card
            key={feature.title}
            className={cn(
              "group relative overflow-hidden cursor-pointer transition-all duration-500",
              // Glassmorphic base
              "bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl",
              "border-2 border-white/10 rounded-3xl",
              // Hover effects - enhanced glow and lift
              "hover:bg-gradient-to-br hover:from-white/15 hover:via-white/10 hover:to-white/5",
              "hover:border-brand/50 hover:shadow-2xl hover:shadow-brand/20",
              "hover:scale-[1.03] hover:-translate-y-1",
              // Subtle inner glow
              "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-brand/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100",
              // Entrance animations
              isVisible && `animate-in slide-in-from-bottom-6 fade-in duration-700`,
              isVisible && `delay-${index * 75}`
            )}
          >
            {/* Top gradient accent line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Corner glow decoration */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <CardContent className="relative p-8">
              {/* Icon container with glassmorphic background */}
              <div className="relative w-14 h-12 rounded-full mb-6 flex items-center justify-center transition-all duration-500 bg-transparent from-brand/10 to-brand/5 group-hover:border-brand/40 group-hover:shadow-lg group-hover:shadow-brand/25 group-hover:scale-110 backdrop-blur-sm">
                <div className="text-brand group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                {/* Icon glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-brand/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <h3 className="text-lg font-bold mb-3 text-foreground/90 group-hover:text-foreground transition-colors duration-300 group-hover:translate-x-1">
                {feature.title}
              </h3>
              
              <p className="text-sm text-muted-foreground/80 leading-relaxed group-hover:text-muted-foreground transition-colors duration-300">
                {feature.description}
              </p>

              {/* Bottom subtle shine effect */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </CardContent>
          </Card>
          ))}
        </div>
      </div>
    </section>
  );
}