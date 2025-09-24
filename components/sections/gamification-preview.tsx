"use client";

import { useState, useEffect } from "react";
import { Section } from "@/components/ui/section";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import {
  IconFlame,
  IconTrophy,
  IconStar,
  IconTarget,
  IconBolt,
  IconCrown,
  IconBadge,
  IconAward
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const achievements = [
  { id: 1, name: "First Steps", icon: IconStar, description: "Complete your first problem", unlocked: true },
  { id: 2, name: "Problem Solver", icon: IconTarget, description: "Solve 50 problems", unlocked: true },
  { id: 3, name: "Speed Demon", icon: IconBolt, description: "Solve 5 problems in under 30 minutes", unlocked: true },
  { id: 4, name: "Team Player", icon: IconTrophy, description: "Help 10 peers in chat", unlocked: false },
  { id: 5, name: "Interview Ace", icon: IconCrown, description: "Complete 20 mock interviews", unlocked: false },
  { id: 6, name: "Mentor", icon: IconAward, description: "Conduct 5 interviews as interviewer", unlocked: false }
];

const dailyChallenges = [
  { day: "Monday", problem: "Two Sum", difficulty: "Easy", points: 50, completed: true },
  { day: "Tuesday", problem: "Valid Parentheses", difficulty: "Easy", points: 75, completed: true },
  { day: "Wednesday", problem: "Merge Intervals", difficulty: "Medium", points: 100, completed: true },
  { day: "Thursday", problem: "Binary Tree Traversal", difficulty: "Medium", points: 125, completed: false },
  { day: "Friday", problem: "Graph Algorithms", difficulty: "Hard", points: 200, completed: false }
];

export default function GamificationPreview() {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [selectedTab, setSelectedTab] = useState<"achievements" | "challenges" | "leaderboard">("achievements");

  useEffect(() => {
    const streakTimer = setTimeout(() => setCurrentStreak(23), 500);
    const pointsTimer = setTimeout(() => setTotalPoints(3847), 1000);
    return () => {
      clearTimeout(streakTimer);
      clearTimeout(pointsTimer);
    };
  }, []);

  const leaderboardData = [
    { rank: 1, name: "Alex Chen", points: 8943, avatar: "👨‍💻", university: "MIT" },
    { rank: 2, name: "Sarah Kim", points: 7621, avatar: "👩‍🔬", university: "Stanford" },
    { rank: 3, name: "You", points: 3847, avatar: "🚀", university: "FSC", isUser: true },
    { rank: 4, name: "Mike Johnson", points: 3204, avatar: "👨‍🎓", university: "Berkeley" },
    { rank: 5, name: "Emma Wilson", points: 2896, avatar: "👩‍💼", university: "CMU" }
  ];

  return (
    <Section className="py-20 bg-gradient-to-b from-background/50 to-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Level Up Your
            </span>{" "}
            <span className="bg-gradient-to-r from-brand to-orange-300 bg-clip-text text-transparent">
              Learning Journey
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Turn interview prep into an engaging game with points, streaks, achievements, and friendly competition
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-brand/10 to-orange-300/10 border border-brand/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand/20 to-orange-300/20 rounded-xl flex items-center justify-center">
                  <IconFlame className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Current Streak</h3>
                  <p className="text-sm text-muted-foreground">Days in a row</p>
                </div>
              </div>
              <div className="text-4xl font-bold text-brand">
                <AnimatedCounter from={0} to={currentStreak} duration={1500} />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Keep it up! Only 7 more days to unlock "Monthly Master" badge
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                  <IconBadge className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Total Points</h3>
                  <p className="text-sm text-muted-foreground">All time earned</p>
                </div>
              </div>
              <div className="text-4xl font-bold text-purple-400">
                <AnimatedCounter from={0} to={totalPoints} duration={2000} />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Rank #3 in your university leaderboard
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 bg-muted/20 rounded-xl mb-6">
              {[
                { id: "achievements", label: "Achievements", icon: IconTrophy },
                { id: "challenges", label: "Daily Challenges", icon: IconTarget },
                { id: "leaderboard", label: "Leaderboard", icon: IconCrown }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200",
                    selectedTab === tab.id
                      ? "bg-brand/80 text-black shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px] p-6 rounded-2xl border border-border/30 bg-card/20 backdrop-blur-sm">
              {selectedTab === "achievements" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-6">Your Achievements</h3>
                  <div className="grid gap-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
                          achievement.unlocked
                            ? "border-brand/30 bg-gradient-to-r from-brand/10 to-transparent"
                            : "border-border/30 bg-muted/10 opacity-60"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          achievement.unlocked
                            ? "bg-gradient-to-br from-brand/20 to-orange-300/20"
                            : "bg-muted/20"
                        )}>
                          <achievement.icon className={cn(
                            "w-6 h-6",
                            achievement.unlocked ? "text-brand" : "text-muted-foreground"
                          )} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{achievement.name}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                        {achievement.unlocked && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === "challenges" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-6">This Week's Daily Challenges</h3>
                  <div className="space-y-3">
                    {dailyChallenges.map((challenge) => (
                      <div
                        key={challenge.day}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl border transition-all duration-200",
                          challenge.completed
                            ? "border-green-500/30 bg-green-500/10"
                            : "border-border/30 bg-card/30"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-sm font-semibold text-muted-foreground w-20">
                            {challenge.day}
                          </div>
                          <div>
                            <h4 className="font-semibold">{challenge.problem}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={cn(
                                "px-2 py-1 rounded text-xs font-semibold",
                                challenge.difficulty === "Easy" && "bg-green-500/20 text-green-400",
                                challenge.difficulty === "Medium" && "bg-yellow-500/20 text-yellow-400",
                                challenge.difficulty === "Hard" && "bg-red-500/20 text-red-400"
                              )}>
                                {challenge.difficulty}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                +{challenge.points} points
                              </span>
                            </div>
                          </div>
                        </div>
                        {challenge.completed && (
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">✓</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === "leaderboard" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-6">FSC Leaderboard</h3>
                  <div className="space-y-3">
                    {leaderboardData.map((user) => (
                      <div
                        key={user.rank}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
                          user.isUser
                            ? "border-brand/30 bg-gradient-to-r from-brand/10 to-transparent ring-1 ring-brand/20"
                            : "border-border/30 bg-card/30"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                          user.rank === 1 && "bg-yellow-500/20 text-yellow-400",
                          user.rank === 2 && "bg-gray-300/20 text-gray-300",
                          user.rank === 3 && "bg-orange-500/20 text-orange-400",
                          user.rank > 3 && "bg-muted/20 text-muted-foreground"
                        )}>
                          #{user.rank}
                        </div>
                        <div className="text-2xl">{user.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{user.name}</h4>
                            {user.isUser && (
                              <span className="px-2 py-1 bg-brand/20 text-brand text-xs rounded-full">You</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{user.university}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{user.points.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}