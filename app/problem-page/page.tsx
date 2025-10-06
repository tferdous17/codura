'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Play, Send, RotateCcw } from 'lucide-react'

export default function ProblemPage() {
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai', content: string }>>([])
  const [chatInput, setChatInput] = useState('')

    const handleSendMessage = () => {
        if (chatInput.trim()) {
            setChatMessages([...chatMessages, { role: 'user', content: chatInput }])
            setChatInput('')
            // Simulate AI response
            setTimeout(() => {
                setChatMessages(prev => [...prev, { role: 'ai', content: 'I can help you solve this problem. What would you like to know?' }])
            }, 1000)
        }
    }

    return (
        <div className="h-screen w-full bg-background">
            <ResizablePanelGroup direction="horizontal" className="h-full">
                {/* Left Panel - Problem Description with Tabs */}
                <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
                    <div className="h-full flex flex-col">
                        <Tabs defaultValue="description" className="flex-1 flex flex-col">
                            <div className="border-b px-4">
                                <TabsList className="w-full justify-start">
                                    <TabsTrigger value="description">Description</TabsTrigger>
                                    <TabsTrigger value="solution">Solution</TabsTrigger>
                                    <TabsTrigger value="discussion">Discussion</TabsTrigger>
                                    <TabsTrigger value="community">Community</TabsTrigger>
                                    <TabsTrigger value="submissions">Submissions</TabsTrigger>
                                </TabsList>
                            </div>

                            <ScrollArea className="flex-1">
                                <TabsContent value="description" className="p-4 mt-0">
                                    <div className="space-y-4">
                                        <div>
                                            <h1 className="text-2xl font-bold mb-2">1. Two Sum</h1>
                                            <Badge variant="default" className="bg-green-500">Easy</Badge>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-sm text-muted-foreground">
                                                Given an array of integers <code className="bg-muted px-1 rounded">nums</code> and an integer{' '}
                                                <code className="bg-muted px-1 rounded">target</code>, return indices of the two numbers such that they add up to{' '}
                                                <code className="bg-muted px-1 rounded">target</code>.
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                You may assume that each input would have exactly one solution, and you may not use the same element twice.
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                You can return the answer in any order.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="font-semibold">Example 1:</h3>
                                            <div className="bg-muted p-3 rounded text-sm font-mono">
                                                <p><strong>Input:</strong> nums = [2,7,11,15], target = 9</p>
                                                <p><strong>Output:</strong> [0,1]</p>
                                                <p><strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="font-semibold">Example 2:</h3>
                                            <div className="bg-muted p-3 rounded text-sm font-mono">
                                                <p><strong>Input:</strong> nums = [3,2,4], target = 6</p>
                                                <p><strong>Output:</strong> [1,2]</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="font-semibold">Constraints:</h3>
                                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                                <li>2 ≤ nums.length ≤ 10⁴</li>
                                                <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
                                                <li>-10⁹ ≤ target ≤ 10⁹</li>
                                                <li>Only one valid answer exists.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="solution" className="p-4 mt-0">
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-bold">Solution Approach</h2>
                                        <p className="text-sm text-muted-foreground">
                                            The solution content will go here. This could include optimal approaches, time complexity analysis, and step-by-step explanations.
                                        </p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="discussion" className="p-4 mt-0">
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-bold">Discussion</h2>
                                        <p className="text-sm text-muted-foreground">
                                            Community discussions will appear here.
                                        </p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="community" className="p-4 mt-0">
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-bold">Community Solutions</h2>
                                        <p className="text-sm text-muted-foreground">
                                            Top community solutions will be displayed here.
                                        </p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="submissions" className="p-4 mt-0">
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-bold">My Submissions</h2>
                                        <p className="text-sm text-muted-foreground">
                                            Your submission history will appear here.
                                        </p>
                                    </div>
                                </TabsContent>
                            </ScrollArea>
                        </Tabs>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Middle Panel - Code Editor and Test Cases */}
                <ResizablePanel defaultSize={45} minSize={30}>
                    <div className="h-full flex flex-col">
                        {/* Top Section - Language Selector and Action Buttons */}
                        <div className="border-b p-2 flex items-center justify-between">
                            <Select defaultValue="javascript">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="javascript">JavaScript</SelectItem>
                                    <SelectItem value="python">Python</SelectItem>
                                    <SelectItem value="java">Java</SelectItem>
                                    <SelectItem value="cpp">C++</SelectItem>
                                    <SelectItem value="typescript">TypeScript</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Reset
                                </Button>
                            </div>
                        </div>

                        {/* Code Editor Area */}
                        <div className="flex-1 bg-muted/30 p-4">
                            <div className="h-full border rounded-lg bg-background/50 p-4 font-mono text-sm">
                                <p className="text-muted-foreground">// Code editor placeholder</p>
                                <p className="text-muted-foreground">// Monaco Editor or similar will be integrated here</p>
                                <p className="mt-4">function twoSum(nums, target) {'{'}</p>
                                <p className="ml-4">// Write your solution here</p>
                                <p>{'}'}</p>
                            </div>
                        </div>

                        {/* Bottom Section - Test Cases */}
                        <div className="border-t">
                            <Tabs defaultValue="testcases" className="w-full">
                                <div className="border-b px-4">
                                    <TabsList>
                                        <TabsTrigger value="testcases">Test Cases</TabsTrigger>
                                        <TabsTrigger value="result">Result</TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="testcases" className="p-4 space-y-3">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Test Case 1</span>
                                            <Button size="sm" variant="default">
                                                <Play className="w-4 h-4 mr-2" />
                                                Run Code
                                            </Button>
                                        </div>
                                        <div className="bg-muted p-3 rounded text-sm font-mono">
                                            <p>nums = [2,7,11,15]</p>
                                            <p>target = 9</p>
                                        </div>
                                    </div>

                                    <Button variant="default" className="w-full">
                                        Submit Solution
                                    </Button>
                                </TabsContent>

                                <TabsContent value="result" className="p-4">
                                    <div className="bg-muted p-3 rounded text-sm">
                                        <p className="text-muted-foreground">Run your code to see results here</p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Right Panel - AI Chatbot */}
                <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
                    <Card className="h-full rounded-none border-0 flex flex-col">
                        <CardHeader className="border-b">
                            <CardTitle className="text-lg">AI Assistant</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 flex flex-col">
                            {/* Chat Messages */}
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    {chatMessages.length === 0 ? (
                                        <div className="text-center text-muted-foreground text-sm py-8">
                                            <p>Ask me anything about this problem!</p>
                                            <p className="mt-2">I can help with:</p>
                                            <ul className="mt-2 space-y-1 text-xs">
                                                <li>• Understanding the problem</li>
                                                <li>• Approach suggestions</li>
                                                <li>• Code explanations</li>
                                                <li>• Debugging help</li>
                                            </ul>
                                        </div>
                                    ) : (
                                        chatMessages.map((message, index) => (
                                            <div
                                                key={index}
                                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] rounded-lg p-3 text-sm ${message.role === 'user'
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-muted'
                                                        }`}
                                                >
                                                    {message.content}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>

                            {/* Chat Input */}
                            <div className="border-t p-4">
                                <div className="flex gap-2">
                                    <Textarea
                                        placeholder="Ask me anything..."
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault()
                                                handleSendMessage()
                                            }
                                        }}
                                        className="min-h-[60px] resize-none"
                                    />
                                    <Button onClick={handleSendMessage} size="icon" className="self-end">
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}
