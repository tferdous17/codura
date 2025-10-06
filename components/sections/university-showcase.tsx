// src/components/sections/university-showcase.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { Section } from "@/components/ui/section";
import { IconTrophy, IconUsers, IconCode, IconArrowRight, IconSparkles, IconFlame, IconTrendingUp } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const universities = [
  {
    id: "fsc",
    name: "Farmingdale State College",
    abbreviation: "FSC",
    logo: "/college-logos/fsc.png",
    students: 1247,
    problemsSolved: 5680,
    ranking: 1,
    featured: true,
    color: "from-green-600/20 to-green-500/20",
    glowColor: "rgba(34, 197, 94, 0.15)",
    accentColor: "text-green-500",
    trend: "+12%"
  },
  {
    id: "sbu",
    name: "Stony Brook University",
    abbreviation: "SBU",
    logo: "/college-logos/sbu.png",
    students: 892,
    problemsSolved: 4321,
    ranking: 2,
    featured: false,
    color: "from-red-500/20 to-orange-500/20",
    glowColor: "rgba(239, 68, 68, 0.15)",
    accentColor: "text-red-500",
    trend: "+8%"
  },
  {
    id: "nyu",
    name: "New York University",
    abbreviation: "NYU",
    logo: "/college-logos/nyu.png",
    students: 743,
    problemsSolved: 3890,
    ranking: 3,
    featured: false,
    color: "from-purple-500/20 to-pink-500/20",
    glowColor: "rgba(168, 85, 247, 0.15)",
    accentColor: "text-purple-500",
    trend: "+15%"
  },
  {
    id: "mit",
    name: "Massachusetts Institute of Technology",
    abbreviation: "MIT",
    logo: "/college-logos/mit.png",
    students: 654,
    problemsSolved: 7234,
    ranking: 4,
    featured: false,
    color: "from-red-400/20 to-red-800/20",
    glowColor: "rgba(220, 38, 38, 0.15)",
    accentColor: "text-red-600",
    trend: "+20%"
  },
  {
    id: "columbia",
    name: "Columbia University",
    abbreviation: "CU",
    logo: "/college-logos/columbia.png",
    students: 567,
    problemsSolved: 2945,
    ranking: 5,
    featured: false,
    color: "from-indigo-500/20 to-blue-500/20",
    glowColor: "rgba(99, 102, 241, 0.15)",
    accentColor: "text-indigo-500",
    trend: "+5%"
  }
];

// Animated Counter Component
function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(value);

  useEffect(() => {
    countRef.current = value;
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * countRef.current));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{count.toLocaleString()}</>;
}

export default function UniversityShowcase() {
  const [selectedUniversity, setSelectedUniversity] = useState(universities[0]);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAutoRotating) return;

    const interval = setInterval(() => {
      setSelectedUniversity(prev => {
        const currentIndex = universities.findIndex(u => u.id === prev.id);
        const nextIndex = (currentIndex + 1) % universities.length;
        return universities[nextIndex];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoRotating]);

  const handleUniversityClick = (university: typeof universities[0]) => {
    setSelectedUniversity(university);
    setIsAutoRotating(false);
    setTimeout(() => setIsAutoRotating(true), 10000);
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
    <Section className="py-20 relative overflow-hidden">
      {/* Enhanced glassmorphism glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[560px] h-[560px] bg-brand/9 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2.5s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-[490px] h-[490px] bg-orange-300/8 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '5.5s' }} />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-brand-foreground/5 rounded-full blur-[80px] animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Animated beam lines */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-brand/30 to-transparent animate-pulse"
            style={{
              left: `${20 + i * 20}%`,
              height: '100%',
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + i * 0.2}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Enhanced Title Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge className="mb-6 bg-brand/10 border-brand/20 text-brand hover:bg-brand/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-2">
              <IconTrophy className="w-3 h-3" />
              <div className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
              University Leaderboards
            </div>
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-brand bg-clip-text text-transparent leading-tight">
            University Leaderboards
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Compete with students from your university and beyond. See how your school ranks in our global community.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Enhanced University List */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <IconTrophy className="w-6 h-6 text-brand relative z-10" />
                <div className="absolute inset-0 bg-brand/20 blur-lg" />
              </div>
              <h3 className="text-2xl font-semibold">Top Universities</h3>
            </div>

            {universities.map((university, index) => (
              <div
                key={university.id}
                className={cn(
                  "group relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden",
                  selectedUniversity.id === university.id
                    ? "border-brand/50 bg-gradient-to-br from-card/60 via-card/40 to-transparent backdrop-blur-xl shadow-2xl shadow-brand/20 scale-[1.02]"
                    : "border-border/20 bg-gradient-to-br from-card/30 via-card/20 to-transparent backdrop-blur-lg hover:border-brand/30 hover:bg-card/40 hover:scale-[1.01] hover:shadow-xl hover:shadow-brand/10"
                )}
                onClick={() => handleUniversityClick(university)}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Top gradient accent */}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Corner glow */}
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"
                  style={{ backgroundColor: university.glowColor }}
                />

                {/* Ranking badge with premium glassmorphic design */}
                <div className="absolute -top-3 -left-3 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-xl border-2 border-brand/30 font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="bg-gradient-to-br from-brand to-orange-300 bg-clip-text text-transparent">
                    {university.ranking}
                  </span>
                </div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 relative flex-shrink-0 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                      <Image
                        src={university.logo}
                        alt={`${university.abbreviation} logo`}
                        width={80}
                        height={80}
                        className="object-contain object-center drop-shadow-lg"
                        style={{ maxWidth: '80px', maxHeight: '80px', width: 'auto', height: 'auto' }}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-lg group-hover:text-brand transition-colors duration-300">
                          {university.abbreviation}
                        </h4>
                        {university.ranking <= 3 && (
                          <IconSparkles className={cn("w-4 h-4", university.accentColor)} />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{university.name}</p>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                      <IconUsers className="w-4 h-4" />
                      <span className="font-medium">{university.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-end gap-2 text-sm text-brand font-semibold">
                      <IconCode className="w-4 h-4" />
                      <span>{university.problemsSolved.toLocaleString()}</span>
                    </div>
                  </div>

                  {selectedUniversity.id === university.id && (
                    <div className="ml-3">
                      <IconArrowRight className="w-5 h-5 text-brand animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Bottom shine effect */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
            ))}
          </div>

          {/* Enhanced Selected University Details */}
          <div className="lg:pl-8">
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              className={cn(
                "relative p-8 rounded-3xl border-2 transition-all duration-700 overflow-hidden group",
                "bg-gradient-to-br from-card/50 via-card/30 to-transparent backdrop-blur-2xl",
                "border-border/30 hover:border-brand/40",
                "shadow-2xl hover:shadow-3xl"
              )}
              style={{
                boxShadow: `0 25px 50px -12px ${selectedUniversity.glowColor}, 0 0 0 1px rgba(255,255,255,0.05)`
              }}
            >
              {/* Ambient light following cursor */}
              <div
                className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${selectedUniversity.glowColor} 0%, transparent 70%)`,
                  left: mousePosition.x - 192,
                  top: mousePosition.y - 192,
                }}
              />

              {/* Animated gradient overlay */}
              <div className={cn(
                "absolute inset-0 rounded-3xl bg-gradient-to-br opacity-10 transition-opacity duration-700",
                selectedUniversity.color
              )} />

              {/* Top gradient border shine */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

              {/* Floating particles */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={cn("absolute w-1 h-1 rounded-full opacity-40 animate-float", selectedUniversity.accentColor.replace('text-', 'bg-'))}
                  style={{
                    left: `${15 + i * 12}%`,
                    top: `${20 + (i % 3) * 25}%`,
                    animationDelay: `${i * 0.8}s`,
                    animationDuration: `${4 + i * 0.5}s`
                  }}
                />
              ))}

              <div className="relative z-10">
                {/* Header with logo */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border/20">
                  <div className="relative">
                    <div className="w-24 h-24 relative flex-shrink-0 transform group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                      <Image
                        src={selectedUniversity.logo}
                        alt={`${selectedUniversity.abbreviation} logo`}
                        width={96}
                        height={96}
                        className="object-contain object-center drop-shadow-2xl"
                        style={{ maxWidth: '96px', maxHeight: '96px', width: 'auto', height: 'auto' }}
                      />
                    </div>
                    {/* Logo glow */}
                    <div
                      className="absolute inset-0 blur-2xl opacity-30"
                      style={{ backgroundColor: selectedUniversity.glowColor }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-foreground to-brand bg-clip-text text-transparent">
                        {selectedUniversity.abbreviation}
                      </h3>
                      {selectedUniversity.ranking === 1 && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-brand/20 border border-brand/30">
                          <IconFlame className="w-3 h-3 text-brand" />
                          <span className="text-xs font-bold text-brand">#1</span>
                        </div>
                      )}
                    </div>
                    <p className="text-base text-muted-foreground">{selectedUniversity.name}</p>
                  </div>
                </div>

                {/* Stats Grid with animated counters */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="relative group/stat p-5 rounded-2xl bg-gradient-to-br from-background/60 via-background/40 to-transparent backdrop-blur-lg border border-border/20 hover:border-brand/30 transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <IconUsers className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-medium">Active Students</span>
                      </div>
                      <div className="text-3xl font-bold text-foreground">
                        <AnimatedCounter value={selectedUniversity.students} />
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <IconTrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-500 font-semibold">{selectedUniversity.trend}</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative group/stat p-5 rounded-2xl bg-gradient-to-br from-background/60 via-background/40 to-transparent backdrop-blur-lg border border-border/20 hover:border-brand/30 transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <IconCode className="w-4 h-4 text-brand" />
                        <span className="text-xs text-muted-foreground font-medium">Problems Solved</span>
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-brand to-orange-300 bg-clip-text text-transparent">
                        <AnimatedCounter value={selectedUniversity.problemsSolved} />
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <IconSparkles className="w-3 h-3 text-brand" />
                        <span className="text-xs text-brand font-semibold">Most Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ranking Badge */}
                <div className="relative p-5 rounded-2xl bg-gradient-to-br from-brand/10 via-brand/5 to-transparent backdrop-blur-lg border border-brand/30 mb-6 overflow-hidden group/rank">
                  <div className="absolute inset-0 bg-gradient-to-r from-brand/10 to-orange-300/10 opacity-0 group-hover/rank:opacity-100 transition-opacity duration-500" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="relative">
                      <IconTrophy className="w-8 h-8 text-brand relative z-10" />
                      <div className="absolute inset-0 bg-brand/30 blur-xl animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-0.5">
                        #{selectedUniversity.ranking} Global Ranking
                      </div>
                      <div className="text-sm text-muted-foreground">Based on student performance</div>
                    </div>
                    <div className="text-4xl font-black bg-gradient-to-br from-brand to-orange-300 bg-clip-text text-transparent">
                      {selectedUniversity.ranking}
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="relative w-full px-6 py-4 rounded-2xl font-semibold overflow-hidden group/button transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-brand to-orange-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-brand via-orange-300 to-brand opacity-0 group-hover/button:opacity-100 transition-opacity duration-500 bg-[length:200%_100%] animate-shimmer" />
                  <span className="relative z-10 flex items-center justify-center gap-2 text-black">
                    <IconSparkles className="w-5 h-5" />
                    Join {selectedUniversity.abbreviation} Channel
                    <IconArrowRight className="w-5 h-5 group-hover/button:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </div>
            </div>

            {/* Auto-rotation indicator */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-br from-muted/40 to-muted/20 backdrop-blur-lg border border-border/20 text-sm">
                <div className="relative flex items-center">
                  <div className={cn(
                    "w-2 h-2 rounded-full transition-colors duration-300",
                    isAutoRotating ? "bg-green-500 animate-pulse" : "bg-orange-400"
                  )} />
                  <div className={cn(
                    "absolute w-2 h-2 rounded-full animate-ping",
                    isAutoRotating ? "bg-green-500" : "bg-orange-400"
                  )} />
                </div>
                <span className="text-muted-foreground font-medium">
                  {isAutoRotating ? "Auto-rotating showcase" : "Manual selection active"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
