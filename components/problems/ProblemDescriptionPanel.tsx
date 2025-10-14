'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CodeEditorPanel } from '@/components/problems/CodeEditorPanel'
import { ProblemDescriptionPanel } from '@/components/problems/ProblemDescriptionPanel'
import { AIChatbot } from '@/components/problems/AIChatbot'

interface Example {
  input: string
  output: string
  explanation?: string
}

interface TestCase {
  input: string
  expectedOutput: string
  explanation?: string
}

interface ProblemPageProps {
  params: {
    problemId: string
  }
}

export default function ProblemPage({ params }: ProblemPageProps) {
  const router = useRouter()
  const [problem, setProblem] = useState<any>(null)
  const [allOfUsersSubmissions, setAllOfUsersSubmissions] = useState<any[]>([])
  const [selectedExample, setSelectedExample] = useState<Example | null>(null)
  const [testCases, setTestCases] = useState<TestCase[]>([])
  const [code, setCode] = useState<string>('')
  const [language, setLanguage] = useState<string>('javascript')

  useEffect(() => {
    async function fetchProblem() {
      try {
        const res = await fetch(`/api/problems/${params.problemId}`)
        if (res.ok) {
          const data = await res.json()
          setProblem(data.problem)
          setTestCases(data.problem.testCases || [])
          setSelectedExample(data.problem.examples ? data.problem.examples[0] : null)
        }
      } catch (error) {
        console.error('Failed to fetch problem:', error)
      }
    }
    fetchProblem()
  }, [params.problemId])

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const res = await fetch(`/api/submissions?problemId=${params.problemId}`)
        if (res.ok) {
          const submissions = await res.json()
          setAllOfUsersSubmissions(submissions)
        }
      } catch (error) {
        console.error('Failed to fetch submissions:', error)
      }
    }
    fetchSubmissions()
  }, [params.problemId])

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode)
  }, [])

  if (!problem) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="w-full md:w-1/3 border-r border-zinc-800">
        <ProblemDescriptionPanel 
          problem={problem} 
          allOfUsersSubmissions={allOfUsersSubmissions} 
        />
      </div>
      <div className="w-full md:w-2/3 flex flex-col">
        <CodeEditorPanel 
          code={code} 
          onCodeChange={handleCodeChange} 
          language={language} 
          setLanguage={setLanguage} 
          testCases={testCases} 
          selectedExample={selectedExample} 
          setSelectedExample={setSelectedExample} 
          problemId={params.problemId}
          setAllOfUsersSubmissions={setAllOfUsersSubmissions}
        />
        <AIChatbot problem={problem} />
      </div>
    </div>
  )
}