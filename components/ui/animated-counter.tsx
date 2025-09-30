"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedCounter({
  from,
  to,
  duration = 2000,
  suffix = "",
  prefix = "",
  className = ""
}: AnimatedCounterProps) {
  // Add validation for required props
  if (from === undefined || to === undefined) {
    console.error('AnimatedCounter: from and to props are required');
    return <span className={className}>0</span>;
  }

  const [count, setCount] = useState(from);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const startCount = from;
    const endCount = to;
    const difference = endCount - startCount;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(startCount + (difference * easeOutQuart));

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{(count ?? from ?? 0).toLocaleString()}{suffix}
    </span>
  );
}