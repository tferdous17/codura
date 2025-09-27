// src/app/page.tsx

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

export default function LandingPage() {
  return (
    // CRITICAL: Set base background color (bg-neutral-950) and min-height on the outermost container.
    <div className="relative min-h-screen bg-neutral-950"> 
      
      {/* Fixed background layer for the grid, floating code, and global gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle, full-screen grid pattern */}
        <div className="bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] absolute inset-0" />
        
        {/* Floating Code/Elements */}
        <FloatingCode className="opacity-30" />

        {/* NEW: Global Radial Gradient for Depth (Nightwatch-inspired Blue/Orange theme) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(40,150,255,0.1)_0%,transparent_50%),radial-gradient(ellipse_at_top,rgba(255,165,0,0.05)_0%,transparent_50%)]" />
      </div>
      
      {/* Navbar is outside the main container to stretch full-width */}
      <NavbarNightwatch />
      
      {/* Main Content Wrapper (z-10) - Sections content sits here */}
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
      
      {/* Footer ensures it's above the fixed background */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}