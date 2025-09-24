"use client";

import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Section } from "@/components/ui/section";
import { IconCode, IconUsers, IconSchool, IconTrophy } from "@tabler/icons-react";

const stats = [
  {
    icon: <IconUsers className="w-8 h-8" />,
    value: 2847,
    label: "Active Students",
    suffix: "+",
    description: "Students actively preparing for interviews"
  },
  {
    icon: <IconCode className="w-8 h-8" />,
    value: 15420,
    label: "Problems Solved",
    suffix: "+",
    description: "Coding challenges completed successfully"
  },
  {
    icon: <IconSchool className="w-8 h-8" />,
    value: 89,
    label: "Universities",
    suffix: "+",
    description: "Educational institutions using Codura"
  },
  {
    icon: <IconTrophy className="w-8 h-8" />,
    value: 94,
    label: "Job Offers",
    suffix: "%",
    description: "Success rate for active users"
  }
];

export default function StatsSection() {
  return (
    <Section className="py-20 bg-gradient-to-b from-background to-background/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
            Trusted by Students Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students who have transformed their technical interview skills
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="group relative p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-brand/10 text-brand-foreground group-hover:bg-brand/20 transition-colors duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-foreground">
                      <AnimatedCounter
                        from={0}
                        to={stat.value}
                        suffix={stat.suffix}
                        duration={2500}
                      />
                    </div>
                    <div className="text-lg font-semibold text-foreground/90">
                      {stat.label}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {stat.description}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand/20 via-brand/50 to-brand/20 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand/10 to-transparent border border-brand/20">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Live statistics updated in real-time
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}