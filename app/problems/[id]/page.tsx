'use client'

import React, { useState, useEffect } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMonaco } from '@monaco-editor/react'

// Import separated components
import AIChatbot from '@/components/problems/AIChatbot'
import CodeEditorPanel from '@/components/problems/CodeEditorPanel'
import ProblemDescriptionPanel from '@/components/problems/ProblemDescriptionPanel'

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

interface Example {
  id: number
  content: string
}

interface TestCase {
  input: string
  expectedOutput: string
  explanation?: string
}

interface Submission {
  code: string
  language: string
  timestamp: Date
  testsPassed: number
  totalTests: number
  status?: string
  runtime?: string
  memory?: string
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const parseExamplesToTestCases = (examples: Example[] | undefined): TestCase[] => {
  if (!examples) {
    return []
  }

  return examples.map(example => {
    const content = example.content
      .replace(/&nbsp;/g, '')
      .trim();
    
    const inputMatch = content.match(/Input:\s*(.+?)(?=\nOutput:|$)/s);
    const input = inputMatch ? inputMatch[1].trim() : '';
    
    const outputMatch = content.match(/Output:\s*(.+?)(?=\nExplanation:|$)/s);
    const expectedOutput = outputMatch ? outputMatch[1].trim() : '';
    
    const explanationMatch = content.match(/Explanation:\s*(.+?)$/s);
    const explanation = explanationMatch ? explanationMatch[1].trim() : undefined;
    
    return {
      input,
      expectedOutput,
      explanation
    };
  });
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ProblemPage() {
  const params = useParams()
  const router = useRouter()
  const monaco = useMonaco()
  const supabase = createClient()

  // State management
  const [problem, setProblem] = useState<ProblemData | null>(null)
  const [testcases, setTestcases] = useState<TestCase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allOfUsersSubmissions, setAllOfUsersSubmissions] = useState<any[]>([])
  const [latestUserSubmission, setLatestUserSubmission] = useState(undefined)
  
  // Language and code state
  const [userLang, setUserLang] = useState({
    "id": 92,
    "name": "Python (3.11.2)",
    "value": "python"
  })
  const [usersCode, setUsersCode] = useState<string | undefined>(undefined)

  // State for AIChatbot submission
  const [aiSubmission, setAiSubmission] = useState<Submission | null>(null)

  // ============================================
  // PROOF THIS FILE IS RUNNING
  // ============================================
  useEffect(() => {
    console.log('🟢🟢🟢 PAGE.TSX IS LOADED AND RUNNING! 🟢🟢🟢')
  }, [])

  // Define custom Monaco theme
  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('caffeine-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: '', foreground: 'f2f2f2', background: '2d2d2d' },
          { token: 'comment', foreground: 'c5c5c5', fontStyle: 'italic' },
          { token: 'keyword', foreground: 'f4d394' },
          { token: 'string', foreground: 'a8d191' },
          { token: 'number', foreground: 'd4a5c7' },
          { token: 'function', foreground: '8ec8d8' },
          { token: 'variable', foreground: 'f2f2f2' },
          { token: 'type', foreground: '8ec8d8' },
          { token: 'class', foreground: 'f4d394' },
        ],
        colors: {
          'editor.background': '#2d2d2d',
          'editor.foreground': '#f2f2f2',
          'editor.lineHighlightBackground': '#3a3a3a',
          'editorLineNumber.foreground': '#c5c5c5',
          'editorLineNumber.activeForeground': '#f2f2f2',
          'editor.selectionBackground': '#404040',
          'editor.inactiveSelectionBackground': '#353535',
          'editorCursor.foreground': '#f4d394',
          'editorWhitespace.foreground': '#404040',
          'editorIndentGuide.background': '#404040',
          'editorIndentGuide.activeBackground': '#505050',
        }
      })
      monaco.editor.setTheme('caffeine-dark')
    }
  }, [monaco])

  // ============================================
  // DATA FETCHING
  // ============================================
  useEffect(() => {
    const fetchUsersSubmissions = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user?.id) return

        const { data, error } = await supabase
          .from('submissions')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('problem_id', params.id)
          .order('submitted_at', { ascending: false })
        
        if (error) {
          throw error
        }

        if (data) {
          setAllOfUsersSubmissions(data)
          console.log('📋 Loaded', data.length, 'submissions for problem', params.id)
        }
        
      } catch (err) {
        console.error('Error fetching user submissions: ', err)
      }
    }
    
    fetchUsersSubmissions()
  }, [latestUserSubmission, params.id, supabase])

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true)
        console.log('🔍 Fetching problem with ID:', params.id)

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

        console.log('✅ Problem loaded:', data.title)
        setProblem(data as ProblemData)
        setTestcases(parseExamplesToTestCases(data.examples))

        // Initialize user code with starter code if not already set
        if (!usersCode) {
          const starterCode = data.code_snippets?.find((snippet: any) => 
            snippet.langSlug === userLang.value
          )?.code || ''
          setUsersCode(starterCode)
        }

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

  // Update code when language changes
  useEffect(() => {
    if (problem && problem.code_snippets) {
      const starterCode = problem.code_snippets.find(snippet => 
        snippet.langSlug === userLang.value
      )?.code || ''
      setUsersCode(starterCode)
    }
  }, [userLang.value, problem])

  // ============================================
  // DEBUG: Log state changes
  // ============================================
  useEffect(() => {
    if (aiSubmission) {
      console.log('🎉 AI SUBMISSION STATE UPDATED!')
      console.log('   Tests:', aiSubmission.testsPassed, '/', aiSubmission.totalTests)
      console.log('   Status:', aiSubmission.status)
      console.log('   Code length:', aiSubmission.code?.length)
    }
  }, [aiSubmission])

  // ============================================
  // EVENT HANDLERS
  // ============================================

  /**
   * Get the starter code for the selected programming language.
   */
  const getStarterCode = () => {
    if (problem?.code_snippets) {
      return problem.code_snippets.find(snippet => {
        return snippet.langSlug === userLang.value
      })?.code || ''
    }
    return ''
  }

  /**
   * ✅ Handle AI chat messages
   */
  const handleAIChatMessage = (message: string) => {
    console.log('💬 User sent message to AI:', message)
  }

  /**
   * 🔥 Handle submission completion from CodeEditorPanel
   * This is called AFTER backend saves submission to database
   */
  const handleSubmissionComplete = async (submission: Submission) => {
    console.log('╔' + '═'.repeat(60) + '╗')
    console.log('║  ✅ PAGE.TSX: handleSubmissionComplete CALLED!           ║')
    console.log('╠' + '═'.repeat(60) + '╣')
    console.log('║  📦 Submission Data:')
    console.log('║     - Code:', submission.code?.slice(0, 30) + '...')
    console.log('║     - Language:', submission.language)
    console.log('║     - Tests:', submission.testsPassed, '/', submission.totalTests)
    console.log('║     - Status:', submission.status)
    console.log('╠' + '═'.repeat(60) + '╣')
    console.log('║  🚀 Unlocking AI chatbot with submission...             ║')
    console.log('╚' + '═'.repeat(60) + '╝')
    
    // ✅ Set aiSubmission to unlock chatbot
    // The AIChatbot will automatically call /api/ai/initial-analysis when it receives this
    setAiSubmission(submission)
    
    // Trigger re-fetch of user submissions for left panel
    setLatestUserSubmission(undefined)
  }

  // ============================================
  // LOADING & ERROR STATES
  // ============================================
  if (loading) {
    console.log('⏳ Loading problem...')
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-muted-foreground">Loading problem...</p>
        </div>
      </div>
    )
  }

  if (error || !problem) {
    console.log('❌ Error or no problem:', error)
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
  console.log('🔄 Rendering ProblemPage')
  console.log('   AI Submission:', aiSubmission ? 'SET ✓' : 'NULL ✗')
  if (aiSubmission) {
    console.log('   AI Submission Status:', aiSubmission.status)
    console.log('   AI Submission Tests:', `${aiSubmission.testsPassed}/${aiSubmission.totalTests}`)
  }

  return (
    <div className="caffeine-theme h-screen w-full bg-background p-2 pt-0">
      <style jsx global>{tabScrollStyles}</style>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        
        {/* LEFT PANEL - Problem Description */}
        <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
          <ProblemDescriptionPanel 
            problem={problem} 
            allOfUsersSubmissions={allOfUsersSubmissions}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* MIDDLE PANEL - Code Editor & Test Cases */}
        <ResizablePanel defaultSize={45} minSize={30}>
          <CodeEditorPanel 
            problem={problem}
            testcases={testcases}
            userLang={userLang}
            setUserLang={setUserLang}
            usersCode={usersCode}
            setUsersCode={setUsersCode}
            getStarterCode={getStarterCode}
            onSubmissionComplete={handleSubmissionComplete}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* RIGHT PANEL - AI Chatbot */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
          <AIChatbot 
            problemId={problem.id}
            problemTitle={problem.title}
            problemDescription={problem.description}
            problemDifficulty={problem.difficulty}
            submission={aiSubmission}
            onMessageSent={handleAIChatMessage}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}