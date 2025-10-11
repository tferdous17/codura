'use client'
/**
 * This is the main problem page component that displays the problem description,
 * code editor, test cases, and an AI chatbot for assistance.
 * It uses a three-panel layout with resizable panels.
 * 
 * The left panel contains tabs for problem description, solution, discussion, community solutions, and submissions.
 * The middle panel contains a code editor with language selection and test case management.
 * The right panel contains an AI chatbot that can assist with problem understanding and coding help.
 * 
 * The component fetches problem data from Supabase based on the problem ID from the URL parameters.
 * It also defines a custom Monaco theme to match the Caffeine theme used in the app.
 */
import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Play, Send, RotateCcw, Loader2, CopyCheck, CloudUploadIcon, ListChecks, ChevronDown } from 'lucide-react'
import Editor, { useMonaco } from '@monaco-editor/react'
import { createClient } from '@/utils/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { LANGUAGES } from '@/utils/languages'
import { ChevronUp } from 'lucide-react'
import { Tag } from 'lucide-react'
import { MessageCircle } from 'lucide-react'


// Add custom styles for tab scrolling
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

/**
 * ProblemData interface defines the structure of the problem data fetched from Supabase.
 * In other words, it's an object that contains all the relevant information about a coding problem,
 * including its ID, title, difficulty, description, examples, constraints, topic tags, acceptance rate,
 * and optional starter code in various programming languages.
 */
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

interface TestcaseResult {
    actual: any
    expected: any 
    input: any
    message: string
    status: string
    testNumber: number
}

export default function ProblemPage() {
    const params = useParams()
    const router = useRouter()
    const monaco = useMonaco()
    const supabase = createClient()

    // problem state will be used to store the fetched problem data from Supabase
    const [problem, setProblem] = useState<ProblemData | null>(null)
    const [testcases, setTestcases] = useState<TestCase[]| undefined>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showTags, setShowTags] = useState(false)
    const [showAcceptanceRate, setShowAcceptanceRate] = useState(false)
    const [activeTab, setActiveTab] = useState('testcases')

    const [userLang, setUserLang] = useState({
        "id": 92,
        "name": "Python (3.11.2)",
        "value": "python"
    })
    const [usersCode, setUsersCode] = useState<string | undefined>('# Write your code below')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isRunning, setIsRunning] = useState(false)
    const [submissionResultLabel, setSubmissionResultLabel] = useState('')
    const [testcaseResults, setTestcaseResults] = useState<TestcaseResult[] | undefined>(undefined)

    // State for AI Chatbot that maintains chat messages and input
    const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai', content: string }>>([])
    const [chatInput, setChatInput] = useState('')
    const [selectedLanguage, setSelectedLanguage] = useState('python')



    // Fetch problem data from Supabase
    useEffect(() => {
        const fetchProblem = async () => {
            try {
                setLoading(true)

                // fetch problem data from Supabase using the problem ID from URL params
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

                // After fetching the problem data, this line sets the problem state
                setProblem(data as ProblemData)
                setTestcases(parseExamplesToTestCases(data.examples))

            } catch (err) {
                console.error('Error fetching problem:', err)
                setError('Failed to load problem')
            } finally {
                setLoading(false)
            }
        }

        // Only fetch if params.id is available
        if (params.id) {
            fetchProblem()
        }
    }, [params.id])

    // Define custom Monaco theme matching Caffeine theme
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

    const parseExamplesToTestCases = (examples: Example[] | undefined): TestCase[] => {
        if (!examples) {
            return []
        }

        return examples.map(example => {
            const content = example.content
                .replace(/&nbsp;/g, '')
                .trim();
            
            // Extract input
            const inputMatch = content.match(/Input:\s*(.+?)(?=\nOutput:|$)/s);
            const input = inputMatch ? inputMatch[1].trim() : '';
            
            // Extract output
            const outputMatch = content.match(/Output:\s*(.+?)(?=\nExplanation:|$)/s);
            const expectedOutput = outputMatch ? outputMatch[1].trim() : '';
            
            // Extract explanation (optional)
            const explanationMatch = content.match(/Explanation:\s*(.+?)$/s);
            const explanation = explanationMatch ? explanationMatch[1].trim() : undefined;
            
            return {
                input,
                expectedOutput,
                explanation
            };
        });
    }

    const handleCodeRunning = async () => {
        setIsRunning(true)
        setActiveTab('result')

        try {
            const body = {
                "problem_title_slug": problem?.title_slug,
                "language_id": userLang.id,
                "source_code": usersCode,
                "stdin": "test",
            }

            const response = await fetch('http://localhost:8080/api/problems/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })

            const data = await response.json()
            const submissionResponse = data.submissionResponse
            const results = data.results
            
            setSubmissionResultLabel(submissionResponse.status.description)
            setTestcaseResults(results)
        } catch (error) {
            throw error
        } finally {
            setIsRunning(false)
        }
    }

    const handleCodeSubmission = async () => {
        setIsSubmitting(true) 
        setActiveTab('result')
        
        // commit: wrapped in try catch now and now btn as loading state
        try {
            const body = {
                "problem_title_slug": problem?.title_slug,
                "language_id": userLang.id,
                "source_code": usersCode,
                "stdin": "test",
            }

            const response = await fetch('http://localhost:8080/api/problems/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })

            const data = await response.json()
            const submissionResponse = data.submissionResponse
            const results = data.results
            
            setSubmissionResultLabel(submissionResponse.status.description)
            setTestcaseResults(results)

            // Need to put additional code to actually save submission to supabase later
        } catch (error) {
            throw error
        } finally {
            setIsSubmitting(false)
        }
    }

    // Temporary function to simulate AI response
    const handleSendMessage = () => {
        if (chatInput.trim()) {
            // Add user message to setChatMessages array
            setChatMessages([...chatMessages, { role: 'user', content: chatInput }])
            setChatInput('')

            // Simulate AI response
            setTimeout(() => {
                setChatMessages(prev => [...prev, { role: 'ai', content: 'I can help you solve this problem. What would you like to know?' }])
            }, 1000)
        }
    }

    /**
     * Get the background color for the problem difficulty level.
     * @param difficulty - The difficulty level of the problem (Easy, Medium, Hard)
     * @returns 
     */
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


    /**
     * Get the starter code for the selected programming language.
     * @returns The getStarterCode function returns the starter code for the selected programming language.
     * If no starter code is available for the selected language, it returns a default comment.
     */
    const getStarterCode = () => {
        if (problem?.code_snippets) {
            // look through each code snipet and match up w/ current selected lang
            return problem.code_snippets.find(snippet => {
                return snippet.langSlug === userLang.value
            })?.code
        }
        return ''
    }


    // Render loading, error, or main content based on state
    if (loading) {
        return (
            <div className="h-screen w-full bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p className="text-muted-foreground">Loading problem...</p>
                </div>
            </div>
        )
    }

    // Render error message if there's an error or problem not found
    if (error || !problem) {
        return (
            <div className="h-screen w-full bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <p className="text-xl text-destructive">{error || 'Problem not found'}</p>
                    <Button onClick={() => router.push('/problems')}>Back to Problems</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="caffeine-theme h-screen w-full bg-background p-2 pt-0">
            <style jsx global>{tabScrollStyles}</style>
            <ResizablePanelGroup direction="horizontal" className="h-full">
                
                {/* Left Panel - Problem Description with Tabs */}
                <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
                    <div className="h-full flex flex-col">
                        <Tabs defaultValue="description" className="flex-1 flex flex-col">
                            <div className="border-b border-zinc-800/50">
                                <TabsList className="inline-flex w-auto min-w-full justify-start h-auto px-6 bg-transparent gap-6">
                                    {['Description', 'Solution', 'Discussion', 'Community', 'Submissions'].map(tab => (
                                        <TabsTrigger 
                                            key={tab.toLowerCase()}
                                            value={tab.toLowerCase()} 
                                            className="cursor-pointer relative flex-shrink-0 !bg-transparent data-[state=active]:!bg-transparent border-0 rounded-none px-3 pb-3 pt-4 !text-zinc-500 data-[state=active]:!text-white hover:!text-zinc-300 transition-all font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-white after:to-transparent after:opacity-0 data-[state=active]:after:opacity-80 after:transition-opacity after:shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                        >
                                            {tab}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>

                            <ScrollArea className="flex-1">
                                {/* Description Tab */}
                                <TabsContent value="description" className="p-4 mt-0">
                                    <div className="space-y-4">
                                        <div>
                                            <h1 className="text-2xl font-bold mb-5">
                                                {problem.leetcode_id}. {problem.title}
                                            </h1>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="default" className={`${getDifficultyColor(problem.difficulty)} border-1`}>
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

                                        {/* Topics */}
                                        {problem.topic_tags && problem.topic_tags.length > 0 && (
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
                                                {problem.topic_tags.map((tag) => (
                                                <Badge key={tag.slug} variant="secondary" className="text-xs">
                                                    {tag.name}
                                                </Badge>
                                                ))}
                                            </div>
                                            )}
                                        </div>
                                        )}

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <div
                                                className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none"
                                                dangerouslySetInnerHTML={{ __html: problem.description }}
                                            />
                                        </div>

                                        {/* Examples */}
                                        {problem.examples && problem.examples.length > 0 && (
                                            <div className="space-y-4">
                                                {/* {problem.examples.map((example, index) => (
                                                    <div key={index} className="space-y-2">
                                                        <h3 className="font-semibold">Example {index + 1}:</h3>
                                                        <div className="bg-muted p-3 rounded text-sm font-mono space-y-1">
                                                            <p><strong>Input:</strong> {example.input}</p>
                                                            <p><strong>Output:</strong> {example.output}</p>
                                                            {example.explanation && (
                                                                <p><strong>Explanation:</strong> {example.explanation}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))} */}
                                            </div>
                                        )}

                                        {/* Constraints */}
                                        {problem.constraints && problem.constraints.length > 0 && (
                                            <div className="space-y-2">
                                                <h3 className="font-semibold">Constraints:</h3>
                                                <div className="bg-green-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                                                    <ul className="space-y-1 text-sm font-mono text-slate-700 dark:text-slate-300">
                                                        {problem.constraints.map((constraint, index) => (
                                                            <li key={index}>{constraint}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                        </div>
                                        )}
                                    </div>
                                </TabsContent>

                                {/* Solution Tab */}
                                <TabsContent value="solution" className="p-4 mt-0">
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-bold">Solution Approach</h2>
                                        <p className="text-sm text-muted-foreground">
                                            The solution content will go here. This could include optimal approaches, time complexity analysis, and step-by-step explanations.
                                        </p>
                                    </div>
                                </TabsContent>

                                {/* Community Discussions Tab */}
                                <TabsContent value="discussion" className="p-4 mt-0">
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-bold">Discussion</h2>
                                        <p className="text-sm text-muted-foreground">
                                            Community discussions will appear here.
                                        </p>
                                    </div>
                                </TabsContent>

                                {/* Community Solutions Tab */}
                                <TabsContent value="community" className="p-4 mt-0">
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-bold">Community Solutions</h2>
                                        <p className="text-sm text-muted-foreground">
                                            Top community solutions will be displayed here.
                                        </p>
                                    </div>
                                </TabsContent>

                                {/* User's Submissions Tab*/}
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
                    <ResizablePanelGroup direction="vertical">
                        {/* Code Editor Section */}
                        <ResizablePanel defaultSize={65} minSize={30}>
                            <div className="h-full flex flex-col">
                                <div className="flex justify-between">
                                    {/* Top Section - Language Selector and Action Buttons */}
                                    <div className="border-b p-2 flex items-center gap-3">
                                        <Select value={userLang.value} onValueChange={(value) => {
                                            const selectedLang = LANGUAGES.find(lang => lang.value == value);
                                            if (selectedLang) {
                                                setUserLang(selectedLang)
                                            }
                                        }}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select Language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {LANGUAGES.map((lang) => {
                                                    return <SelectItem key={lang.id} value={lang.value}>
                                                        {lang.name}
                                                    </SelectItem>
                                                })}
                                            </SelectContent>
                                        </Select>

                                        <Button 
                                            size="sm" 
                                            className="cursor-pointer font-weight-300 text-sm text-zinc-300 bg-zinc-700 hover:bg-zinc-600"
                                            onClick={handleCodeRunning} 
                                            disabled={isRunning}
                                        >
                                            {isRunning ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Running...
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-5 h-5" />
                                                    Run
                                                </>
                                            )}
                                                
                                        </Button>

                                        <Button 
                                            size="sm" 
                                            className="cursor-pointer font-weight-300 text-sm bg-green-500 hover:bg-green-400" 
                                            onClick={handleCodeSubmission}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <CloudUploadIcon className="w-5 h-5" />
                                                    Submit
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    <div className="flex items-center">
                                        <Button variant="outline" size="sm" className='cursor-pointer h-[70%]'>
                                            <RotateCcw className="w-4 h-4 mr-2" />
                                            Reset
                                        </Button>
                                    </div>
                                </div>


                                {/* Code Editor Area */}
                                <div className="flex-1 bg-muted/30 p-4">
                                    <div className="h-full border rounded-lg bg-background/50 overflow-hidden">
                                        <Editor
                                        height={'100%'}
                                        language={userLang.value}
                                        value={getStarterCode()}
                                        theme="vs-dark"
                                        options={{
                                            fontSize: 14,
                                            fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
                                            minimap: { enabled: false },
                                            scrollBeyondLastLine: false,
                                            lineNumbers: 'on',
                                            renderLineHighlight: 'line',
                                            cursorBlinking: 'blink',
                                            cursorStyle: 'line',
                                            smoothScrolling: true,
                                            padding: { top: 12, bottom: 12 },
                                            automaticLayout: true,
                                            wordWrap: 'off',
                                            lineDecorationsWidth: 8,
                                            lineNumbersMinChars: 3,
                                            glyphMargin: false,
                                            folding: true,
                                            renderWhitespace: 'none',
                                            scrollbar: {
                                                vertical: 'visible',
                                                horizontal: 'visible',
                                                useShadows: false,
                                                verticalScrollbarSize: 10,
                                                horizontalScrollbarSize: 10,
                                            },
                                            suggest: {
                                                showKeywords: true,
                                                showSnippets: true,
                                            },
                                            quickSuggestions: {
                                                other: true,
                                                comments: false,
                                                strings: false,
                                            },
                                            tabSize: 4,
                                            insertSpaces: true,
                                            detectIndentation: false,
                                            bracketPairColorization: {
                                                enabled: true,
                                            },
                                        }}
                                        onChange={(value: string | undefined) => setUsersCode(value || '')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        {/* Bottom Section - Test Cases */}
                        <ResizablePanel defaultSize={30} minSize={20}>
                            <div className="h-full border-t">
                                <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="testcases" className="w-full h-full flex flex-col">
                                    <div className="border-b overflow-x-auto tab-scroll-container">
                                        <TabsList className="inline-flex w-auto justify-start h-10">
                                            <TabsTrigger value="testcases" className="px-4 flex-shrink-0 cursor-pointer !text-zinc-500 data-[state=active]:!text-white"><CopyCheck className="text-green-600"></CopyCheck>Testcases</TabsTrigger>
                                            <TabsTrigger value="result" className="px-4 flex-shrink-0 cursor-pointer !text-zinc-500 data-[state=active]:!text-white"><ListChecks className="text-green-600"></ListChecks>Results</TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <TabsContent value="testcases" className="flex-1 overflow-auto flex flex-col">
                                        {testcases && testcases.length > 0 && (
                                            <Tabs defaultValue="case-0" className="flex-1 flex flex-col">
                                            {/* Test case tabs */}
                                            <TabsList className="justify-start rounded-none bg-transparent px-1 h-auto">
                                                {testcases.map((_, index) => (
                                                <TabsTrigger
                                                    key={index}
                                                    value={`case-${index}`}
                                                    className="cursor-pointer rounded-xl border-none border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                                                >
                                                    Case {index + 1}
                                                </TabsTrigger>
                                                ))}
                                            </TabsList>

                                            {/* Test case content */}
                                            {testcases.map((tc, index) => (
                                                <TabsContent 
                                                key={index} 
                                                value={`case-${index}`} 
                                                className="flex-1 overflow-auto p-4 space-y-3"
                                                >
                                                {/* Each parameter in its own box */}
                                                {tc.input.split(', ').map((param, i) => {
                                                    const [name, value] = param.split(' = ');
                                                    return (
                                                    <div key={i} className="space-y-1">
                                                        <div className="text-sm text-zinc-400">{name}</div>
                                                        <div className="bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2.5 font-mono text-[15px] text-white">
                                                        {value}
                                                        </div>
                                                    </div>
                                                    );
                                                })}
                                                </TabsContent>
                                            ))}
                                            </Tabs>
                                        )}
                                        </TabsContent>

                                    <TabsContent value="result" className="flex-1 overflow-auto flex flex-col">
                                        {!testcaseResults || testcaseResults.length === 0 ? (
                                            <div className="p-4">
                                            <div className="bg-muted p-3 rounded text-sm">
                                                <p className="text-muted-foreground">Run your code to see results here</p>
                                            </div>
                                            </div>
                                        ) : (
                                            <>
                                            {/* Overall Status Header */}
                                            <div className="p-4 border-b">
                                                {testcaseResults.every((r: any) => r.status === 'pass') ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    </div>
                                                    <span className="text-green-500 font-semibold">Accepted</span>
                                                </div>
                                                ) : (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    </div>
                                                    <span className="text-red-500 font-semibold">Wrong Answer</span>
                                                </div>
                                                )}
                                                <div className="mt-2 text-sm text-muted-foreground">
                                                {testcaseResults.filter((r: any) => r.status === 'pass').length} / {testcaseResults.length} test cases passed
                                                </div>
                                            </div>

                                            {/* Test Case Tabs */}
                                            <Tabs defaultValue="case-0" className="flex-1 flex flex-col">
                                                <TabsList className="justify-start rounded-none bg-transparent px-1 h-auto border-b">
                                                {testcaseResults.map((result: any, index: number) => (
                                                    <TabsTrigger
                                                    key={index}
                                                    value={`case-${index}`}
                                                    className="cursor-pointer rounded-xl border-none border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 relative"
                                                    >
                                                    <span className="flex items-center gap-2">
                                                        Case {index + 1}
                                                        {result.status === 'pass' ? (
                                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                        ) : result.status === 'fail' ? (
                                                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                        ) : (
                                                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                                        )}
                                                    </span>
                                                    </TabsTrigger>
                                                ))}
                                                </TabsList>

                                                {/* Test Case Results */}
                                                {testcaseResults.map((result: any, index: number) => (
                                                <TabsContent 
                                                    key={index} 
                                                    value={`case-${index}`} 
                                                    className="flex-1 overflow-auto p-4 space-y-3"
                                                >
                                                    {/* Status Badge */}
                                                    <div className="mb-4">
                                                    {result.status === 'pass' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-medium">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Passed
                                                        </span>
                                                    ) : result.status === 'fail' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-sm font-medium">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Failed
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-sm font-medium">
                                                        Error
                                                        </span>
                                                    )}
                                                    </div>

                                                    {/* Input Section */}
                                                    {result.input && Object.entries(result.input).map(([key, value]: [string, any]) => (
                                                    <div key={key} className="space-y-1">
                                                        <div className="text-sm text-zinc-400">{key} =</div>
                                                        <div className="bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2.5 font-mono text-[15px] text-white">
                                                        {JSON.stringify(value)}
                                                        </div>
                                                    </div>
                                                    ))}

                                                    {/* Output Section */}
                                                    {result.status === 'fail' && (
                                                    <>
                                                        <div className="space-y-1">
                                                        <div className="text-sm text-zinc-400">Output</div>
                                                        <div className="bg-zinc-950 border border-red-500/50 rounded-md px-3 py-2.5 font-mono text-[15px] text-red-400">
                                                            {JSON.stringify(result.actual)}
                                                        </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                        <div className="text-sm text-zinc-400">Expected</div>
                                                        <div className="bg-zinc-950 border border-green-500/50 rounded-md px-3 py-2.5 font-mono text-[15px] text-green-400">
                                                            {JSON.stringify(result.expected)}
                                                        </div>
                                                        </div>
                                                    </>
                                                    )}

                                                    {result.status === 'pass' && (
                                                    <div className="space-y-1">
                                                        <div className="text-sm text-zinc-400">Expected</div>
                                                        <div className="bg-zinc-950 border border-green-500/50 rounded-md px-3 py-2.5 font-mono text-[15px] text-green-400">
                                                        {JSON.stringify(result.expected)}
                                                        </div>
                                                    </div>
                                                    )}

                                                    {/* Error Message */}
                                                    {result.status === 'error' && (
                                                    <div className="space-y-1">
                                                        <div className="text-sm text-zinc-400">Error</div>
                                                        <div className="bg-zinc-950 border border-yellow-500/50 rounded-md px-3 py-2.5 font-mono text-[13px] text-yellow-400">
                                                        {result.message}
                                                        </div>
                                                    </div>
                                                    )}
                                                </TabsContent>
                                                ))}
                                            </Tabs>
                                            </>
                                        )}
                                        </TabsContent>
                                </Tabs>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Right Panel - AI Chatbot */}
                <ResizablePanel defaultSize={20} minSize={20} maxSize={35}>
                    <div className="h-full flex flex-col bg-zinc-950 border-l border-zinc-800">
                        {/* Codura A.I Header */}
                        <div className="border-b border-zinc-800 px-4 py-3 bg-zinc-900/50">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <h3 className="text-sm font-semibold text-zinc-100">Codura AI</h3>
                            </div>
                            <p className="text-xs text-zinc-500 mt-0.5">Your coding assistant</p>
                        </div>

                        {/* Chat Messages */}
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {chatMessages.length === 0 ? (
                                    <div className="text-center py-12 px-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                            <MessageCircle className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <p className="text-zinc-300 text-sm font-medium mb-3">
                                            Ask me anything about this problem!
                                        </p>
                                        <div className="space-y-2 text-xs text-zinc-500">
                                            <div className="flex items-center gap-2 justify-center">
                                                <div className="w-1 h-1 rounded-full bg-zinc-600"></div>
                                                <span>Understanding the problem</span>
                                            </div>
                                            <div className="flex items-center gap-2 justify-center">
                                                <div className="w-1 h-1 rounded-full bg-zinc-600"></div>
                                                <span>Approach suggestions</span>
                                            </div>
                                            <div className="flex items-center gap-2 justify-center">
                                                <div className="w-1 h-1 rounded-full bg-zinc-600"></div>
                                                <span>Code explanations</span>
                                            </div>
                                            <div className="flex items-center gap-2 justify-center">
                                                <div className="w-1 h-1 rounded-full bg-zinc-600"></div>
                                                <span>Debugging help</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    chatMessages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm ${
                                                    message.role === 'user'
                                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                                        : 'bg-zinc-900 text-zinc-100 border border-zinc-800'
                                                }`}
                                            >
                                                <div className="whitespace-pre-wrap">{message.content}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>

                        {/* Chat Input */}
                        <div className="border-t border-zinc-800 p-4 bg-zinc-900/30">
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
                                    className="min-h-[80px] resize-none bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-sm text-zinc-100 placeholder:text-zinc-600"
                                />
                                <Button 
                                    onClick={handleSendMessage} 
                                    size="icon" 
                                    className="cursor-pointer self-end bg-primary shadow-lg shadow-primary/20"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}
