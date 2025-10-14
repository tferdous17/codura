// components/problem/CodeEditorPanel.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Play, RotateCcw, Loader2, CloudUploadIcon } from 'lucide-react'
import Editor, { useMonaco } from '@monaco-editor/react'
import { LANGUAGES } from '@/utils/languages'
import TestCasesSection from './TestCasesSection'
import { createClient } from '@/utils/supabase/client'

// ============================================
// INTERFACES
// ============================================

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

interface SubmissionResult {
    status: string
    description: string
    testResults?: any[]
    totalTests?: number
    passedTests?: number
    memory?: string
    runtime?: string
}

interface CodeEditorPanelProps {
    problem: any
    testcases: any[] | undefined
    userLang: any
    setUserLang: (lang: any) => void
    usersCode: string | undefined
    setUsersCode: (code: string | undefined) => void
    getStarterCode: () => string
    onSubmissionComplete: (submission: Submission) => void
    onSubmit?: (code: string, languageId: number) => Promise<void>
    onRun?: (code: string, languageId: number) => Promise<void>
    onAiChat?: (code: string, languageId: number) => Promise<void>
}

export default function CodeEditorPanel({
    problem,
    testcases,
    userLang,
    setUserLang,
    usersCode,
    setUsersCode,
    getStarterCode,
    onSubmissionComplete,
    onSubmit,
    onRun,
    onAiChat
}: CodeEditorPanelProps) {
    const monaco = useMonaco()
    const supabase = createClient()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isRunning, setIsRunning] = useState(false)
    const [submissionResultLabel, setSubmissionResultLabel] = useState('')
    const [testcaseResults, setTestcaseResults] = useState<any[] | undefined>(undefined)
    const [activeBottomTab, setActiveBottomTab] = useState('testcases')
    const [submissionResult, setSubmissionResult] = useState<SubmissionResult | undefined>()

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

    // ✅ Handle editor changes
    const handleEditorChange = (value: string | undefined) => {
        setUsersCode(value)
    }

    const handleCodeRunning = async () => {
        if (!usersCode?.trim()) return
        
        setIsRunning(true)
        setActiveBottomTab('result')

        try {
            // ✅ NEW: If onRun callback provided (like old CodeEditor), use it
            if (onRun) {
                await onRun(usersCode, userLang.id)
                return
            }

            // ✅ EXISTING: Otherwise use the original backend call
            const body = {
                "problem_title_slug": problem?.title_slug,
                "language_id": userLang.id,
                "source_code": usersCode,
                "stdin": "test",
            }

            console.log('🟢 RUN Request:', body)

            const response = await fetch('http://localhost:8080/api/problems/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })

            const data = await response.json()
            console.log('🟢 RUN Response (full):', data)
            
            let results = []
            let label = ''
            
            if (data.testcaseResults) {
                console.log('✅ Found testcaseResults:', data.testcaseResults)
                results = data.testcaseResults.results || []
                label = data.testcaseResults.label || ''
            } else if (data.results) {
                console.log('✅ Found results directly:', data.results)
                results = data.results
                label = data.label || ''
            } else {
                console.error('❌ No test results found in response')
                console.log('Response keys:', Object.keys(data))
            }
            
            console.log('📊 Final results:', results)
            console.log('📊 Final label:', label)
            
            setSubmissionResultLabel(label)
            setTestcaseResults(results)
        } catch (error) {
            console.error('❌ Run error:', error)
        } finally {
            setIsRunning(false)
        }
    }

    const handleCodeSubmission = async () => {
        if (!usersCode?.trim()) return
        
        setIsSubmitting(true) 
        setActiveBottomTab('result')

        try {
            // ✅ NEW: If onAiChat callback provided (like old CodeEditor), use it first
            if (onAiChat) {
                await onAiChat(usersCode, userLang.id)
            } else if (onSubmit) {
                // ✅ NEW: Or if onSubmit callback provided, use it
                await onSubmit(usersCode, userLang.id)
                return
            }

            // ✅ EXISTING: Otherwise use the original backend call
            const { data: { session } } = await supabase.auth.getSession()
            
            const body = {
                "problem_title": problem?.title,
                "problem_title_slug": problem?.title_slug,
                "problem_id": problem?.id,
                "problem_difficulty": problem?.difficulty,
                "language": userLang.value,
                "language_id": userLang.id,
                "source_code": usersCode,
                "stdin": "test",
                "user_id": session?.user.id,
                "submitted_at": new Date().toISOString()
            }

            console.log('🟢 SUBMIT Request:', body)

            const response = await fetch('http://localhost:8080/api/problems/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })

            const responseData = await response.json()
            console.log('🟢 SUBMIT Response (full):', responseData)
            
            let results = []
            let label = ''
            let savedSubmission = null
            
            if (responseData.testcaseResults) {
                console.log('✅ Found testcaseResults:', responseData.testcaseResults)
                results = responseData.testcaseResults.results || []
                label = responseData.testcaseResults.label || ''
            } else if (responseData.results) {
                console.log('✅ Found results directly:', responseData.results)
                results = responseData.results
                label = responseData.label || ''
            } else {
                console.error('❌ No test results found in response')
                console.log('Response keys:', Object.keys(responseData))
            }
            
            savedSubmission = responseData.savedSubmission
            
            console.log('📊 Final results:', results)
            console.log('📊 Final label:', label)
            console.log('📊 Saved submission:', savedSubmission)
            
            setSubmissionResultLabel(label)
            setTestcaseResults(results)
            
            const testsPassed = results.filter((r: any) => r.status === 'pass').length
            const totalTests = results.length
            
            console.log(`📊 Tests: ${testsPassed}/${totalTests}`)
            
            // ✅ ALSO set submissionResult for TestCasesSection
            const submissionResultForDisplay: SubmissionResult = {
                status: savedSubmission?.status || (testsPassed === totalTests ? 'Accepted' : 'Wrong Answer'),
                description: label || '',
                testResults: results,
                totalTests: totalTests,
                passedTests: testsPassed,
                runtime: savedSubmission?.runtime,
                memory: savedSubmission?.memory
            }
            setSubmissionResult(submissionResultForDisplay)
            
            // ✅ Send submission data to parent
            const submissionForParent: Submission = {
                code: usersCode || '',
                language: userLang.value,
                timestamp: new Date(),
                testsPassed: testsPassed,
                totalTests: totalTests,
                status: savedSubmission?.status || (testsPassed === totalTests ? 'Accepted' : 'Wrong Answer'),
                runtime: savedSubmission?.runtime,
                memory: savedSubmission?.memory
            }
            
            console.log('📤 Sending submission to parent:', submissionForParent)
            onSubmissionComplete(submissionForParent)
            
        } catch (error) {
            console.error('❌ Submit error:', error)
            
            const errorSubmission: Submission = {
                code: usersCode || '',
                language: userLang.value,
                timestamp: new Date(),
                testsPassed: 0,
                totalTests: testcases?.length || 0,
                status: 'Error'
            }
            onSubmissionComplete(errorSubmission)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleReset = () => {
        const starterCode = getStarterCode()
        setUsersCode(starterCode)
    }

    const handleLanguageChange = (value: string) => {
        const selectedLang = LANGUAGES.find(lang => lang.value === value)
        if (selectedLang) {
            setUserLang(selectedLang)
        }
    }

    return (
        <ResizablePanelGroup direction="vertical">
            {/* Code Editor Section */}
            <ResizablePanel defaultSize={65} minSize={30}>
                <div className="h-full flex flex-col">
                    <div className="flex justify-between">
                        {/* Top Section - Language Selector and Action Buttons */}
                        <div className="border-b p-2 flex items-center gap-3">
                            <Select value={userLang.value} onValueChange={handleLanguageChange}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LANGUAGES.map((lang) => (
                                        <SelectItem key={lang.id} value={lang.value}>
                                            {lang.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button 
                                size="sm" 
                                className="cursor-pointer font-weight-300 text-sm text-zinc-300 bg-zinc-700 hover:bg-zinc-600"
                                onClick={handleCodeRunning} 
                                disabled={isRunning || isSubmitting}
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
                                disabled={isSubmitting || isRunning}
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
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className='cursor-pointer h-[70%]'
                                onClick={handleReset}
                            >
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
                                value={usersCode || getStarterCode()}
                                theme="caffeine-dark"
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
                                onChange={handleEditorChange}
                            />
                        </div>
                    </div>
                </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Bottom Section - Test Cases */}
            <ResizablePanel defaultSize={30} minSize={20}>
                <TestCasesSection 
                    testcases={testcases}
                    testcaseResults={testcaseResults}
                    activeBottomTab={activeBottomTab}
                    setActiveBottomTab={setActiveBottomTab}
                    submissionResult={submissionResult}
                />
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}