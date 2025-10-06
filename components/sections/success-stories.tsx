"use client";

import { Section } from "@/components/ui/section";
import { IconQuote, IconStar, IconBriefcase, IconTrendingUp } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const successStories = [
  {
    id: 1,
    name: "Sarah Chen",
    university: "MIT",
    company: "Google",
    role: "Software Engineer",
    avatar: "https://images.pexels.com/photos/5876695/pexels-photo-5876695.jpeg",
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
    avatar: "https://images.pexels.com/photos/6999225/pexels-photo-6999225.jpeg",
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
    avatar: "https://images.pexels.com/photos/6347901/pexels-photo-6347901.jpeg",
    story: "The real-time collaboration and AI hints helped me understand concepts I never could grasp in class. Amazing platform!",
    problemsSolved: 729,
    rating: 5,
    featured: false
  }
];

const companyLogos = [
  { 
    name: "Google", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
  },
  { 
    name: "Microsoft", 
    logo: "/assets/company-logos/Microsoft_logo.svg"
  },
  { 
    name: "Meta", 
    logo: "/assets/company-logos/Meta_logo.svg"
  },
  { 
    name: "Apple", 
    logo: "/assets/company-logos/Apple_logo.svg"
  },
  { 
    name: "Amazon", 
    logo: "/assets/company-logos/Amazon_logo.svg"
  },
  { 
    name: "Netflix", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
  }
];

export default function SuccessStories() {
  return (
    <Section id="success-stories" className="py-20 relative overflow-hidden">
      {/* Glassmorphism glow effects matching hero elevated */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[540px] h-[540px] bg-brand/8 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-[480px] h-[480px] bg-brand-foreground/8 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '6s' }} />
      </div>

      {/* Sophisticated background elements */}
      <div className="absolute inset-0 opacity-30">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Floating geometric shapes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-32 h-32 bg-gradient-to-br from-brand/5 to-orange-300/5 rounded-full blur-xl animate-float"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${20 + i * 3}s`
            }}
          />
        ))}
        
        {/* Professional radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,224,194,0.03)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
           <Badge className="mb-6 bg-brand/10 border-brand/20 text-brand hover:bg-brand/20 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
              Success Stories
            </div>
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-brand bg-clip-text text-transparent">
            Success Stories
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Real students, real results. See how Codura transformed their technical interview journey and launched careers at top companies.
          </p>
        </div>

        {/* Professional Company Logos Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Trusted by students now working at
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-brand to-transparent mx-auto" />
          </div>
          
          <div className="relative w-full overflow-hidden">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          {/* Infinite scrolling container */}
          <div className="flex animate-scroll hover:pause-animation">
            {/* First set of logos */}
            {companyLogos.map((company, index) => (
              <div
                key={`${company.name}-1`}
                className="group relative flex-shrink-0 mx-4"
              >
                {/* Glassmorphic card */}
                <div className="relative w-40 h-32 rounded-2xl border-2 border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl transition-all duration-500 hover:scale-110 hover:border-brand/50 hover:shadow-2xl hover:shadow-brand/25 overflow-hidden cursor-pointer">
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center p-6 gap-3">
                    <div className="w-20 h-20 flex items-center justify-center">
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="max-w-full max-h-full object-contain filter brightness-110 group-hover:brightness-125 group-hover:scale-110 transition-all duration-500"
                      />
                    </div>
                    <span className="font-semibold text-xs text-foreground/70 group-hover:text-foreground transition-colors text-center">
                      {company.name}
                    </span>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {companyLogos.map((company, index) => (
              <div
                key={`${company.name}-2`}
                className="group relative flex-shrink-0 mx-4"
              >
                <div className="relative w-40 h-32 rounded-2xl border-2 border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl transition-all duration-500 hover:scale-110 hover:border-brand/50 hover:shadow-2xl hover:shadow-brand/25 overflow-hidden cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                  </div>

                  <div className="relative h-full flex flex-col items-center justify-center p-6 gap-3">
                    <div className="w-20 h-20 flex items-center justify-center">
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="max-w-full max-h-full object-contain filter brightness-110 group-hover:brightness-125 group-hover:scale-110 transition-all duration-500"
                      />
                    </div>
                    <span className="font-semibold text-xs text-foreground/70 group-hover:text-foreground transition-colors text-center">
                      {company.name}
                    </span>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>

        {/* Enhanced Success Stories Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {successStories.map((story, index) => (
            <div
              key={story.id}
              className={cn(
                "group relative p-8 rounded-2xl border border-border/20 bg-card/30 backdrop-blur-md hover:bg-card/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand/10",
                story.featured && "ring-1 ring-brand/30 lg:scale-105 shadow-xl shadow-brand/5"
              )}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {story.featured && (
                <div className="absolute -top-4 left-6 px-4 py-2 bg-gradient-to-r from-brand to-orange-300 text-black text-sm font-bold rounded-full shadow-lg">
                  <span className="mr-1">⭐</span>
                  Featured Success
                </div>
              )}

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/5 via-transparent to-orange-300/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-18 h-18 bg-gradient-to-br from-brand/20 to-orange-300/20 rounded-2xl flex items-center justify-center text-2xl border border-brand/20 overflow-hidden shadow-lg">
                      <img
                        src={story.avatar}
                        alt={story.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{story.name}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{story.university}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {Array.from({ length: story.rating }).map((_, i) => (
                          <IconStar key={i} className="w-4 h-4 fill-brand text-brand" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <IconQuote className="w-7 h-7 text-brand/30" />
                </div>

                <blockquote className="text-foreground/90 mb-8 leading-relaxed font-medium">
                  "{story.story}"
                </blockquote>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 px-5 py-4 rounded-xl bg-background/60 border border-border/30">
                    <IconBriefcase className="w-5 h-5 text-brand" />
                    <div>
                      <div className="font-semibold text-foreground">{story.role}</div>
                      <div className="text-sm text-muted-foreground">at {story.company}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 px-5 py-4 rounded-xl bg-background/60 border border-border/30">
                    <IconTrendingUp className="w-5 h-5 text-brand" />
                    <div>
                      <div className="font-semibold text-foreground">{story.problemsSolved.toLocaleString()} Problems</div>
                      <div className="text-sm text-muted-foreground">Successfully solved</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand to-transparent rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}