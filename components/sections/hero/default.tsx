import { ArrowRightIcon } from "lucide-react";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Badge } from "../../ui/badge";
import { Button, type ButtonProps } from "../../ui/button";
import Glow from "../../ui/glow";
import { Mockup, MockupFrame } from "../../ui/mockup";
import Screenshot from "../../ui/screenshot";
import { Section } from "../../ui/section";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";


interface HeroButtonProps {
  href: string;
  text: string;
  variant?: ButtonProps["variant"];
  icon?: ReactNode;
  iconRight?: ReactNode;
}

interface HeroProps {
  title?: string;
  description?: string;
  mockup?: ReactNode | false;
  badge?: ReactNode | false;
  buttons?: HeroButtonProps[] | false;
  className?: string;
}

export default function Hero({
  title = "Your all-in-one platform for technical interview prep.",
  description = "Prepare smarter for technical interviews with our community-driven and AI-powered platform, complete with mock interviews and problem solving.",
  mockup = (
    <Screenshot
      srcLight=""
      srcDark=""
      alt="codura screenshot"
      width={1248}
      height={765}
      className="w-full"
    />
  ),
  badge = (
    <Badge variant="outline" className="animate-appear">
      <span className="text-muted-foreground">
        Join over 0 students on their journey!
      </span>
      <a href="https://www.launchuicomponents.com/" className="flex items-center gap-1">
        Get started
        <ArrowRightIcon className="size-3" />
      </a>
    </Badge>
  ),
  className,
}: HeroProps) {

    const people = [
    {
      id: 1,
      name: "John Doe",
      designation: "Student @ FSC",
      image:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
    },
    {
      id: 2,
      name: "Robert Johnson",
      designation: "Newgrad SWE",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 3,
      name: "Jane Smith",
      designation: "Student @ SBU",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 4,
      name: "Emily Davis",
      designation: "Student @ NYU",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 5,
      name: "Tyler Durden",
      designation: "Grad Student",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
    },
    {
      id: 6,
      name: "Dora",
      designation: "Data Scientist",
      image:
        "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
    },
  ];

  return (
    <>
      <Section
        className={cn(
          "fade-bottom overflow-hidden pb-0 sm:pb-0 md:pb-0",
          className,
        )}
      >
        <div className="max-w-container mx-auto flex flex-col gap-12 pt-16 sm:gap-24">
          <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
            <div className="flex flex-row items-center justify-center mb-[-25px] w-full">
              <AnimatedTooltip items={people} />
            </div>
            {badge !== false && badge}
            <h1 className="animate-appear from-foreground to-foreground dark:to-muted-foreground relative z-10 inline-block bg-linear-to-r bg-clip-text text-4xl leading-tight font-semibold text-balance text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-7xl md:leading-tight">
              {title}
            </h1>
            <p className="text-md animate-appear text-muted-foreground relative z-10 max-w-[740px] font-medium text-balance opacity-0 delay-100 sm:text-xl">
              {description}
            </p>
            <button className="cursor-pointer px-8 py-2 z-10 rounded-full bg-gradient-to-b from-orange-200 to-orange-300 text-black font-medium focus:ring-1 transition duration-200">
              Get started
            </button>
            {mockup !== false && (
              <div className="relative w-full pt-12">
                <MockupFrame
                  className="animate-appear opacity-0 delay-700"
                  size="small"
                >
                  <Mockup
                    type="responsive"
                    className="bg-background/90 w-full rounded-xl border-0"
                  >
                    {mockup}
                  </Mockup>
                </MockupFrame>
                <Glow
                  variant="top"
                  className="animate-appear-zoom opacity-0 delay-1000"
                />
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
