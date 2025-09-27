// tferdous17/codura/codura-landing-page-testing/app/page.tsx

"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import NavbarNightwatch from "@/components/navigation/navbar-nightwatch";
import HeroElevated from "@/components/sections/hero-elevated";
import FeaturesModern from "@/components/sections/features-modern";
import PlatformShowcase from "@/components/sections/platform-showcase";
import SuccessStories from "@/components/sections/success-stories";
import FAQProfessional from "@/components/sections/faq-professional";
import FloatingCode from "@/components/ui/floating-code";
import AICodeFeedback from "@/components/sections/ai-code-feedback";
import RealTimeCollaboration from "@/components/sections/real-time-collaboration";
import AlgorithmComplexity from "@/components/sections/algorithm-complexity";
import UniversityShowcase from "@/components/sections/university-showcase";
import EnhancedCTA from "@/components/sections/enhanced-cta";
import Footer from "@/components/navigation/footer";
import TestimonialsNightwatch from "@/components/sections/testimonials-nightwatch";

export default function LandingPage() {
  return (
    // Set base background to deep black and min-height
    <div className="relative min-h-screen bg-neutral-950"> 
      
      <div className="fixed inset-0 pointer-events-none z-0">
        
        <FloatingCode className="opacity-30" />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.5)_0%,transparent_70%)]" />

        <div 
          className="absolute top-[-200px] left-[60%] w-[120vw] h-[120vh] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(255,224,194,0.05)_0%,transparent_60%)] animate-pulse-slow opacity-70" 
        />
        
        <div 
          className="absolute bottom-[10%] right-[70%] w-[80vw] h-[80vh] bg-[radial-gradient(ellipse_at_center,rgba(40,40,60,0.05)_0%,transparent_70%)] animate-float-slow"
          style={{ animationDelay: '10s', animationDuration: '30s' }}
        />
      </div>
      
      <NavbarNightwatch />
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroElevated />
        <FeaturesModern />
        <PlatformShowcase />
        <AICodeFeedback />
        <AlgorithmComplexity />
        <RealTimeCollaboration />
        <UniversityShowcase />
        <SuccessStories />
        <FAQProfessional />
        <EnhancedCTA />
      </main>
      
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}