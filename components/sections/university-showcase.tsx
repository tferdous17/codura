// src/components/sections/university-showcase.tsx

"use client";

import { useState, useEffect } from "react";
import { Section } from "@/components/ui/section";
import { IconTrophy, IconUsers, IconCode, IconArrowRight } from "@tabler/icons-react";
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
    color: "from-green-600/20 to-green-500/20"
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
    color: "from-red-500/20 to-orange-500/20"
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
    color: "from-purple-500/20 to-pink-500/20"
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
    color: "from-red-400/20 to-red-800/20"
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
    color: "from-indigo-500/20 to-blue-500/20"
  }
];

export default function UniversityShowcase() {
  const [selectedUniversity, setSelectedUniversity] = useState(universities[0]);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

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

  return (
    <Section className="py-20 relative overflow-hidden">
      {/* Glassmorphism glow effects matching hero elevated */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[560px] h-[560px] bg-brand/9 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2.5s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-[490px] h-[490px] bg-brand-foreground/9 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '5.5s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Updated Title Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge className="mb-6 bg-brand/10 border-brand/20 text-brand hover:bg-brand/20 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
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
          {/* University List */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <IconTrophy className="w-6 h-6 text-brand" />
              <h3 className="text-2xl font-semibold">Top Universities</h3>
            </div>

            {universities.map((university) => (
              <div
                key={university.id}
                className={cn(
                  "group p-6 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-[1.02]",
                  selectedUniversity.id === university.id
                    ? "border-brand/50 bg-card/40 backdrop-blur-sm shadow-lg shadow-brand/10"
                    : "border-border/30 bg-card/20 backdrop-blur-sm hover:border-border/50 hover:bg-card/40"
                )}
                onClick={() => handleUniversityClick(university)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-bold text-sm">
                        #{university.ranking}
                      </div>
                      <div className="w-20 h-12 relative flex-shrink-0">
                        <Image
                          src={university.logo}
                          alt={`${university.abbreviation} logo`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg">{university.abbreviation}</h4>
                      <p className="text-sm text-muted-foreground">{university.name}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <IconUsers className="w-4 h-4" />
                      {university.students.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <IconCode className="w-4 h-4" />
                      {university.problemsSolved.toLocaleString()}
                    </div>
                  </div>

                  {selectedUniversity.id === university.id && (
                    <IconArrowRight className="w-5 h-5 text-brand ml-2" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Selected University Details */}
          <div className="lg:pl-8">
            <div
              className={cn(
                "relative p-8 rounded-2xl border border-border/30 bg-gradient-to-br backdrop-blur-sm transition-all duration-500",
                selectedUniversity.color
              )}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/5 to-transparent" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-25 h-15 relative flex-shrink-0">
                        <Image
                          src={selectedUniversity.logo}
                          alt={`${selectedUniversity.abbreviation} logo`}
                          fill
                          className="object-contain"
                        />
                      </div>
                  <div>
                    <h3 className="text-3xl font-bold">{selectedUniversity.abbreviation}</h3>
                    <p className="text-lg text-muted-foreground">{selectedUniversity.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center p-4 rounded-xl bg-background/50">
                    <div className="text-3xl font-bold text-foreground mb-1">
                      {selectedUniversity.students.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Active Students</div>
                  </div>

                  <div className="text-center p-4 rounded-xl bg-background/50">
                    <div className="text-3xl font-bold text-brand mb-1">
                      {selectedUniversity.problemsSolved.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Problems Solved</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-background/30 border border-brand/20">
                  <IconTrophy className="w-6 h-6 text-brand" />
                  <div>
                    <div className="font-semibold">#{selectedUniversity.ranking} Global Ranking</div>
                    <div className="text-sm text-muted-foreground">Based on student performance</div>
                  </div>
                </div>

                <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-brand/80 to-orange-300/80 hover:from-brand hover:to-orange-300 text-black font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-brand/20">
                  Join {selectedUniversity.abbreviation} Channel
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 text-sm text-muted-foreground">
                <div className={cn(
                  "w-2 h-2 rounded-full transition-colors duration-300",
                  isAutoRotating ? "bg-green-500 animate-pulse" : "bg-orange-500"
                )} />
                {isAutoRotating ? "Auto-rotating showcase" : "Manual selection active"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
