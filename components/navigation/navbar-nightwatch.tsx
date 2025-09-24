"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Features", href: "#features" },
  { name: "Analytics", href: "#analytics" },
  { name: "Universities", href: "#universities" },
  { name: "Success Stories", href: "#success-stories" },
  { name: "Pricing", href: "#pricing" }
];

export default function NavbarNightwatch() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Track active section for smooth navigation highlighting
      const sections = navItems.map(item => item.href.substring(1));
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const smoothScrollTo = (href: string) => {
    const element = document.getElementById(href.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-lg shadow-background/20"
          : "bg-transparent border-b border-transparent"
      )}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo with glow effect */}
            <div className="flex items-center group">
              <div className="text-2xl font-bold tracking-tight relative">
                <span className="text-foreground">cod</span>
                <span className="text-brand relative">
                  ura
                  <div className="absolute -inset-1 bg-gradient-to-r from-brand/20 to-orange-300/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
                </span>
              </div>
            </div>

            {/* Navigation Links - Center with active indicators */}
            <div className="hidden md:flex items-center space-x-1 bg-muted/10 backdrop-blur-sm rounded-full px-2 py-1 border border-border/20">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => smoothScrollTo(item.href)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 relative",
                    activeSection === item.href.substring(1)
                      ? "text-foreground bg-background/80 shadow-sm border border-border/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                  )}
                >
                  {item.name}
                  {activeSection === item.href.substring(1) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-brand/5 to-orange-300/5 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* CTA Buttons with enhanced styling */}
            <div className="flex items-center space-x-3">
              <button className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 px-3 py-2 rounded-lg hover:bg-muted/20">
                Sign in
              </button>
              <button className="px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-foreground to-foreground/90 hover:from-foreground/90 hover:to-foreground text-background rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-foreground/25 relative overflow-hidden group">
                <span className="relative z-10">Get started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand/20 to-orange-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/30 transition-all duration-200"
              >
                <svg
                  className={cn("w-5 h-5 transition-transform duration-200", isMobileMenuOpen && "rotate-180")}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-x-0 top-16 z-40 md:hidden transition-all duration-300 ease-in-out",
        isMobileMenuOpen
          ? "opacity-100 translate-y-0 visible"
          : "opacity-0 -translate-y-4 invisible"
      )}>
        <div className="bg-background/95 backdrop-blur-xl border border-border/40 mx-4 rounded-xl shadow-xl p-6">
          <div className="space-y-3">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => smoothScrollTo(item.href)}
                className="w-full text-left px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg transition-all duration-200 font-medium"
              >
                {item.name}
              </button>
            ))}
            <div className="border-t border-border/30 pt-4 mt-4">
              <button className="w-full text-left px-4 py-3 text-muted-foreground hover:text-foreground rounded-lg transition-colors duration-200 font-medium">
                Sign in
              </button>
              <button className="w-full mt-2 px-4 py-3 bg-foreground text-background rounded-lg font-semibold hover:bg-foreground/90 transition-colors duration-200">
                Get started
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}