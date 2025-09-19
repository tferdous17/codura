"use client"

import React from "react";
import Hero from "@/components/sections/hero/default";
import FeaturesSectionDemo from "@/components/features-section-demo-2";

export default function LandingPage() {
  return (
    <>
      <Hero/>
      <div className="pt-35 pb-20 flex flex-col items-center justify-center gap-16">
        <div className="flex flex-col items-center justify-center w-[50%] text-center">
          <h1 className="text-5xl p-4">Packed with a multitude of features</h1>
          <h2 className="text-xl text-muted-foreground">From mock interviews to real-time collaboration, we have everything you need to prepare yourself the best for a technical interview.</h2>
        </div>
        <FeaturesSectionDemo/>
      </div>
    </>
  );
}