"use client";

import { Section } from "@/components/ui/section";
import { IconQuote, IconStar, IconBriefcase, IconTrendingUp } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const successStories = [
  {
    id: 1,
    name: "Sarah Chen",
    university: "MIT",
    company: "Google",
    role: "Software Engineer",
    avatar: "👩‍💻",
    story: "Codura's mock interviews and community support helped me land my dream job at Google. The university leaderboard kept me motivated!",
    problemsSolved: 847,
    rating: 5,
    featured: true
  },
  {
    id: 2,
    name: "Marcus Johnson",
    university: "FSC",
    company: "Microsoft",
    role: "Backend Developer",
    avatar: "👨‍🔬",
    story: "From struggling with basic algorithms to solving complex system design problems. The collaborative features were game-changing.",
    problemsSolved: 623,
    rating: 5,
    featured: false
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    university: "NYU",
    company: "Meta",
    role: "Full Stack Developer",
    avatar: "👩‍🚀",
    story: "The real-time collaboration and AI hints helped me understand concepts I never could grasp in class. Amazing platform!",
    problemsSolved: 729,
    rating: 5,
    featured: false
  }
];

const companyLogos = [
  { name: "Google", logo: "🅱️", color: "from-blue-500/20 to-red-500/20" },
  { name: "Microsoft", logo: "Ⓜ️", color: "from-blue-600/20 to-green-500/20" },
  { name: "Meta", logo: "🔵", color: "from-blue-400/20 to-purple-500/20" },
  { name: "Apple", logo: "🍎", color: "from-gray-500/20 to-gray-700/20" },
  { name: "Amazon", logo: "📦", color: "from-orange-500/20 to-yellow-500/20" },
  { name: "Netflix", logo: "🎬", color: "from-red-500/20 to-black/20" }
];

export default function SuccessStories() {
  return (
    <Section className="py-20 bg-gradient-to-b from-background to-background/50 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 opacity-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-brand rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Success
            </span>{" "}
            <span className="bg-gradient-to-r from-brand to-orange-300 bg-clip-text text-transparent">
              Stories
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real students, real results. See how Codura transformed their technical interview journey.
          </p>
        </div>

        {/* Company Logos */}
        <div className="mb-16">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Our students have landed jobs at these amazing companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {companyLogos.map((company, index) => (
              <div
                key={company.name}
                className={cn(
                  "group flex items-center gap-3 px-6 py-3 rounded-full border border-border/30 bg-gradient-to-r backdrop-blur-sm hover:scale-105 transition-all duration-300",
                  company.color
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="text-2xl">{company.logo}</span>
                <span className="font-semibold text-foreground/80">{company.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {successStories.map((story, index) => (
            <div
              key={story.id}
              className={cn(
                "group relative p-8 rounded-2xl border border-border/30 bg-card/20 backdrop-blur-sm hover:bg-card/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-brand/10",
                story.featured && "ring-2 ring-brand/30 lg:scale-105"
              )}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {story.featured && (
                <div className="absolute -top-3 left-6 px-4 py-1 bg-gradient-to-r from-brand to-orange-300 text-black text-sm font-semibold rounded-full">
                  ⭐ Featured Story
                </div>
              )}

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand/20 to-orange-300/20 rounded-full flex items-center justify-center text-2xl border border-brand/20">
                      {story.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{story.name}</h3>
                      <p className="text-sm text-muted-foreground">{story.university}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: story.rating }).map((_, i) => (
                          <IconStar key={i} className="w-4 h-4 fill-brand text-brand" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <IconQuote className="w-6 h-6 text-brand/40" />
                </div>

                <blockquote className="text-foreground/90 mb-6 leading-relaxed italic">
                  "{story.story}"
                </blockquote>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-background/50">
                    <IconBriefcase className="w-5 h-5 text-brand" />
                    <div>
                      <div className="font-semibold">{story.role}</div>
                      <div className="text-sm text-muted-foreground">at {story.company}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-background/50">
                    <IconTrendingUp className="w-5 h-5 text-brand" />
                    <div>
                      <div className="font-semibold">{story.problemsSolved.toLocaleString()} Problems</div>
                      <div className="text-sm text-muted-foreground">Successfully solved</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand/20 via-brand/50 to-brand/20 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-brand/10 to-orange-300/10 border border-brand/20 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4">Ready to Write Your Success Story?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of students who transformed their technical interview skills with Codura
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-brand to-orange-300 hover:from-brand/90 hover:to-orange-300/90 text-black font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-brand/20">
                Start Your Journey
              </button>
              <button className="px-8 py-3 border border-brand/30 hover:border-brand/50 text-foreground hover:bg-brand/10 font-semibold rounded-xl transition-all duration-300">
                View More Stories
              </button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}