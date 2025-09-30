"use client";

import React from "react";

export default function EnhancedCTA() {
  return (
    // REMOVED background gradient - only relying on the fixed global background
    <section className="py-20 relative overflow-hidden">
      {/* Glassmorphism glow effects matching hero elevated */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-brand/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-[550px] h-[550px] bg-brand-foreground/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>

      {/* Nightwatch-inspired background elements (Fixed to section) */}
      <div className="absolute inset-0">
        {/* Animated beams - Kept for local moving effect */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-brand/30 to-transparent animate-beam"
              style={{
                left: `${20 + i * 12}%`,
                height: "100%",
                animationDelay: `${i * 0.8}s`,
                animationDuration: "4s",
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground to-brand bg-clip-text text-transparent leading-tight">
              Ready to transform your interview skills?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join thousands of students who have mastered technical interviews with Codura's comprehensive platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="cursor-pointer px-8 py-3 bg-gradient-to-r from-foreground to-foreground/90 hover:from-foreground/90 hover:to-foreground text-background rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-foreground/25 relative overflow-hidden group">
                <span className="relative z-10">Start practicing now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              </button>
              <button className="cursor-pointer px-8 py-3 border border-border/40 hover:border-border/60 bg-background/50 hover:bg-background/80 backdrop-blur-sm rounded-lg font-semibold transition-all duration-300 hover:scale-105 relative overflow-hidden group">
                <span className="relative z-10">Watch platform demo</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}