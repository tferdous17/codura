// tferdous17/codura/codura-landing-page-testing/components/navigation/footer.tsx

"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiscord,
  faYoutube,
  faTwitter,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

// Footer link structure
const footerSections = [
  {
    title: "Codura",
    links: [
      { name: "Pricing", href: "#" },
      { name: "Documentation", href: "#" },
      { name: "Contact sales", href: "#" },
    ],
  },
  {
    title: "Explore",
    links: [
      { name: "Live Collaboration", href: "#" },
    ],
  },
  {
    title: "Discover Codura",
    links: [
      { name: "Documentation", href: "#" },
      { name: "Release notes", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Community", href: "#" },
      { name: "Careers", href: "#" },
    ],
  },
];

// SocialIcon component using FontAwesome
const SocialIcon = ({
  icon,
  href,
  label,
}: {
  icon: any;
  href: string;
  label: string;
}) => (
  <Link
    href={href}
    aria-label={label}
    className="text-muted-foreground hover:text-white transition-colors duration-200"
  >
    <FontAwesomeIcon icon={icon} className="w-6 h-6" />
  </Link>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribed!");
  };

  return (
    <footer className="pt-20 pb-8 border-t border-white/5 bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Column 1: Branding, Subscription, and Status */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold">Practice smarter with Codura.</h2>
              <p className="text-xl text-white/90">
                
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex max-w-sm">
              <Input
                type="email"
                placeholder="Email address"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-brand-500 focus-visible:ring-offset-background/10 rounded-r-none"
                required
              />
              <Button
                type="submit"
                className="bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-l-none"
              >
                Stay updated
              </Button>
            </form>

            {/* Social Icons */}
            <div className="flex flex-col space-y-6">
              <div className="flex items-center space-x-4">
                <SocialIcon
                  icon={faGithub}
                  href="https://github.com/codura"
                  label="GitHub"
                />
                <SocialIcon
                  icon={faTwitter}
                  href="https://x.com/codura"
                  label="Twitter/X"
                />
                <SocialIcon
                  icon={faYoutube}
                  href="https://youtube.com/@codura"
                  label="YouTube"
                />
                <SocialIcon
                  icon={faDiscord}
                  href="https://discord.gg/codura"
                  label="Discord"
                />

                {/* Status Badge */}
                <Badge className="bg-green-500/10 text-green-400 hover:bg-green-500/20 text-sm font-medium ml-4 h-6 px-3 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  All systems operational
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold text-white/90">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-sm text-white/50">
          <p>
            &copy; {currentYear} Codura.
            <span className="ml-4">
              <Link href="/legal" className="hover:text-white transition-colors duration-200">
                Legal
              </Link>
            </span>
            <span className="ml-4">
              <Link href="/trust" className="hover:text-white transition-colors duration-200">
                Trust
              </Link>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}