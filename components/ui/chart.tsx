"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  type?: "bar" | "line" | "donut";
  className?: string;
  showGrid?: boolean;
  animated?: boolean;
}

export function Chart({ data, type = "bar", className, showGrid = true, animated = true }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (canvasRef.current) {
      observer.observe(canvasRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;
    const padding = 40;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (type === "bar") {
      drawBarChart(ctx, data, width, height, padding, showGrid, animated);
    } else if (type === "line") {
      drawLineChart(ctx, data, width, height, padding, showGrid, animated);
    } else if (type === "donut") {
      drawDonutChart(ctx, data, width, height, animated);
    }
  }, [data, type, showGrid, animated, isVisible]);

  const drawBarChart = (
    ctx: CanvasRenderingContext2D,
    chartData: Array<{ label: string; value: number; color?: string }>,
    width: number,
    height: number,
    padding: number,
    grid: boolean,
    animate: boolean
  ) => {
    const maxValue = Math.max(...chartData.map(d => d.value));
    const barWidth = (width - padding * 2) / chartData.length - 10;
    const barHeight = height - padding * 2;

    // Grid lines
    if (grid) {
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padding + (barHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      }
    }

    // Bars
    chartData.forEach((item, index) => {
      const barHeightValue = animate ? (item.value / maxValue) * barHeight : barHeight;
      const x = padding + index * (barWidth + 10);
      const y = height - padding - barHeightValue;

      ctx.fillStyle = item.color || "#3b82f6";
      ctx.fillRect(x, y, barWidth, barHeightValue);

      // Labels
      ctx.fillStyle = "#6b7280";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(item.label, x + barWidth / 2, height - padding + 20);
    });
  };

  const drawLineChart = (
    ctx: CanvasRenderingContext2D,
    chartData: Array<{ label: string; value: number; color?: string }>,
    width: number,
    height: number,
    padding: number,
    grid: boolean,
    animate: boolean
  ) => {
    const maxValue = Math.max(...chartData.map(d => d.value));
    const stepX = (width - padding * 2) / (chartData.length - 1);
    const chartHeight = height - padding * 2;

    // Grid lines
    if (grid) {
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      }
    }

    // Line
    ctx.strokeStyle = chartData[0]?.color || "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();

    chartData.forEach((item, index) => {
      const x = padding + index * stepX;
      const y = height - padding - (item.value / maxValue) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Points
      ctx.fillStyle = item.color || "#3b82f6";
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.stroke();
  };

  const drawDonutChart = (
    ctx: CanvasRenderingContext2D,
    chartData: Array<{ label: string; value: number; color?: string }>,
    width: number,
    height: number,
    animate: boolean
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    const innerRadius = radius * 0.6;

    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -Math.PI / 2;

    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

    chartData.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;

      ctx.fillStyle = item.color || colors[index % colors.length];
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      ctx.fill();

      currentAngle += sliceAngle;
    });

    // Center text
    ctx.fillStyle = "#374151";
    ctx.font = "24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(total.toString(), centerX, centerY + 8);
  };

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full", className)}
      style={{ width: "100%", height: "100%" }}
    />
  );
}