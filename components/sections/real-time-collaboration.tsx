// src/components/sections/real-time-collaboration.tsx

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

// Define the collaborative editing sequence
const editingSequence = [
  {
    type: "type",
    user: 1,
    delay: 1000,
    text: `def two_sum(nums, target):
    # TODO: Implement this function
    pass`,
    cursorPos: { x: 15, y: 15 }
  },
  {
    type: "chat",
    user: 1,
    delay: 1500,
    message: "Let's start with the basic function structure"
  },
  {
    type: "delete",
    user: 1,
    delay: 2000,
    deleteText: "# TODO: Implement this function",
    cursorPos: { x: 15, y: 25 }
  },
  {
    type: "type",
    user: 1,
    delay: 500,
    text: "# Sarah: Let's start with a brute force approach",
    cursorPos: { x: 15, y: 25 }
  },
  {
    type: "delete",
    user: 1,
    delay: 1000,
    deleteText: "pass",
    cursorPos: { x: 15, y: 35 }
  },
  {
    type: "type",
    user: 1,
    delay: 500,
    text: `for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
    cursorPos: { x: 15, y: 35 }
  },
  {
    type: "chat",
    user: 2,
    delay: 2000,
    message: "That works but it's O(n²). Can we optimize it?"
  },
  {
    type: "type",
    user: 2,
    delay: 1000,
    text: `
    # Alex: This is O(n²) - we can do better with a hash map`,
    cursorPos: { x: 15, y: 30 }
  },
  {
    type: "chat",
    user: 1,
    delay: 1500,
    message: "Good point! Let me refactor this"
  },
  {
    type: "delete",
    user: 1,
    delay: 2000,
    deleteText: `for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]`,
    cursorPos: { x: 15, y: 45 }
  },
  {
    type: "type",
    user: 1,
    delay: 500,
    text: `seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i`,
    cursorPos: { x: 15, y: 45 }
  },
  {
    type: "type",
    user: 2,
    delay: 1000,
    text: "  # Alex: Store the value and its index",
    cursorPos: { x: 25, y: 75 }
  },
  {
    type: "chat",
    user: 3,
    delay: 1500,
    message: "Nice! Should we add some test cases?"
  },
  {
    type: "type",
    user: 3,
    delay: 2000,
    text: `

# Jordan: Let's add test cases to verify our solution
def test_two_sum():
    assert two_sum([2, 7, 11, 15], 9) == [0, 1]
    assert two_sum([3, 2, 4], 6) == [1, 2]
    assert two_sum([3, 3], 6) == [0, 1]
    print("All tests passed!")`,
    cursorPos: { x: 30, y: 85 }
  },
  {
    type: "chat",
    user: 1,
    delay: 1000,
    message: "Perfect! Now we have O(n) time complexity"
  },
  {
    type: "chat",
    user: 2,
    delay: 800,
    message: "Great collaboration team! 🎉"
  }
];

const initialChatMessages = [
  { id: 1, user: "System", message: "Collaborative session started", time: "2:30 PM", type: "system" }
];

export default function RealTimeCollaboration({ className }: { className?: string }) {
  const [activeUsers, setActiveUsers] = useState(mockUsers);
  const [messages, setMessages] = useState(initialChatMessages);
  const [currentCode, setCurrentCode] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState<{x: number, y: number} | null>(null);
  const [currentlyTypingText, setCurrentlyTypingText] = useState("");

  // Progressive character-by-character typing
  const typeTextProgressively = async (text: string, speed = 80) => {
    const baseCode = currentCode;
    setCurrentlyTypingText("");
    
    for (let i = 0; i <= text.length; i++) {
      await new Promise(resolve => setTimeout(resolve, speed + Math.random() * 40));
      const typedSoFar = text.slice(0, i);
      setCurrentlyTypingText(typedSoFar);
      
      // Show the final result only at the end
      if (i === text.length) {
        setCurrentCode(baseCode + text);
        setCurrentlyTypingText("");
      }
    }
  };

  // Progressive character-by-character deletion
  const deleteTextProgressively = async (textToDelete: string, speed = 30) => {
    const codeBeforeDeletion = currentCode;
    const deleteStartIndex = codeBeforeDeletion.lastIndexOf(textToDelete);
    
    if (deleteStartIndex === -1) return;
    
    const beforeDeleteText = codeBeforeDeletion.slice(0, deleteStartIndex);
    const afterDeleteText = codeBeforeDeletion.slice(deleteStartIndex + textToDelete.length);
    
    // Delete character by character from the end
    for (let i = textToDelete.length; i >= 0; i--) {
      await new Promise(resolve => setTimeout(resolve, speed + Math.random() * 20));
      const remainingText = textToDelete.slice(0, i);
      setCurrentCode(beforeDeleteText + remainingText + afterDeleteText);
    }
  };

  // Execute the editing sequence
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const executeStep = async () => {
      if (currentStep >= editingSequence.length) {
        // Reset the sequence after completion
        setTimeout(() => {
          setCurrentStep(0);
          setCurrentCode("");
          setMessages(initialChatMessages);
          setTypingUser(null);
          setCursorPosition(null);
          setCurrentlyTypingText("");
        }, 5000);
        return;
      }

      const step = editingSequence[currentStep];
      
      await new Promise(resolve => setTimeout(resolve, step.delay));

      if (step.type === "type") {
        setTypingUser(step.user);
        setCursorPosition(step.cursorPos);
        setIsTyping(true);

        // Update user status
        setActiveUsers(prev => prev.map(user => 
          user.id === step.user 
            ? { ...user, status: "typing" }
            : { ...user, status: "online" }
        ));

        await typeTextProgressively(step.text, 60);

        setIsTyping(false);
        setTypingUser(null);
        
        // Reset user status
        setActiveUsers(prev => prev.map(user => 
          ({ ...user, status: "online" })
        ));
      }
      else if (step.type === "delete") {
        setTypingUser(step.user);
        setCursorPosition(step.cursorPos);
        setIsTyping(true);

        // Update user status
        setActiveUsers(prev => prev.map(user => 
          user.id === step.user 
            ? { ...user, status: "typing" }
            : { ...user, status: "online" }
        ));

        await deleteTextProgressively(step.deleteText, 25);

        setIsTyping(false);
        setTypingUser(null);
        
        // Reset user status
        setActiveUsers(prev => prev.map(user => 
          ({ ...user, status: "online" })
        ));
      }
      else if (step.type === "chat") {
        const newMessage = {
          id: messages.length + Math.random(),
          user: mockUsers.find(u => u.id === step.user)?.name || "Unknown",
          message: step.message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: "message" as const
        };
        setMessages(prev => [...prev, newMessage]);
      }

      setCurrentStep(prev => prev + 1);
    };

    timeoutId = setTimeout(executeStep, 100);
    return () => clearTimeout(timeoutId);
  }, [currentStep, currentCode, messages.length]);

  return (
    <section className={cn("py-20 relative overflow-hidden", className)}>
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(119,106,93,0.05)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge className="mb-6 bg-brand/10 border-brand/20 text-brand hover:bg-brand/20 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
              Live Collaboration
            </div>
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-brand bg-clip-text text-transparent leading-tight ">
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
                Online ({activeUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeUsers.map((user) => {
                const isCurrentlyTyping = typingUser === user.id;
                return (
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
                          isCurrentlyTyping ? "bg-orange-500 animate-pulse" : "bg-green-500"
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.university}</div>
                      {isCurrentlyTyping && (
                        <div className="text-xs text-orange-500 mt-1 flex items-center gap-1">
                          <div className="flex gap-0.5">
                            <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce" />
                            <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                          typing...
                        </div>
                      )}
                    </div>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: user.cursorColor }}
                      title="Cursor color"
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Live Code Editor */}
          <Card className="lg:col-span-2 border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 3a1 1 0 0 0-1 1v3H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-3V4a1 1 0 0 0-1-1H8zM9 5h6v2H9V5zm-4 4h14v6H5V9z"/>
                  </svg>
                  two_sum.py
                  {isTyping && (
                    <div className="flex items-center gap-1 ml-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                      <span className="text-xs text-orange-600">Live editing</span>
                    </div>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-green-600">Auto-sync</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Live Code Editor */}
                <div className="bg-muted/20 rounded-lg p-4 border border-border/30 overflow-x-auto relative min-h-[400px] font-mono">
                  <pre className="text-sm leading-relaxed whitespace-pre-wrap">
                    <code className="text-foreground">
                      {currentCode}
                      {currentlyTypingText && (
                        <span className="text-foreground">{currentlyTypingText}</span>
                      )}
                      {isTyping && (
                        <span className="animate-pulse text-foreground">|</span>
                      )}
                    </code>
                  </pre>

                  {/* Live cursor */}
                  {typingUser && cursorPosition && (
                    <div
                      className="absolute pointer-events-none z-10 transition-all duration-300"
                      style={{
                        left: `${cursorPosition.x}%`,
                        top: `${cursorPosition.y}%`,
                      }}
                    >
                      <div
                        className="w-0.5 h-4 animate-pulse"
                        style={{ backgroundColor: mockUsers.find(u => u.id === typingUser)?.cursorColor }}
                      />
                      <div
                        className="text-xs text-white px-2 py-1 rounded mt-1 whitespace-nowrap shadow-lg"
                        style={{ backgroundColor: mockUsers.find(u => u.id === typingUser)?.cursorColor }}
                      >
                        {mockUsers.find(u => u.id === typingUser)?.name}
                      </div>
                    </div>
                  )}
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
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-green-500 rounded-full" />
                      {isTyping ? "Saving changes..." : "All changes saved"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Chat Section */}
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
                    "flex items-start gap-3 p-3 rounded-lg transition-all duration-300 animate-in slide-in-from-bottom-2",
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