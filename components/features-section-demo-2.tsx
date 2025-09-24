import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconNotes,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconUsersGroup,
  IconCode,
  IconTerminal2,
  IconLayersIntersect,
  IconUsers,
} from "@tabler/icons-react";

export default function FeaturesSectionDemo() {
  const features = [
    {
      title: "Built for students",
      description:
        "Designed specifically for university students with school-based channels and peer networking.",
      icon: <IconTerminal2 />,
    },
    {
      title: "Ease of use",
      description:
        "Clean, intuitive interface that lets you focus on what matters - practicing and improving.",
      icon: <IconEaseInOut />,
    },
    {
      title: "No paywall",
      description:
        "Core features are completely free. Premium features available at student-friendly rates.",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "Live Code Judge",
      description: "Real-time code evaluation with comprehensive test cases and detailed feedback.",
      icon: <IconCode />,
    },
    {
      title: "Mock Interviews",
      description: "Bidirectional practice - interview others and get interviewed by peers.",
      icon: <IconLayersIntersect />,
    },
    {
      title: "Live Collaboration",
      description:
        "Real-time pair programming with integrated chat and whiteboarding tools.",
      icon: <IconUsers />,
    },
    {
      title: "University Communities",
      description:
        "School-specific channels with leaderboards, competitions, and peer mentorship programs.",
      icon: <IconUsersGroup />,
    },
    {
      title: "Integrated Whiteboarding",
      description: "Visual problem-solving tools with persistent notes and diagrams.",
      icon: <IconNotes />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-16 max-w-7xl mx-auto gap-px bg-border/20 rounded-xl overflow-hidden">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div className="bg-background p-8 relative group/feature hover:bg-muted/10 transition-all duration-300">
      {/* Hover overlay */}
      <div className="opacity-0 group-hover/feature:opacity-100 transition duration-300 absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent pointer-events-none" />

      {/* Icon */}
      <div className="mb-6 relative z-10">
        <div className="w-12 h-12 rounded-lg bg-muted/30 group-hover/feature:bg-brand/10 border border-border/30 group-hover/feature:border-brand/20 flex items-center justify-center text-muted-foreground group-hover/feature:text-brand transition-all duration-300">
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-3">
        <h3 className="text-lg font-semibold text-foreground group-hover/feature:text-foreground transition-colors duration-200">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed group-hover/feature:text-muted-foreground/90 transition-colors duration-200">
          {description}
        </p>
      </div>

      {/* Subtle border indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand/30 to-transparent scale-x-0 group-hover/feature:scale-x-100 transition-transform duration-300 origin-center" />
    </div>
  );
};
