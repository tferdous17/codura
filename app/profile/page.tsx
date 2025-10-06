"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import CoduraLogo from "@/components/logos/codura-logo.svg";
import { cn } from "@/lib/utils";
import {
  Trophy,
  Calendar,
  Code,
  Video,
  Users,
  Award,
  Flame,
  Star,
  TrendingUp,
  Settings,
  Share2,
  MapPin,
  Briefcase,
  GraduationCap,
  Github,
  Linkedin,
  Globe,
  CheckCircle2
} from "lucide-react";

// Mock user profile data
const userProfile = {
  name: "Abdullah Khan",
  username: "abdkhan",
  email: "abdullah@codura.com",
  avatar: "AK",
  bio: "Senior CS Student @ FSC | Aspiring Software Engineer | Passionate about algorithms and system design",
  university: "Farmingdale State College",
  graduationYear: "2027",
  location: "New York, USA",
  jobTitle: "Student",
  website: "https://abdkhan-dev.netlify.app",
  github: "abdkhan-git",
  linkedin: "abdullah-khan",
  totalSolved: 47,
  easy: 23,
  medium: 18,
  hard: 6,
  streak: 7,
  longestStreak: 14,
  rank: 12,
  points: 2847,
  contestRating: 1456,
  acceptanceRate: 78.5,
};

// GitHub-style contribution data (52 weeks)
const generateContributionData = () => {
  const weeks = [];
  const today = new Date();

  for (let week = 0; week < 52; week++) {
    const days = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - ((51 - week) * 7 + (6 - day)));

      // Random contribution count (0-5)
      const count = Math.floor(Math.random() * 6);
      days.push({
        date: date.toISOString().split('T')[0],
        count,
        level: count === 0 ? 0 : count <= 1 ? 1 : count <= 2 ? 2 : count <= 3 ? 3 : 4
      });
    }
    weeks.push(days);
  }
  return weeks;
};

const contributionData = generateContributionData();

// Calculate stats from contribution data
const totalContributions = contributionData.flat().reduce((sum, day) => sum + day.count, 0);
const currentStreak = 7;

// Achievements
const achievements = [
  { id: 1, name: "First Problem", description: "Solved your first problem", icon: Code, color: "text-blue-500", earned: true },
  { id: 2, name: "Week Warrior", description: "7 day streak", icon: Flame, color: "text-orange-500", earned: true },
  { id: 3, name: "Interview Ready", description: "Completed 10 mock interviews", icon: Video, color: "text-purple-500", earned: true },
  { id: 4, name: "Team Player", description: "Helped 20 peers", icon: Users, color: "text-green-500", earned: true },
  { id: 5, name: "Century Club", description: "Solved 100 problems", icon: Trophy, color: "text-yellow-500", earned: false },
  { id: 6, name: "Hard Master", description: "Solved 20 hard problems", icon: Star, color: "text-red-500", earned: false },
];

// Recent submissions
const recentSubmissions = [
  { id: 1, problem: "Two Sum", difficulty: "Easy", status: "Accepted", language: "Python", time: "2h ago" },
  { id: 2, problem: "Valid Parentheses", difficulty: "Easy", status: "Accepted", language: "JavaScript", time: "5h ago" },
  { id: 3, problem: "Merge Intervals", difficulty: "Medium", status: "Wrong Answer", language: "Python", time: "1d ago" },
  { id: 4, problem: "LRU Cache", difficulty: "Medium", status: "Accepted", language: "Java", time: "2d ago" },
  { id: 5, problem: "Binary Tree Inorder", difficulty: "Medium", status: "Accepted", language: "Python", time: "3d ago" },
];

export default function ProfilePage() {
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
        <div className="absolute top-[-10%] right-[20%] w-[500px] h-[500px] bg-brand/8 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[10%] left-[15%] w-[400px] h-[400px] bg-purple-500/6 rounded-full blur-[80px] animate-float-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] right-[60%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[70px] animate-float" style={{ animationDelay: '4s' }} />

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

      {/* Navbar */}
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
            <Link className="hover:text-neutral-200 transition-colors" href="/dashboard">
              Dashboard
            </Link>
            <Link className="hover:text-neutral-200 transition-colors" href="/problems">
              Problems
            </Link>
            <Link className="hover:text-neutral-200 transition-colors" href="/mock-interview">
              Interview
            </Link>
            <Link className="hover:text-neutral-200 transition-colors" href="/leaderboards">
              Leaderboards
            </Link>
          </nav>

          <Link href="/dashboard">
            <Button variant="ghost" className="text-sm text-neutral-400 hover:text-neutral-200 hover:bg-white/5">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">
        {/* Profile Header */}
        <Card className="relative border-2 border-border/20 bg-gradient-to-br from-card/50 via-card/30 to-transparent backdrop-blur-xl overflow-hidden mb-8 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar & Basic Info */}
              <div className="flex flex-col items-center md:items-start gap-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand to-orange-300 flex items-center justify-center text-white font-bold text-4xl shadow-xl shadow-brand/20">
                  {userProfile.avatar}
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-1">{userProfile.name}</h1>
                  <p className="text-muted-foreground">@{userProfile.username}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Edit
                  </Button>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="flex-1">
                <p className="text-muted-foreground mb-6">{userProfile.bio}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="w-4 h-4 text-brand" />
                    <span>{userProfile.university} '{userProfile.graduationYear.slice(-2)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-brand" />
                    <span>{userProfile.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-brand" />
                    <span>{userProfile.jobTitle}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-brand" />
                    <a href={userProfile.website} target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">
                      Portfolio
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <a href={`https://github.com/${userProfile.github}`} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="ghost" className="gap-2 hover:bg-white/5">
                      <Github className="w-4 h-4" />
                      GitHub
                    </Button>
                  </a>
                  <a href={`https://linkedin.com/in/${userProfile.linkedin}`} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="ghost" className="gap-2 hover:bg-white/5">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </Button>
                  </a>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/20 border border-border/30">
                  <div className="text-2xl font-bold text-brand">#{userProfile.rank}</div>
                  <div className="text-xs text-muted-foreground">University Rank</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/20 border border-border/30">
                  <div className="text-2xl font-bold">{userProfile.points}</div>
                  <div className="text-xs text-muted-foreground">Total Points</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/20 border border-border/30">
                  <div className="text-2xl font-bold">{userProfile.contestRating}</div>
                  <div className="text-xs text-muted-foreground">Contest Rating</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/20 border border-border/30">
                  <div className="text-2xl font-bold text-brand">{userProfile.streak} 🔥</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GitHub-Style Contribution Grid */}
        <Card className="relative border-2 border-border/20 bg-gradient-to-br from-card/50 via-card/30 to-transparent backdrop-blur-xl overflow-hidden mb-8 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />

          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  {totalContributions} submissions in the last year
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Longest streak: {userProfile.longestStreak} days • Current streak: {currentStreak} days
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto pb-4">
              <div className="inline-flex gap-1">
                {contributionData.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={cn(
                          "w-3 h-3 rounded-sm transition-all duration-200 cursor-pointer hover:scale-125 hover:ring-1 hover:ring-green-500",
                          day.level === 0 && "bg-muted/30",
                          day.level === 1 && "bg-green-500/30",
                          day.level === 2 && "bg-green-500/50",
                          day.level === 3 && "bg-green-500/70",
                          day.level === 4 && "bg-green-500"
                        )}
                        title={`${day.count} submissions on ${day.date}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-muted/30" />
                <div className="w-3 h-3 rounded-sm bg-green-500/30" />
                <div className="w-3 h-3 rounded-sm bg-green-500/50" />
                <div className="w-3 h-3 rounded-sm bg-green-500/70" />
                <div className="w-3 h-3 rounded-sm bg-green-500" />
              </div>
              <span>More</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Problem Solving Stats */}
            <Card className="relative border-2 border-border/20 bg-gradient-to-br from-card/50 via-card/30 to-transparent backdrop-blur-xl overflow-hidden shadow-xl">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-brand" />
                  Problem Solving
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Solved</span>
                    <span className="text-3xl font-bold">{userProfile.totalSolved}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-sm">Easy</span>
                      </div>
                      <span className="text-sm font-semibold">{userProfile.easy}</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${(userProfile.easy / 100) * 100}%` }} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span className="text-sm">Medium</span>
                      </div>
                      <span className="text-sm font-semibold">{userProfile.medium}</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full transition-all" style={{ width: `${(userProfile.medium / 100) * 100}%` }} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <span className="text-sm">Hard</span>
                      </div>
                      <span className="text-sm font-semibold">{userProfile.hard}</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full transition-all" style={{ width: `${(userProfile.hard / 100) * 100}%` }} />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Acceptance Rate</span>
                      <span className="text-lg font-semibold text-brand">{userProfile.acceptanceRate}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Submissions */}
            <Card className="relative border-2 border-border/20 bg-gradient-to-br from-card/50 via-card/30 to-transparent backdrop-blur-xl overflow-hidden shadow-xl">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  Recent Submissions
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {recentSubmissions.map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-muted/30 transition-all">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{submission.problem}</h4>
                          <Badge variant="outline" className={cn(
                            "text-xs",
                            submission.difficulty === "Easy" && "border-green-500/30 text-green-600",
                            submission.difficulty === "Medium" && "border-yellow-500/30 text-yellow-600",
                            submission.difficulty === "Hard" && "border-red-500/30 text-red-600"
                          )}>
                            {submission.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{submission.language}</span>
                          <span>•</span>
                          <span>{submission.time}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn(
                        submission.status === "Accepted" && "border-green-500/30 bg-green-500/10 text-green-600",
                        submission.status !== "Accepted" && "border-red-500/30 bg-red-500/10 text-red-600"
                      )}>
                        {submission.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Achievements */}
          <div>
            <Card className="relative border-2 border-border/20 bg-gradient-to-br from-card/50 via-card/30 to-transparent backdrop-blur-xl overflow-hidden shadow-xl">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />

              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Achievements
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={cn(
                      "p-3 rounded-lg border transition-all",
                      achievement.earned
                        ? "border-border/40 bg-muted/20"
                        : "border-border/20 bg-muted/10 opacity-50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        achievement.earned ? "bg-muted/30" : "bg-muted/10"
                      )}>
                        <achievement.icon className={cn("w-5 h-5", achievement.color)} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-0.5">{achievement.name}</h4>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                      {achievement.earned && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
