'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, Tag } from 'lucide-react'

interface ProblemData {
  id: number
  leetcode_id: number
  title: string
  title_slug: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
  examples: Array<{
    id: number
    content: string
  }>
  constraints: string[]
  topic_tags: Array<{ name: string; slug: string }>
  acceptance_rate: number
}

interface ProblemDescriptionProps {
  problem: ProblemData | null
  loading?: boolean
}

export function ProblemDescription({ problem, loading }: ProblemDescriptionProps) {
  const [showTags, setShowTags] = useState(false)
  const [showAcceptanceRate, setShowAcceptanceRate] = useState(false)

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading problem...</p>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">No problem data available</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="description" className="flex-1 flex flex-col">
        {/* Tab Navigation */}
        <TabNavigation />

        <ScrollArea className="flex-1">
          {/* Description Tab */}
          <TabsContent value="description" className="p-4 mt-0">
            <DescriptionContent 
              problem={problem}
              showTags={showTags}
              setShowTags={setShowTags}
              showAcceptanceRate={showAcceptanceRate}
              setShowAcceptanceRate={setShowAcceptanceRate}
            />
          </TabsContent>

          {/* Solution Tab */}
          <TabsContent value="solution" className="p-4 mt-0">
            <SolutionContent />
          </TabsContent>

          {/* Discussion Tab */}
          <TabsContent value="discussion" className="p-4 mt-0">
            <DiscussionContent />
          </TabsContent>

          {/* Community Solutions Tab */}
          <TabsContent value="community" className="p-4 mt-0">
            <CommunityContent />
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="p-4 mt-0">
            <SubmissionsContent />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}

// ============================================
// SUB-COMPONENTS
// ============================================

function TabNavigation() {
  return (
    <div className="border-b overflow-x-auto tab-scroll-container">
      <TabsList className="inline-flex w-auto min-w-full justify-start h-12 px-2 bg-transparent">
        <TabsTrigger value="description" className="flex-shrink-0">
          Description
        </TabsTrigger>
        <TabsTrigger value="solution" className="flex-shrink-0">
          Solution
        </TabsTrigger>
        <TabsTrigger value="discussion" className="flex-shrink-0">
          Discussion
        </TabsTrigger>
        <TabsTrigger value="community" className="flex-shrink-0">
          Community
        </TabsTrigger>
        <TabsTrigger value="submissions" className="flex-shrink-0">
          Submissions
        </TabsTrigger>
      </TabsList>
    </div>
  )
}

interface DescriptionContentProps {
  problem: ProblemData
  showTags: boolean
  setShowTags: (show: boolean) => void
  showAcceptanceRate: boolean
  setShowAcceptanceRate: (show: boolean) => void
}

function DescriptionContent({ 
  problem, 
  showTags, 
  setShowTags, 
  showAcceptanceRate, 
  setShowAcceptanceRate 
}: DescriptionContentProps) {
  return (
    <div className="space-y-4">
      {/* Title and Difficulty */}
      <ProblemHeader 
        problem={problem}
        showAcceptanceRate={showAcceptanceRate}
        setShowAcceptanceRate={setShowAcceptanceRate}
      />

      {/* Topics */}
      {problem.topic_tags && problem.topic_tags.length > 0 && (
        <TopicTags 
          tags={problem.topic_tags}
          showTags={showTags}
          setShowTags={setShowTags}
        />
      )}

      {/* Description */}
      <ProblemDescriptionText description={problem.description} />

      {/* Examples */}
      {problem.examples && problem.examples.length > 0 && (
        <ExamplesList examples={problem.examples} />
      )}

      {/* Constraints */}
      {problem.constraints && problem.constraints.length > 0 && (
        <ConstraintsList constraints={problem.constraints} />
      )}
    </div>
  )
}

interface ProblemHeaderProps {
  problem: ProblemData
  showAcceptanceRate: boolean
  setShowAcceptanceRate: (show: boolean) => void
}

function ProblemHeader({ problem, showAcceptanceRate, setShowAcceptanceRate }: ProblemHeaderProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-950 text-green-400 !border-green-900'
      case 'Medium':
        return 'bg-yellow-950 text-yellow-400 !border-yellow-900'
      case 'Hard':
        return 'bg-red-950 text-red-400 !border-red-900'
      default:
        return 'bg-zinc-900 text-zinc-400 !border-zinc-900'
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        {problem.leetcode_id}. {problem.title}
      </h1>
      <div className="flex items-center gap-2">
        <Badge 
          variant="default" 
          className={`${getDifficultyColor(problem.difficulty)} border-1`}
        >
          {problem.difficulty}
        </Badge>
        
        <div 
          className="relative cursor-pointer group ml-2"
          onClick={() => setShowAcceptanceRate(true)}
        >
          <div className={`text-sm transition-all ${showAcceptanceRate ? '' : 'blur-sm select-none'}`}>
            <span className="text-zinc-400">Acceptance: </span>
            <span className="text-sm text-muted-foreground">
              {problem.acceptance_rate.toFixed(1)}%
            </span>
          </div>
          {!showAcceptanceRate && (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-500 group-hover:text-zinc-300">
              Reveal Acceptance %
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface TopicTagsProps {
  tags: Array<{ name: string; slug: string }>
  showTags: boolean
  setShowTags: (show: boolean) => void
}

function TopicTags({ tags, showTags, setShowTags }: TopicTagsProps) {
  return (
    <div className="space-y-2">
      <button
        onClick={() => setShowTags(!showTags)}
        className="cursor-pointer text-sm text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1 border-1 px-2 py-1 rounded-lg"
      >
        <Tag className="w-3 h-3 mr-1 text-primary" />
        {showTags ? 'Hide Topics' : 'View Topics'}
        {showTags ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      
      {showTags && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag.slug} variant="secondary" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

function ProblemDescriptionText({ description }: { description: string }) {
  return (
    <div className="space-y-2">
      <div
        className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  )
}

function ExamplesList({ examples }: { examples: Array<{ id: number; content: string }> }) {
  return (
    <div className="space-y-4">
      {examples.map((example, index) => (
        <div key={example.id} className="space-y-2">
          <h3 className="font-semibold">Example {index + 1}:</h3>
          <div className="bg-muted p-3 rounded text-sm font-mono">
            <pre className="whitespace-pre-wrap">{example.content}</pre>
          </div>
        </div>
      ))}
    </div>
  )
}

function ConstraintsList({ constraints }: { constraints: string[] }) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Constraints:</h3>
      <div className="bg-green-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
        <ul className="space-y-1 text-sm font-mono text-slate-700 dark:text-slate-300">
          {constraints.map((constraint, index) => (
            <li key={index}>{constraint}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ============================================
// PLACEHOLDER TABS (To be implemented later)
// ============================================

function SolutionContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Solution Approach</h2>
      <div className="bg-muted/50 border border-border rounded-lg p-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Official solution coming soon!
        </p>
        <p className="text-xs text-muted-foreground">
          This will include optimal approaches, time complexity analysis, and step-by-step explanations.
        </p>
      </div>
    </div>
  )
}

function DiscussionContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Discussion</h2>
      <div className="bg-muted/50 border border-border rounded-lg p-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          No discussions yet
        </p>
        <p className="text-xs text-muted-foreground">
          Community discussions will appear here once available.
        </p>
      </div>
    </div>
  )
}

function CommunityContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Community Solutions</h2>
      <div className="bg-muted/50 border border-border rounded-lg p-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          No community solutions yet
        </p>
        <p className="text-xs text-muted-foreground">
          Top community solutions will be displayed here once submitted.
        </p>
      </div>
    </div>
  )
}

function SubmissionsContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">My Submissions</h2>
      <div className="bg-muted/50 border border-border rounded-lg p-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          No submissions yet
        </p>
        <p className="text-xs text-muted-foreground">
          Your submission history will appear here after you submit solutions.
        </p>
      </div>
    </div>
  )
}