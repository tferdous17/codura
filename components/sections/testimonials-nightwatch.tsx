"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Google",
    university: "MIT",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    quote: "Codura's mock interviews and AI feedback helped me land my dream job at Google. The university community aspect kept me motivated throughout my preparation.",
    metric: "8 weeks",
    metricLabel: "to job offer"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Senior Developer",
    company: "Microsoft",
    university: "Stanford",
    image: "https://images.pexels.com/photos/6999225/pexels-photo-6999225.jpeg",
    quote: "The real-time collaboration features are incredible. Being able to code with peers and get instant feedback made all the difference in my interview prep.",
    metric: "95%",
    metricLabel: "success rate"
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Tech Lead",
    company: "Meta",
    university: "UC Berkeley",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
    quote: "The AI code analysis taught me optimization techniques I never learned in class. It's like having a senior engineer review your code 24/7.",
    metric: "250+",
    metricLabel: "problems solved"
  }
];

const companies = [
  { name: "Google", logo: "G", color: "text-red-400" },
  { name: "Microsoft", logo: "M", color: "text-blue-400" },
  { name: "Meta", logo: "f", color: "text-blue-500" },
  { name: "Apple", logo: "🍎", color: "text-white" },
  { name: "Amazon", logo: "A", color: "text-orange-400" },
  { name: "Netflix", logo: "N", color: "text-red-500" }
];

export default function TestimonialsNightwatch({ className }: { className?: string }) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.1 }
    );

    const element = document.getElementById('testimonials-nightwatch');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="testimonials-nightwatch"
      className={cn("py-24 bg-gradient-to-b from-black via-gray-900/50 to-black text-white relative overflow-hidden", className)}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-blue-600/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Trusted by students at{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              top universities
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of successful candidates who transformed their technical interview skills
            and landed positions at leading technology companies.
          </p>
        </div>

        {/* Companies Grid */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <p className="text-gray-400 text-sm uppercase tracking-wide">Students placed at</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center opacity-60">
            {companies.map((company, index) => (
              <div
                key={company.name}
                className={cn(
                  "group cursor-default transition-all duration-300 hover:opacity-100",
                  isVisible && `animate-in fade-in duration-500 delay-${index * 100}`
                )}
              >
                <div className="text-3xl font-bold">
                  <span className={cn("group-hover:scale-110 transition-transform duration-300", company.color)}>
                    {company.logo}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {company.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="relative">
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={cn(
                  "group relative transition-all duration-700",
                  activeTestimonial === index
                    ? "lg:col-span-2 lg:row-span-1"
                    : "opacity-60 hover:opacity-80",
                  isVisible && `animate-in slide-in-from-bottom duration-700 delay-${index * 200}`
                )}
                onClick={() => setActiveTestimonial(index)}
              >
                {activeTestimonial === index ? (
                  // Featured testimonial
                  <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 h-full group-hover:border-purple-500/30 transition-all duration-300">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="relative">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-500/30"
                        />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-white">{testimonial.name}</h3>
                        <p className="text-gray-300">{testimonial.role} at {testimonial.company}</p>
                        <p className="text-gray-400 text-sm">{testimonial.university}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-400">{testimonial.metric}</div>
                        <div className="text-xs text-gray-500">{testimonial.metricLabel}</div>
                      </div>
                    </div>
                    <blockquote className="text-lg text-gray-200 leading-relaxed italic">
                      "{testimonial.quote}"
                    </blockquote>
                  </div>
                ) : (
                  // Compact testimonial
                  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 cursor-pointer group-hover:border-gray-700/50 transition-all duration-300 h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-white">{testimonial.name}</h4>
                        <p className="text-gray-400 text-sm">{testimonial.company}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      "{testimonial.quote.substring(0, 120)}..."
                    </p>
                    <div className="mt-4 text-right">
                      <div className="text-lg font-bold text-purple-400">{testimonial.metric}</div>
                      <div className="text-xs text-gray-500">{testimonial.metricLabel}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  activeTestimonial === index
                    ? "bg-purple-500"
                    : "bg-gray-600 hover:bg-gray-500"
                )}
                onClick={() => setActiveTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}