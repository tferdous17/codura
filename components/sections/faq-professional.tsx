"use client";

import { useState } from "react";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    id: 1,
    question: "How does Codura differ from other coding platforms?",
    answer: "Codura focuses specifically on university communities with school-specific channels, live peer collaboration, and bidirectional mock interviews. Unlike platforms like LeetCode, we emphasize social learning and real-time interaction with your academic peers."
  },
  {
    id: 2,
    question: "Is Codura free for students?",
    answer: "Yes, Codura's core features are completely free for university students. We believe in accessible education and removing barriers to technical interview preparation. Premium features for advanced analytics and personalized coaching are available at student-friendly rates."
  },
  {
    id: 3,
    question: "How do university channels work?",
    answer: "Each university has a dedicated channel where students can compete on school-specific leaderboards, form study groups, and connect with peers. Universities can track their collective performance and participate in inter-school competitions."
  },
  {
    id: 4,
    question: "Can I practice with students from other universities?",
    answer: "Absolutely. While university channels provide focused peer groups, you can collaborate and compete with students from all participating universities. This gives you exposure to diverse problem-solving approaches and broader networking opportunities."
  },
  {
    id: 5,
    question: "What programming languages are supported?",
    answer: "Our online judge supports Java, Python, JavaScript, and C++. We're continuously adding more languages based on industry demand and student requests. All solutions are automatically evaluated with comprehensive test cases."
  },
  {
    id: 6,
    question: "How do mock interviews work?",
    answer: "Students can practice as both interviewers and interviewees. You can invite friends through custom links or be matched with peers based on skill level. Interviews include both behavioral and technical components, with real-time collaboration tools and AI-powered feedback."
  },
  {
    id: 7,
    question: "What kind of problems are available?",
    answer: "We offer a comprehensive range from basic data structures to complex system design scenarios. Problems are categorized by difficulty and topic, with curated lists including Blind 75, Neetcode 150, and Grind 75. Our AI recommends problems based on your learning path."
  },
  {
    id: 8,
    question: "How does the AI assistance work?",
    answer: "Our AI provides real-time feedback on your thought process, offers personalized hints when you're stuck, and suggests optimal learning paths. It doesn't give away solutions but guides you toward understanding concepts and developing problem-solving strategies."
  }
];

export default function FAQProfessional() {
  const [openItems, setOpenItems] = useState<number[]>([1]);

  const toggleItem = (id: number) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <Section id="faq" className="py-20 relative overflow-hidden">
      {/* Glassmorphism glow effects matching hero elevated */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-[520px] h-[520px] bg-brand/9 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '3.5s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-[470px] h-[470px] bg-brand-foreground/9 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '6.5s' }} />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Updated Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge className="mb-6 bg-brand/10 border-brand/20 text-brand hover:bg-brand/20 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
              FAQs
            </div>
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-brand bg-clip-text text-transparent leading-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about Codura and technical interview preparation.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border border-border/40 rounded-lg bg-card/50 backdrop-blur-sm overflow-hidden"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="cursor-pointer w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/20 transition-colors duration-200"
              >
                <span className="font-semibold text-lg pr-8">{faq.question}</span>
                <div className={cn(
                  "w-6 h-6 flex items-center justify-center rounded-full bg-muted/50 transition-transform duration-200",
                  openItems.includes(faq.id) && "rotate-45"
                )}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </button>

              <div className={cn(
                "overflow-hidden transition-all duration-300",
                openItems.includes(faq.id) ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="px-6 pb-4 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
