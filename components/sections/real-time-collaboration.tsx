"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockUsers = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b2d3?w=400&h=400&fit=crop&crop=face",
    university: "MIT",
    status: "online",
    cursorColor: "#10b981"
  },
  {
    id: 2,
    name: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    university: "Stanford",
    status: "online",
    cursorColor: "#3b82f6"
  },
  {
    id: 3,
    name: "Jordan Kim",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
    university: "UC Berkeley",
    status: "typing",
    cursorColor: "#f59e0b"
  }
];

const collaborativeCode = `def two_sum(nums, target):
    # Sarah is working on this optimization
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i  # Alex added this comment: Store the index
    return []

# Jordan is suggesting: Let's test edge cases
# Test cases:
# two_sum([2, 7, 11, 15], 9) -> [0, 1]
# two_sum([3, 2, 4], 6) -> [1, 2]`;

const chatMessages = [
  { id: 1, user: "Sarah Chen", message: "Let me optimize this for O(n) time complexity", time: "2:34 PM", type: "message" },
  { id: 2, user: "Alex Rivera", message: "Good idea! Using a hash map?", time: "2:34 PM", type: "message" },
  { id: 3, user: "Sarah Chen", message: "Exactly! Store complements as we iterate", time: "2:35 PM", type: "message" },
  { id: 4, user: "Jordan Kim", message: "Should we add some test cases too?", time: "2:35 PM", type: "message" },
  { id: 5, user: "System", message: "Code execution completed successfully ✅", time: "2:36 PM", type: "system" }
];

export default function RealTimeCollaboration({ className }: { className?: string }) {
  const [activeUsers, setActiveUsers] = useState(mockUsers);
  const [messages, setMessages] = useState(chatMessages);
  const [cursorPositions, setCursorPositions] = useState<{[key: number]: {x: number, y: number}}>({});
  const [typingUser, setTypingUser] = useState<number | null>(null);

  useEffect(() => {
    // Simulate cursor movement
    const interval = setInterval(() => {
      const newPositions: {[key: number]: {x: number, y: number}} = {};
      activeUsers.forEach(user => {
        newPositions[user.id] = {
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20
        };
      });
      setCursorPositions(newPositions);
    }, 2000);

    return () => clearInterval(interval);
  }, [activeUsers]);

  useEffect(() => {
    // Simulate typing indicator
    const interval = setInterval(() => {
      setTypingUser(prev => {
        if (prev === null) {
          return mockUsers[Math.floor(Math.random() * mockUsers.length)].id;
        }
        return null;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    // REMOVED background gradient. Standardized padding.
    <section className={cn("py-20 relative overflow-hidden", className)}>
      {/* Background elements inspired by Nightwatch */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {/* Animated Beams */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-brand/40 to-transparent animate-pulse"
              style={{
                left: `${12 + i * 11}%`,
                height: '100%',
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${2.5 + i * 0.3}s`
              }}
            />
          ))}
        </div>
        {/* Floating connection lines */}
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-5" viewBox="0 0 800 600">
            {Array.from({ length: 3 }).map((_, i) => (
              <line
                key={i}
                x1={100 + i * 200}
                y1={100}
                x2={200 + i * 200}
                y2={300}
                stroke="hsl(var(--brand))"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-pulse"
                style={{ animationDelay: `${i * 1.5}s` }}
              />
            ))}
          </svg>
        </div>
        {/* Added radial glow for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge className="mb-6 bg-blue-500/10 border-blue-500/20 text-blue-600 hover:bg-blue-500/20 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live Collaboration
            </div>
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-brand bg-clip-text text-transparent">
            Code Together in Real-Time
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            Practice with peers, conduct mock interviews, and solve problems together with live code sharing,
            real-time chat, and synchronized cursor tracking.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Active Users */}
          <Card className="lg:col-span-1 border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Online ({activeUsers.filter(u => u.status === 'online' || u.status === 'typing').length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div
                      className={cn(
                        "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
                        user.status === 'online' && "bg-green-500",
                        user.status === 'typing' && "bg-orange-500 animate-pulse"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.university}</div>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: user.cursorColor }}
                    title="Cursor color"
                  />
                </div>
              ))}

              <div className="pt-3 border-t border-border/30">
                <div className="text-xs text-muted-foreground text-center">
                  {typingUser && (
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-brand rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1 h-1 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                      {mockUsers.find(u => u.id === typingUser)?.name} is typing...
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Editor */}
          <Card className="lg:col-span-2 border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 3a1 1 0 0 0-1 1v3H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-3V4a1 1 0 0 0-1-1H8zM9 5h6v2H9V5zm-4 4h14v6H5V9z"/>
                  </svg>
                  two_sum.py
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-green-600">Synced</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Code editor */}
                <div className="bg-muted/20 rounded-lg p-4 border border-border/30 overflow-x-auto relative">
                  <pre className="text-sm font-mono leading-relaxed whitespace-pre-wrap">
                    <code className="text-foreground">{collaborativeCode}</code>
                  </pre>

                  {/* Animated cursors */}
                  {Object.entries(cursorPositions).map(([userId, pos]) => {
                    const user = activeUsers.find(u => u.id === parseInt(userId));
                    if (!user) return null;

                    return (
                      <div
                        key={userId}
                        className="absolute pointer-events-none transition-all duration-500 ease-in-out"
                        style={{
                          left: `${pos.x}%`,
                          top: `${pos.y}%`,
                        }}
                      >
                        <div
                          className="w-0.5 h-4 animate-pulse"
                          style={{ backgroundColor: user.cursorColor }}
                        />
                        <div
                          className="text-xs text-white px-1 py-0.5 rounded mt-1 whitespace-nowrap"
                          style={{ backgroundColor: user.cursorColor }}
                        >
                          {user.name}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg font-medium text-sm bg-green-500/15 hover:bg-green-500/25 text-green-600 border border-green-500/30 hover:border-green-500/50 transition-all duration-200">
                      ▶ Run Code
                    </button>
                    <button className="px-4 py-2 rounded-lg font-medium text-sm bg-muted/30 hover:bg-muted/50 text-muted-foreground border border-border/30 transition-all duration-200">
                      💬 Voice Chat
                    </button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Auto-saved 2s ago
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Section */}
        <Card className="mt-6 max-w-6xl mx-auto border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              Team Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg",
                    msg.type === 'system' ? "bg-blue-500/5 border border-blue-500/20" : "hover:bg-muted/20"
                  )}
                >
                  {msg.type !== 'system' && (
                    <div className="w-8 h-8 bg-brand/20 rounded-full flex items-center justify-center text-xs font-semibold">
                      {msg.user.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "font-medium text-sm",
                        msg.type === 'system' && "text-blue-600"
                      )}>
                        {msg.user}
                      </span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="flex gap-3">
                <input
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 text-sm bg-muted/20 border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 transition-colors"
                />
                <button className="px-4 py-2 bg-brand/15 hover:bg-brand/25 text-brand rounded-lg transition-colors">
                  Send
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature highlights */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="m2 17 10 5 10-5"/>
                  <path d="m2 12 10 5 10-5"/>
                </svg>
              ),
              title: "Real-time Sync",
              description: "Changes appear instantly for all participants"
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                </svg>
              ),
              title: "Voice & Video",
              description: "Built-in communication tools for better collaboration"
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ),
              title: "Session Recording",
              description: "Save and review your practice sessions"
            }
          ].map((feature, index) => (
            <Card key={index} className="border-border/40 bg-card/30 backdrop-blur-sm text-center p-6">
              <div className="w-12 h-12 bg-blue-500/15 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}