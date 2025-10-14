// components/problem/TestCasesSection.tsx
'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CopyCheck, ListChecks, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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

interface SubmissionResult {
    status: string
    description: string
    testResults?: any[]
    totalTests?: number
    passedTests?: number
    memory?: string
    runtime?: string
}

interface TestCasesSectionProps {
    testcases: TestCase[] | undefined
    testcaseResults?: TestcaseResult[] | undefined
    activeBottomTab: string
    setActiveBottomTab: (tab: string) => void
    submissionResult?: SubmissionResult
}

export default function TestCasesSection({
    testcases,
    testcaseResults,
    activeBottomTab,
    setActiveBottomTab,
    submissionResult
}: TestCasesSectionProps) {
    return (
        <div className="h-full border-t">
            <Tabs value={activeBottomTab} onValueChange={setActiveBottomTab} defaultValue="testcases" className="w-full h-full flex flex-col">
                <div className="border-b overflow-x-auto tab-scroll-container">
                    <TabsList className="inline-flex w-auto justify-start h-10">
                        <TabsTrigger value="testcases" className="px-4 flex-shrink-0 cursor-pointer !text-zinc-500 data-[state=active]:!text-white">
                            <CopyCheck className="text-green-600 w-4 h-4 mr-2" />
                            Testcases
                        </TabsTrigger>
                        <TabsTrigger value="result" className="px-4 flex-shrink-0 cursor-pointer !text-zinc-500 data-[state=active]:!text-white">
                            <ListChecks className="text-green-600 w-4 h-4 mr-2" />
                            Results
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Test Cases Tab */}
                <TabsContent value="testcases" className="flex-1 overflow-auto flex flex-col m-0">
                    {testcases && testcases.length > 0 ? (
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
                                    <TestCaseContent testCase={tc} />
                                </TabsContent>
                            ))}
                        </Tabs>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-4">
                            <p className="text-sm text-muted-foreground">No test cases available</p>
                        </div>
                    )}
                </TabsContent>

                {/* Results Tab */}
                <TabsContent value="result" className="flex-1 overflow-auto flex flex-col m-0">
                    {/* Priority: submissionResult > testcaseResults > empty state */}
                    {submissionResult ? (
                        <SubmissionResultDisplay submissionResult={submissionResult} />
                    ) : testcaseResults && testcaseResults.length > 0 ? (
                        <TestcaseResultsDisplay testcaseResults={testcaseResults} />
                    ) : (
                        <div className="p-4">
                            <div className="bg-muted p-3 rounded text-sm">
                                <p className="text-muted-foreground">Run your code to see results here</p>
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}

// ============================================
// SUB-COMPONENTS
// ============================================

function TestCaseContent({ testCase }: { testCase: TestCase }) {
    // Parse input parameters
    const params = testCase.input.split(', ')
    
    return (
        <>
            {/* Input Parameters */}
            {params.map((param, i) => {
                const [name, value] = param.split(' = ')
                return (
                    <div key={i} className="space-y-1">
                        <div className="text-sm text-zinc-400">{name}</div>
                        <div className="bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2.5 font-mono text-[15px] text-white">
                            {value}
                        </div>
                    </div>
                )
            })}

            {/* Expected Output */}
            {testCase.expectedOutput && (
                <div className="space-y-1 mt-4">
                    <div className="text-sm text-zinc-400">Expected Output</div>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2.5 font-mono text-[15px] text-white">
                        {testCase.expectedOutput}
                    </div>
                </div>
            )}

            {/* Explanation */}
            {testCase.explanation && (
                <div className="space-y-1 mt-4">
                    <div className="text-sm text-zinc-400">Explanation</div>
                    <div className="bg-zinc-950/50 border border-zinc-800 rounded-md px-3 py-2.5 text-sm text-zinc-300">
                        {testCase.explanation}
                    </div>
                </div>
            )}
        </>
    )
}

// ============================================
// TESTCASE RESULTS DISPLAY (Original format)
// ============================================

function TestcaseResultsDisplay({ testcaseResults }: { testcaseResults: TestcaseResult[] }) {
    return (
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
                                    <CheckCircle2 className="w-4 h-4" />
                                    Passed
                                </span>
                            ) : result.status === 'fail' ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-sm font-medium">
                                    <XCircle className="w-4 h-4" />
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
    )
}

// ============================================
// SUBMISSION RESULT DISPLAY (AI Chatbot format)
// ============================================

function SubmissionResultDisplay({ submissionResult }: { submissionResult: SubmissionResult }) {
    const isSuccess = submissionResult.status === 'Accepted' || 
                     submissionResult.passedTests === submissionResult.totalTests

    return (
        <div className="p-4 space-y-4">
            {/* Overall Status */}
            <div className={`p-4 rounded-lg border ${
                isSuccess 
                    ? 'bg-green-950/30 border-green-900' 
                    : 'bg-red-950/30 border-red-900'
            }`}>
                <div className="flex items-center gap-3 mb-2">
                    {isSuccess ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                    )}
                    <h3 className={`text-lg font-bold ${
                        isSuccess ? 'text-green-400' : 'text-red-400'
                    }`}>
                        {submissionResult.status}
                    </h3>
                </div>
                
                {submissionResult.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                        {submissionResult.description}
                    </p>
                )}
                
                {submissionResult.totalTests !== undefined && (
                    <div className="flex items-center gap-2">
                        <Badge variant={isSuccess ? "default" : "destructive"}>
                            {submissionResult.passedTests || 0} / {submissionResult.totalTests} test cases passed
                        </Badge>
                    </div>
                )}
            </div>

            {/* Performance Metrics */}
            {(submissionResult.runtime || submissionResult.memory) && (
                <div className="grid grid-cols-2 gap-3">
                    {submissionResult.runtime && (
                        <div className="bg-muted p-3 rounded-lg border">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-4 h-4 text-blue-400" />
                                <span className="text-xs text-zinc-400">Runtime</span>
                            </div>
                            <p className="text-sm font-mono font-semibold">
                                {submissionResult.runtime}
                            </p>
                        </div>
                    )}
                    
                    {submissionResult.memory && (
                        <div className="bg-muted p-3 rounded-lg border">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-zinc-400">Memory</span>
                            </div>
                            <p className="text-sm font-mono font-semibold">
                                {submissionResult.memory}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Individual Test Results */}
            {submissionResult.testResults && submissionResult.testResults.length > 0 && (
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Test Case Results:</h4>
                    {submissionResult.testResults.map((result: any, index: number) => (
                        <TestResultCard key={index} result={result} index={index} />
                    ))}
                </div>
            )}
        </div>
    )
}

function TestResultCard({ result, index }: { result: any; index: number }) {
    const passed = result.passed || result.status === 'pass'
    
    return (
        <div className={`p-3 rounded-lg border ${
            passed 
                ? 'bg-green-950/20 border-green-900/50' 
                : 'bg-red-950/20 border-red-900/50'
        }`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    {passed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm font-semibold">
                        Test Case {index + 1}
                    </span>
                </div>
                {result.executionTime && (
                    <span className="text-xs text-muted-foreground">
                        {result.executionTime}ms
                    </span>
                )}
            </div>
            
            <div className="space-y-2 text-xs">
                {result.input && (
                    <div>
                        <span className="text-zinc-400">Input: </span>
                        <span className="font-mono">{JSON.stringify(result.input)}</span>
                    </div>
                )}
                
                {(result.expectedOutput || result.expected) && (
                    <div>
                        <span className="text-zinc-400">Expected: </span>
                        <span className="font-mono text-green-400">
                            {JSON.stringify(result.expectedOutput || result.expected)}
                        </span>
                    </div>
                )}
                
                {(result.actualOutput || result.actual) && (
                    <div>
                        <span className="text-zinc-400">Got: </span>
                        <span className={`font-mono ${
                            passed ? 'text-green-400' : 'text-red-400'
                        }`}>
                            {JSON.stringify(result.actualOutput || result.actual)}
                        </span>
                    </div>
                )}
                
                {result.error && (
                    <div className="mt-2 p-2 bg-red-950/30 rounded text-red-400">
                        <span className="font-semibold">Error: </span>
                        {result.error}
                    </div>
                )}
            </div>
        </div>
    )
}