"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import CoduraLogo from "../logos/codura-logo.svg";


export default function NavbarNightwatch() {
  const [showBorder, setShowBorder] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const evaluateScrollPosition = () => {
      setShowBorder(window.pageYOffset >= 24);
    };

    window.addEventListener("scroll", evaluateScrollPosition);
    evaluateScrollPosition();

    return () => window.removeEventListener("scroll", evaluateScrollPosition);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[60] border-b border-b-transparent bg-gradient-to-b shadow-none backdrop-blur-none transition-all duration-1000",
        showBorder && !navOpen
          ? "border-b-white/10 shadow-[0_4px_60px_0_rgba(0,0,0,0.90)] backdrop-blur-md from-neutral-950/80 to-neutral-950/50"
          : navOpen
          ? "backdrop-blur-md opacity-100"
          : ""
      )}
    >

      <div className="flex items-center justify-start py-4 container"> 
        
  
        <div className="flex items-center mx-auto"> 

          {/* LOGO */}
          <a href="/" aria-label="Codura homepage" className="flex items-center group">
            <Image
              src={CoduraLogo}
              alt="Codura logo"
              width={90}
              height={40}
              priority
              className="transition-all duration-200 group-hover:opacity-80"
            />
          </a>
          
          <nav className="hidden items-center gap-6 text-lg leading-7 font-light -tracking-[0.32px] text-neutral-400 lg:flex ml-12">
            <a className="hover:text-neutral-200" href="/pricing">
              Pricing
            </a>
            <a className="hover:text-neutral-200" href="/docs">
              Documentation
            </a>
            <a className="hover:text-neutral-200" href="/contact">
              Enterprise
            </a>
          </nav>
        </div>
        
        <div className="flex items-center gap-4 absolute inset-y-0 right-0 pr-4 lg:relative lg:ml-auto lg:pr-0">
          <div className="hidden space-x-2 md:block">
            <a
              href="/sign-in"
              className="ring-offset-background focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center rounded-[5px] border whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-px disabled:pointer-events-none disabled:opacity-50 border border-white/5 bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-neutral-200 h-8 gap-2 px-3 text-sm leading-tight nav-links"
            >
              Sign in
            </a>
            <a
              href="/sign-up"
              className="ring-offset-background focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center rounded-[5px] border whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-px disabled:pointer-events-none disabled:opacity-50 border-blue-500 bg-blue-600 text-blue-100 hover:bg-blue-600/90 active:bg-blue-700 h-8 gap-2 px-3 text-sm leading-tight nav-links"
            >
              Start for free
            </a>
          </div>

          <button
            onClick={() => setNavOpen(!navOpen)}
            className="focus-visible:shadow-xs-selected relative size-8 rounded-lg text-white focus:outline-hidden lg:hidden"
          >
            <div className="relative flex h-6 w-6 items-center justify-center">
              <span
                className={cn(
                  "absolute top-[11px] left-1.5 block h-0.5 w-5 rounded-full bg-white transition-transform duration-300",
                  navOpen && "rotate-45 translate-y-1"
                )}
              ></span>
              <span
                className={cn(
                  "absolute top-[19px] left-1.5 block h-0.5 w-5 rounded-full bg-white transition-transform duration-300",
                  navOpen && "-rotate-45 -translate-y-1"
                )}
              ></span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}