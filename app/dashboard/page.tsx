"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import CoduraLogo from "@/components/logos/codura-logo.svg";
import { cn } from "@/lib/utils";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Video,
  Users,
  Clock,
  Code,
  Trophy,
  Target,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  X,
  Plus,
  MoreVertical,
  User,
  Settings,
  LogOut,
  ChevronDown,
  BarChart3
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"; // Ensure this file exists or update the path to the correct location
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock user data
const mockUserData = {
  name: "Abdullah Khan",
  email: "abdullah@codura.com",
  avatar: "AK",
  streak: 7,
  problemsSolved: 47,
  easy: 23,
  medium: 18,
  hard: 6
};

// Chart data for activity
const activityChartData = [
  { month: "Apr", problems: 12 },
  { month: "May", problems: 25 },
  { month: "Jun", problems: 18 },
  { month: "Jul", problems: 32 },
  { month: "Aug", problems: 28 },
  { month: "Sep", problems: 35 },
  { month: "Oct", problems: 47 },
];

const chartConfig = {
  problems: {
    label: "Problems Solved",
    color: "var(--brand)",
  },
} satisfies ChartConfig;

// Study plans with better structure
const studyPlans = [
  { id: 1, name: "Blind 75", total: 75, completed: 32, color: "from-brand to-orange-300" },
  { id: 2, name: "NeetCode 150", total: 150, completed: 47, color: "from-purple-500 to-pink-500" },
  { id: 3, name: "Grind 75", total: 75, completed: 18, color: "from-blue-500 to-cyan-500" },
];

// Recent activity
const recentActivity = [
  { id: 1, type: "problem", title: "Two Sum", difficulty: "Easy", time: "2 hours ago" },
  { id: 2, type: "problem", title: "Valid Parentheses", difficulty: "Easy", time: "5 hours ago" },
  { id: 3, type: "interview", title: "Mock Interview with Sarah M.", time: "1 day ago" },
  { id: 4, type: "study", title: "Study Pod: Dynamic Programming", time: "2 days ago" }
];

// Upcoming events
const upcomingEvents = [
  { id: 1, type: "mock", title: "Mock Interview", date: "Oct 7", time: "2:00 PM" },
  { id: 2, type: "study", title: "Study Pod: DP", date: "Oct 8", time: "6:00 PM" },
  { id: 3, type: "contest", title: "Weekly Contest", date: "Oct 9", time: "10:30 AM" }
];

// Daily challenge
const dailyChallenge = {
  title: "Longest Substring Without Repeating Characters",
  difficulty: "Medium",
  topics: ["Hash Table", "String", "Sliding Window"]
};

// Activity data for specific days
const activityDetails: Record<number, { problems: string[], interviews?: string[], studyPods?: string[] }> = {
  1: { problems: ["Two Sum", "Reverse Linked List"] },
  2: { problems: ["Valid Parentheses"], interviews: ["Mock with John D."] },
  3: { problems: ["Merge Intervals", "LRU Cache"] },
  4: { problems: ["Binary Tree Inorder"] },
  5: { problems: ["Clone Graph"], studyPods: ["Arrays & Hashing"] },
  6: { problems: ["Product of Array Except Self", "Valid Anagram", "Contains Duplicate"] },
  8: { problems: ["Group Anagrams"] },
  10: { problems: ["Top K Frequent"], interviews: ["Mock with Sarah M."] },
  12: { problems: ["Encode and Decode Strings"] },
  15: { problems: ["Longest Consecutive Sequence", "Two Sum II"] },
  18: { problems: ["3Sum"], studyPods: ["Two Pointers"] },
  20: { problems: ["Container With Most Water"] },
  22: { problems: ["Trapping Rain Water", "Find Min in Rotated"] },
  25: { problems: ["Search in Rotated Sorted Array"] },
  28: { problems: ["Reorder List", "Remove Nth Node"] },
  30: { problems: ["Copy List with Random Pointer"] }
};

// Interactive Calendar component
function Calendar({ streak }: { streak: number }) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 6));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const activityDays = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const handleDayClick = (day: number) => {
    if (activityDays.includes(day)) {
      setSelectedDay(selectedDay === day ? null : day);
    }
  };

  const selectedDayActivity = selectedDay ? activityDetails[selectedDay] : null;

  return (
    <Card className="relative border-2 border-border/20 bg-gradient-to-br from-card/50 via-card/30 to-transparent backdrop-blur-xl overflow-hidden group hover:border-brand/30 transition-all duration-500 shadow-xl">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Activity Calendar</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="text-brand font-semibold">{streak} day</span> streak 🔥
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-brand/10" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-2 min-w-[120px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-brand/10" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-center text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {blanks.map((blank) => (
            <div key={`blank-${blank}`} className="aspect-square" />
          ))}
          {days.map((day) => {
            const isToday = day === 6;
            const hasActivity = activityDays.includes(day);
            const isSelected = selectedDay === day;
            const isHovered = hoveredDay === day;

            return (
              <div
                key={day}
                onClick={() => handleDayClick(day)}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                className={cn(
                  "relative aspect-square flex items-center justify-center text-sm rounded-lg transition-all duration-300 cursor-pointer",
                  isToday && "bg-brand text-white font-semibold shadow-lg shadow-brand/30",
                  !isToday && hasActivity && !isSelected && "bg-green-500/20 text-green-600 hover:bg-green-500/40",
                  !isToday && !hasActivity && "hover:bg-muted/50",
                  isSelected && "bg-brand/20 ring-2 ring-brand text-brand font-semibold",
                  hasActivity && "hover:scale-110"
                )}
              >
                {day}
                {hasActivity && (isHovered || isSelected) && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-brand/30 to-purple-500/30 animate-pulse" />
                )}
                {hasActivity && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />
                )}
              </div>
            );
          })}
        </div>

        {/* Activity Details Panel */}
        {selectedDayActivity && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-background/60 to-background/40 border border-brand/30 animate-appear">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm">Activity on Oct {selectedDay}</h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setSelectedDay(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              {selectedDayActivity.problems && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                    <Code className="w-3 h-3" />
                    Problems Solved
                  </p>
                  {selectedDayActivity.problems.map((prob, i) => (
                    <div key={i} className="text-sm pl-4 py-1 text-foreground">• {prob}</div>
                  ))}
                </div>
              )}
              {selectedDayActivity.interviews && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    Mock Interviews
                  </p>
                  {selectedDayActivity.interviews.map((interview, i) => (
                    <div key={i} className="text-sm pl-4 py-1 text-foreground">• {interview}</div>
                  ))}
                </div>
              )}
              {selectedDayActivity.studyPods && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Study Pods
                  </p>
                  {selectedDayActivity.studyPods.map((pod, i) => (
                    <div key={i} className="text-sm pl-4 py-1 text-foreground">• {pod}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-green-500/20" />
            <span>Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-brand" />
            <span>Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const user = mockUserData;
  const [showBorder, setShowBorder] = useState(false);

  React.useEffect(() => {
    const evaluateScrollPosition = () => {
      setShowBorder(window.pageYOffset >= 24);
    };
    window.addEventListener("scroll", evaluateScrollPosition);
    evaluateScrollPosition();
    return () => window.removeEventListener("scroll", evaluateScrollPosition);
  }, []);

  return (
    <div className="caffeine-theme min-h-screen bg-zinc-950 relative">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-zinc-950" />

        {/* Floating orbs */}
        <div
          className="absolute top-[-10%] right-[20%] w-[500px] h-[500px] bg-brand/8 rounded-full blur-[100px] animate-pulse-slow"
        />
        <div
          className="absolute bottom-[10%] left-[15%] w-[400px] h-[400px] bg-purple-500/6 rounded-full blur-[80px] animate-float-slow"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute top-[40%] right-[60%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[70px] animate-float"
          style={{ animationDelay: '4s' }}
        />

        {/* Beam lines */}
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-brand/30 to-transparent animate-pulse"
              style={{
                left: `${15 + i * 14}%`,
                height: '100%',
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${2 + i * 0.3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Navbar matching landing page */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b border-b-transparent bg-gradient-to-b shadow-none backdrop-blur-none transition-all duration-500",
          showBorder
            ? "border-b-white/10 shadow-[0_4px_60px_0_rgba(0,0,0,0.90)] backdrop-blur-md from-neutral-950/80 to-neutral-950/50"
            : ""
        )}
      >
        <div className="flex items-center justify-between py-4 max-w-7xl mx-auto px-6">
          <Link href="/" aria-label="Codura homepage" className="flex items-center group">
            <Image
              src={CoduraLogo}
              alt="Codura logo"
              width={90}
              height={40}
              priority
              className="transition-all duration-200 group-hover:opacity-80"
            />
          </Link>

          <nav className="hidden items-center gap-6 text-base leading-7 font-light text-neutral-400 lg:flex">
            <Link className="hover:text-neutral-200 transition-colors" href="/problems">
              Problems
            </Link>
            <Link className="hover:text-neutral-200 transition-colors" href="/mock-interview">
              Interview
            </Link>
            <Link className="hover:text-neutral-200 transition-colors" href="/study-pods">
              Study Pods
            </Link>
            <Link className="hover:text-neutral-200 transition-colors" href="/leaderboards">
              Leaderboards
            </Link>
            <Link className="hover:text-neutral-200 transition-colors" href="/discuss">
              Discuss
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-white/5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-orange-300 flex items-center justify-center text-white font-semibold text-sm">
                    {user.avatar}
                  </div>
                  <span className="hidden sm:inline text-sm text-neutral-400">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="h-4 w-4 text-neutral-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-border/40">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground via-foreground to-brand bg-clip-text text-transparent">
            Welcome to Codura
          </h1>
          <p className="text-lg text-muted-foreground">
            Continue your interview preparation journey
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Daily Challenge - Featured */}
          <Card className="lg:col-span-2 relative border-2 border-brand/20 bg-gradient-to-br from-card/50 via-card/30 to-transparent backdrop-blur-xl overflow-hidden group hover:border-brand/40 hover:shadow-2xl hover:shadow-brand/10 transition-all duration-500 shadow-xl hover:scale-[1.01]">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">Daily Challenge</CardTitle>
                    <p className="text-sm text-muted-foreground">Earn bonus points</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-yellow-500/30 text-yellow-600">
                  {dailyChallenge.difficulty}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <h3 className="font-semibold text-xl mb-3 group-hover:text-brand transition-colors">{dailyChallenge.title}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {dailyChallenge.topics.map((topic, i) => (
                  <Badge key={i} variant="outline" className="bg-muted/50 hover:bg-brand/10 transition-colors">
                    {topic}
                  </Badge>
                ))}
              </div>
              <Button className="bg-gradient-to-r from-brand to-orange-300 hover:from-brand/90 hover:to-orange-300/90 text-white hover:scale-105 transition-transform">
                Start Challenge
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="relative border-2 border-border/20 bg-gradient-to-br from-card/50 via-card/30 to-transparent backdrop-blur-xl overflow-hidden group hover:border-purple-500/30 transition-all duration-500 shadow-xl">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-500" />
                Your Progress
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Solved</span>
                <span className="text-2xl font-bold">{user.problemsSolved}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600">Easy</span>
                  <span className="font-semibold">{user.easy}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-yellow-600">Medium</span>
                  <span className="font-semibold">{user.medium}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-600">Hard</span>
                  <span className="font-semibold">{user.hard}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Streak</span>
                  <span className="text-xl font-bold text-brand">{user.streak} days 🔥</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activity Chart */}
            <Card className="relative border-2 border-border/20 bg-gradient-to-br from-card/50 via-card/30 to-transparent backdrop-blur-xl overflow-hidden group hover:border-cyan-500/30 transition-all duration-500 shadow-xl hover:scale-[1.01]">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-500" />
                  Problem Solving Activity
                </CardTitle>
                <CardDescription>
                  Your progress over the last 7 months
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ChartContainer config={chartConfig}>
                  <AreaChart
                    accessibilityLayer
                    data={activityChartData}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fill: 'var(--muted-foreground)' }}
                    />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <defs>
                      <linearGradient id="fillProblems" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--brand)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--brand)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      dataKey="problems"
                      type="natural"
                      fill="url(#fillProblems)"
                      fillOpacity={0.4}
                      stroke="var(--brand)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>

              <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 leading-none font-medium text-brand">
                      Trending up by 34% this month <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 leading-none">
                      April - October 2025
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>

            {/* Recent Activity */}
            <Card className="relative border-2 border-border/20 bg-gradient-to-br from-card/50 via-card/30 to-transparent backdrop-blur-xl overflow-hidden group hover:border-green-500/30 transition-all duration-500 shadow-xl hover:scale-[1.01]">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />

              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border/40 hover:bg-muted/50 hover:border-brand/30 transition-all cursor-pointer hover:scale-[1.02]"
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center transition-transform hover:scale-110",
                        activity.type === 'problem' && "bg-green-500/10 text-green-600",
                        activity.type === 'interview' && "bg-purple-500/10 text-purple-600",
                        activity.type === 'study' && "bg-blue-500/10 text-blue-600"
                      )}>
                        {activity.type === 'problem' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : activity.type === 'interview' ? (
                          <Video className="w-5 h-5" />
                        ) : (
                          <Users className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      {activity.difficulty && (
                        <Badge variant="outline" className="text-xs">
                          {activity.difficulty}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="relative border-2 border-border/20 bg-gradient-to-br from-card/50 via-card/30 to-transparent backdrop-blur-xl overflow-hidden group hover:border-blue-500/30 transition-all duration-500 shadow-xl">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-blue-500" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          event.type === 'mock' && "bg-purple-500/10 text-purple-600",
                          event.type === 'study' && "bg-blue-500/10 text-blue-600",
                          event.type === 'contest' && "bg-green-500/10 text-green-600"
                        )}>
                          {event.type === 'mock' ? (
                            <Video className="w-5 h-5" />
                          ) : event.type === 'study' ? (
                            <Users className="w-5 h-5" />
                          ) : (
                            <Trophy className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.date} • {event.time}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Join</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Calendar streak={user.streak} />

            {/* Study Plan Progress */}
            <Card className="relative border-2 border-border/20 bg-gradient-to-br from-card/50 via-card/30 to-transparent backdrop-blur-xl overflow-hidden group hover:border-green-500/30 transition-all duration-500 shadow-xl hover:scale-[1.01]">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />

              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-500" />
                    Study Plans
                  </CardTitle>
                  <Button size="sm" variant="ghost" className="h-8 gap-1 hover:bg-brand/10 hover:text-brand">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Create</span>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {studyPlans.map((plan) => {
                  const percentage = Math.round((plan.completed / plan.total) * 100);
                  return (
                    <div key={plan.id} className="group/plan">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{plan.name}</span>
                          <Badge variant="outline" className="text-xs h-5">
                            {percentage}%
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{plan.completed}/{plan.total}</span>
                          <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover/plan:opacity-100 transition-opacity">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="relative w-full bg-muted/30 rounded-full h-2.5 overflow-hidden group-hover/plan:h-3 transition-all">
                        <div
                          className={`bg-gradient-to-r ${plan.color} h-full rounded-full transition-all duration-500 relative`}
                          style={{ width: `${percentage}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                        </div>
                      </div>
                    </div>
                  );
                })}

                <Button variant="outline" size="sm" className="w-full mt-4 border-brand/30 hover:bg-brand/10 hover:border-brand/50">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Custom Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}