"use client"

import React from "react";
import { Badge } from "@/components/ui/badge";
import NavbarNightwatch from "@/components/navigation/navbar-nightwatch";
import HeroElevated from "@/components/sections/hero-elevated";
import FeaturesModern from "@/components/sections/features-modern";
import PlatformShowcase from "@/components/sections/platform-showcase";
import SuccessStories from "@/components/sections/success-stories";
import UniversityShowcase from "@/components/sections/university-showcase";
import StatsSection from "@/components/sections/stats-section";
import GamificationPreview from "@/components/sections/gamification-preview";
import FAQProfessional from "@/components/sections/faq-professional";
import FloatingCode from "@/components/ui/floating-code";
import AICodeFeedback from "@/components/sections/ai-code-feedback";
import RealTimeCollaboration from "@/components/sections/real-time-collaboration";
import AlgorithmComplexity from "@/components/sections/algorithm-complexity";

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Enhanced background with floating code */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] absolute inset-0" />
        <FloatingCode className="opacity-30" />
      </div>

      <NavbarNightwatch />

      {/* Hero Section with enhanced design */}
      <HeroElevated />

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="outline" className="mb-6 border-foreground/20">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              Core Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
              Everything you need to succeed
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From mock interviews to real-time collaboration, we have everything you need to prepare for technical interviews.
            </p>
          </div>
          <FeaturesModern />
        </div>
      </section>

      {/* Platform Showcase */}
      <PlatformShowcase />

      {/* AI Code Feedback Section */}
      <AICodeFeedback />

      {/* Big O Analysis Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 border border-brand/20 rounded-full text-sm font-medium text-brand mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              Algorithm Mastery
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-brand bg-clip-text text-transparent">
              Master Algorithm Complexity
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Interactive visualizations help you understand Big O notation and optimize your solutions for technical interviews.
            </p>
          </div>
          <AlgorithmComplexity />
        </div>
      </section>

      {/* Real-time Collaboration */}
      <RealTimeCollaboration />

      {/* Success Stories */}
      <SuccessStories />

      {/* Enhanced Call to Action */}
      <section className="py-20 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
        {/* Nightwatch-inspired background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-brand/5 rounded-full blur-3xl animate-glow" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-300/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1s' }} />

          {/* Animated beams */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-px bg-gradient-to-b from-transparent via-brand/30 to-transparent animate-beam"
                style={{
                  left: `${20 + i * 12}%`,
                  height: '100%',
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: '4s'
                }}
              />
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="p-12 bg-card/50 backdrop-blur-sm border border-border/40 rounded-2xl hover:border-border/60 hover:bg-card/70 transition-all duration-300 group overflow-hidden relative">
            {/* Enhanced hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand/5 to-orange-300/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,224,194,0.1),transparent)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground to-brand bg-clip-text text-transparent">
                Ready to transform your interview skills?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Join thousands of students who have mastered technical interviews with Codura's comprehensive platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-gradient-to-r from-foreground to-foreground/90 hover:from-foreground/90 hover:to-foreground text-background rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-foreground/25 relative overflow-hidden group">
                  <span className="relative z-10">Start practicing now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                </button>
                <button className="px-8 py-3 border border-border/40 hover:border-border/60 bg-background/50 hover:bg-background/80 backdrop-blur-sm rounded-lg font-semibold transition-all duration-300 hover:scale-105 relative overflow-hidden group">
                  <span className="relative z-10">Watch platform demo</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}