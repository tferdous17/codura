"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { ModeToggle } from "@/components/ui/mode-toggle"
import { SignUpForm } from "@/components/signup-form"
import CoduraLogo from "@/components/logos/codura-logo.svg";
import CoduraLogoDark from "@/components/logos/codura-logo-dark.svg";

export default function SignUpPage() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      theme === "light" 
        ? "bg-gradient-to-br from-gray-50 to-gray-100" 
        : "bg-zinc-950"
    }`}>
      {/* Background Effects - Matching Landing Page */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" />
        
        {theme === "light" ? (
          // Light mode background effects
          <>
            <div 
              className="absolute top-[-200px] left-[60%] w-[120vw] h-[120vh] -translate-x-1/2 animate-pulse-slow opacity-20 bg-gradient-to-br from-gray-100/30 to-gray-200/30 rounded-full blur-3xl" 
            />
            <div 
              className="absolute bottom-[10%] right-[70%] w-[80vw] h-[80vh] animate-float-slow bg-gradient-to-br from-gray-200/20 to-gray-300/20 rounded-full blur-3xl"
              style={{ animationDelay: '10s', animationDuration: '30s' }}
            />
          </>
        ) : (
          // Dark mode background effects - matching landing page
          <>
            <div 
              className="absolute top-[-200px] left-[60%] w-[120vw] h-[120vh] -translate-x-1/2 animate-pulse-slow opacity-70" 
            />
            <div 
              className="absolute bottom-[10%] right-[70%] w-[80vw] h-[80vh] animate-float-slow"
              style={{ animationDelay: '10s', animationDuration: '30s' }}
            />
          </>
        )}
      </div>

      {/* Header with Logo and Theme Toggle */}
      <div className="relative z-10 flex justify-between items-center p-6">
        <a href="/" className="group">
          <Image
            src={theme === "light" ? CoduraLogoDark : CoduraLogo}
            alt="Codura logo"
            width={120}
            height={48}
            priority
            className="transition-all duration-200 group-hover:opacity-80"
          />
        </a>
        <ModeToggle />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="w-full max-w-md">
          <SignUpForm />
        </div>
      </div>
    </div>
  )
}