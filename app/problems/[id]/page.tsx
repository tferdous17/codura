'use client'

import React, { useState, useEffect } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Import all separated components
import AIChatbot from '@/components/problems/AIChatbot'
import { CodeEditor } from '@/components/problems/CodeEditor'
import { TestCases, parseExamplesToTestCases } from '@/components/problems/TestCases'
import { ProblemDescription } from '@/components/problems/ProblemDescription'

// Custom styles for tab scrolling
const tabScrollStyles = `
  .tab-scroll-container {
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
    transition: scrollbar-color 0.3s ease;
  }

  .tab-scroll-container:hover {
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
  }

  .dark .tab-scroll-container:hover {
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
  }

  .tab-scroll-container::-webkit-scrollbar {
    height: 4px;
  }

  .tab-scroll-container::-webkit-scrollbar-track {
    background: transparent;
  }

  .tab-scroll-container::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 2px;
    transition: background 0.3s ease;
  }

  .tab-scroll-container:hover::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
  }

  .dark .tab-scroll-container:hover::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
  }
`

// ============================================
// INTERFACES
// ============================================

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
  code_snippets: Array<{
    code: string
    lang: string 
    langSlug: string
  }>
}

interface TestCase {
  input: string
  expectedOutput: string
  explanation?: string
}

interface SubmissionResult {
  status: string
  description: string
  testResults?: any[]
  totalTests?: number
  passedTests?: number
  memory?: string
  runtime?: string
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ProblemPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()

  // State management
  const [problem, setProblem] = useState<ProblemData | null>(null)
  const [testcases, setTestcases] = useState<TestCase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | undefined>()
  // Mock submission for AIChatbot (temporary for testing)
  const [aiSubmission, setAiSubmission] = useState<{
    code: string
    language: string
    timestamp: Date
    testsPassed: number
    totalTests: number
  } | null>(null)
  // ============================================
  // DATA FETCHING
  // ============================================

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true)

        const { data, error } = await supabase
          .from('problems')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error

        if (!data) {
          setError('Problem not found')
          return
        }

        setProblem(data as ProblemData)
        setTestcases(parseExamplesToTestCases(data.examples))

      } catch (err) {
        console.error('Error fetching problem:', err)
        setError('Failed to load problem')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProblem()
    }
  }, [params.id, supabase])

  // ============================================
  // EVENT HANDLERS
  // ============================================

  /**
   * Handle code submission to judge server
   */
  const handleCodeSubmission = async (code: string, languageId: number) => {
    try {
      const body = {
        language_id: languageId,
        source_code: code,
        stdin: "test",
      }

      const response = await fetch('http://localhost:8080/api/problems/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      const data = await response.json()
      
      // Update submission result with API response
      setSubmissionResult({
        status: data.submissionResult?.status?.description || 'Unknown',
        description: data.submissionResult?.status?.description || '',
        totalTests: data.totalTests,
        passedTests: data.passedTests,
        memory: data.memory,
        runtime: data.runtime,
        testResults: data.testResults,
      })
      
      // Mock submission for AIChatbot only (not judge)
      type AiSubmission = {
        code: string
        language: string
        timestamp: Date
        testsPassed: number
        totalTests: number
      } | null

      const [aiSubmission, setAiSubmission] = useState<AiSubmission>(null)
      console.log('Submission successful:', data)
    } catch (error) {
      console.error('Submission error:', error)
      setSubmissionResult({
        status: 'Error',
        description: 'Failed to submit code. Please try again.'
      })
      throw error
    }
  }

  /**
   * Handle running code with test cases (without official submission)
   */
  const handleCodeRun = async (code: string, languageId: number) => {
    try {
      // Use first test case input for quick run
      const testInput = testcases[0]?.input || ""
      
      const body = {
        language_id: languageId,
        source_code: code,
        stdin: testInput,
      }

      const response = await fetch('http://localhost:8080/api/problems/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        throw new Error('Run failed')
      }

      const data = await response.json()
      
      // Update result with run output
      setSubmissionResult({
        status: data.status || 'Completed',
        description: 'Code executed successfully',
        testResults: data.testResults,
      })

      console.log('Run successful:', data)
    } catch (error) {
      console.error('Run error:', error)
      setSubmissionResult({
        status: 'Error',
        description: 'Failed to run code. Please try again.'
      })
      throw error
    }
  }

  /**
   * Handle AI chat messages (for analytics/logging)
   */
  const handleAIChatMessage = (message: string) => {
    console.log('User asked AI:', message)
    // TODO: Track analytics, log to database, etc.
  }

  // ============================================
  // LOADING STATE
  // ============================================

  if (loading) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading problem...</p>
        </div>
      </div>
    )
  }

  // ============================================
  // ERROR STATE
  // ============================================

  if (error || !problem) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-xl text-destructive">{error || 'Problem not found'}</p>
          <Button onClick={() => router.push('/problems')}>
            Back to Problems
          </Button>
        </div>
      </div>
    )
  }

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="caffeine-theme h-screen w-full bg-background p-2">
      <style jsx global>{tabScrollStyles}</style>
      
      <ResizablePanelGroup direction="horizontal" className="h-full">
        
        {/* LEFT PANEL - Problem Description */}
        <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
          <ProblemDescription problem={problem} loading={loading} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* MIDDLE PANEL - Code Editor & Test Cases */}
        <ResizablePanel defaultSize={45} minSize={30}>
          <ResizablePanelGroup direction="vertical">
            
            {/* Code Editor */}
            <ResizablePanel defaultSize={65} minSize={30}>
            <CodeEditor 
              problem={problem}
              onAiChat={async (code, languageId) => {
                // This sets up a fake submission so the AI chat can open after Submit
                setAiSubmission({
                  code,
                  language: String(languageId),
                  timestamp: new Date(),
                  testsPassed: 0,
                  totalTests: 0,
                })
              }}
              onSubmit={handleCodeSubmission}  // keep for later Judge integration
              onRun={handleCodeRun}
            />
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Test Cases & Results */}
            <ResizablePanel defaultSize={35} minSize={20}>
              <TestCases 
                testcases={testcases}
                submissionResult={submissionResult}
              />
            </ResizablePanel>
            
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* RIGHT PANEL - AI Chatbot */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
        <AIChatbot 
          problemId={problem.id}
          problemTitle={problem.title}
          problemDescription={problem.description}
          problemDifficulty={problem.difficulty}
          submission={aiSubmission}                 // ← now unlocks after Submit
          onMessageSent={handleAIChatMessage}
        />
        </ResizablePanel>
        
      </ResizablePanelGroup>
    </div>
  )
}