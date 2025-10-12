import React, { useState, useRef, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send, MessageCircle, Loader2, Code, Bug, Lightbulb, BookOpen, Zap } from 'lucide-react'

interface Message {
  role: 'user' | 'ai'
  content: string
  timestamp: Date
}

interface Submission {
  code: string
  language: string
  timestamp: Date
  testsPassed: number
  totalTests: number
}

interface PostSubmissionChatbotProps {
  problemId: number
  problemTitle: string
  problemDescription: string
  problemDifficulty: string
  submission?: Submission | null  
  onMessageSent?: (message: string) => void  
}

type AssistanceType = 'understanding' | 'debugging' | 'explanation' | 'optimization' | null

export default function AIChatbot({ 
  problemId,
  problemTitle,
  problemDescription,
  problemDifficulty,
  submission = null,  // ✅ Add default value
  onMessageSent  // ✅ Add this
}: PostSubmissionChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = useRef<Message[]>(messages);
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [selectedAssistance, setSelectedAssistance] = useState<AssistanceType>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }messagesRef.current = messages;
  }, [messages]);

  // Initialize chatbot when submission is available
  // Use a stable key to detect a genuinely new submission
const prevSubKeyRef = useRef<string>("");

useEffect(() => {
  if (!submission) return;

  // Build a key that changes only when the user's submission meaningfully changes
  const subKey = `${problemId}|${submission.code}|${submission.testsPassed}/${submission.totalTests}`;

  if (prevSubKeyRef.current !== subKey) {
    prevSubKeyRef.current = subKey;

    // Reset state for the new submission
    setMessages([]);
    setHasAnalyzed(false);
    setSelectedAssistance(null);

    // Kick off fresh initial analysis
    initializeChatbot();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [problemId, submission?.code, submission?.testsPassed, submission?.totalTests]);
  const initializeChatbot = async () => {
    if (!submission) return;
    setIsInitializing(true);
  
    try {
      const res = await fetch('/api/ai/initial-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId,
          problemTitle,
          problemDescription,
          submissionCode: submission.code,
          language: submission.language ?? 'plaintext',
          testsPassed: submission.testsPassed,
          totalTests: submission.totalTests,
        }),
      });
  
      const data = await res.json();
      const firstMsg = data?.message ?? `I've analyzed your submission for "${problemTitle}".`;
  
      setMessages([
        { role: 'ai', content: firstMsg, timestamp: new Date() },
      ]);
      setHasAnalyzed(true);
    } catch (e) {
      console.error('Error analyzing submission:', e);
      // fallback message
      setMessages([
        {
          role: 'ai',
          content: `I've analyzed your submission for "${problemTitle}". I can help with Understanding, Debugging, Explanation, or Optimization. Which do you want?`,
          timestamp: new Date(),
        },
      ]);
      setHasAnalyzed(true);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleAssistanceSelection = async (type: AssistanceType) => {
    if (!type) return;
    setSelectedAssistance(type);
    setIsLoading(true);
  
    const picked = getAssistanceTypeLabel(type);
    const pickedMsg: Message = {
      role: 'user',
      content: getAssistanceTypeLabel(type),
      timestamp: new Date(),
    };
  
    // UI update
    setMessages(prev => [...prev, pickedMsg]);
  
    // Build history from the freshest state
    const historyForServer = [...messagesRef.current, pickedMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));
  
    try {
      const res = await fetch('/api/ai/submission-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId,
          problemDescription,
          submissionCode: submission?.code ?? '',
          language: submission?.language ?? 'plaintext',
          assistanceType: type,
          userMessage: `Please start with ${picked.toLowerCase()}. Give me the first hint.`,
          conversationHistory: historyForServer,
          testsPassed: submission?.testsPassed ?? 0,
          totalTests: submission?.totalTests ?? 0,
          nudges: [
            'hints only, no solutions',
            'start with one concrete next step',
            'suggest a single test to try',
          ],
        }),
      });
  
      const data = await res.json();
      const text = data?.text ?? data?.message ?? 'Sorry, I could not generate a response.';
      setMessages(prev => [...prev, { role: 'ai', content: text, timestamp: new Date() }]);
    } catch (err) {
      console.error('assist-select error', err);
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, something went wrong. Try again.', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
  
    if (!selectedAssistance) {
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          content:
            'Pick a mode (Understanding / Debugging / Explanation / Optimization) first.',
          timestamp: new Date(),
        },
      ]);
      return;
    }
  
    const userMessageText = input.trim();
    const newUserMessage: Message = {
      role: 'user',
      content: userMessageText,
      timestamp: new Date(),
    };
  
    setInput('');
    setIsLoading(true);
    setMessages(prev => [...prev, newUserMessage]);
  
    // ✅ Use the freshest history from the ref + the new message
    const historyForServer = [...messagesRef.current, newUserMessage].map(m => ({
      role: m.role as 'user' | 'ai',
      content: m.content,
    }));
  
    try {
      const res = await fetch('/api/ai/submission-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId,
          problemDescription,
          submissionCode: submission?.code ?? '',
          language: submission?.language ?? 'plaintext',
          assistanceType: selectedAssistance, // 'understanding' | 'debugging' | 'explanation' | 'optimization'
          userMessage: userMessageText,
          conversationHistory: historyForServer, // server remaps 'ai' -> 'assistant'
          testsPassed: submission?.testsPassed ?? 0,
          totalTests: submission?.totalTests ?? 0,
          nudges: [
            'hints only, no solutions',
            'start with one concrete next step',
            'suggest one test to try next',
          ],
          // judge: { stdout, stderr, testResults, runtimeMs, memoryKb } // if you have it
        }),
      });
  
      let payload: any = null;
      try { payload = await res.json(); } catch { /* ignore parse error */ }
  
      if (!res.ok) {
        const msg =
          payload?.error ??
          payload?.message ??
          `Server error (${res.status}).`;
        throw new Error(msg);
      }
  
      const text: string =
        payload?.text ??
        payload?.message ??
        'Sorry, I could not generate a response.';
  
      setMessages(prev => [
        ...prev,
        { role: 'ai', content: text, timestamp: new Date() },
      ]);
    } catch (err: any) {
      console.error('handleSendMessage error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          content: `Error: ${err?.message || 'Unknown error.'}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (!isLoading) handleSendMessage();
  }
};

  // No submission yet - show locked state
  if (!submission) {
    return <LockedState />
  }

  return (
    <div className="h-full flex flex-col bg-zinc-950 border-l border-zinc-800">
      <ChatHeader submission={submission} />

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {isInitializing ? (
            <InitializingState />
          ) : messages.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {messages.map((message, index) => (
                <MessageBubble key={index} message={message} />
              ))}
              
              {/* Show assistance options after initial analysis */}
              {hasAnalyzed && !selectedAssistance && messages.length === 1 && (
                <AssistanceOptions onSelect={handleAssistanceSelection} />
              )}
              
              {isLoading && <LoadingIndicator />}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Only show input after assistance type is selected */}
      {selectedAssistance && (
        <ChatInput
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          onSend={handleSendMessage}
          onKeyDown={handleKeyDown}
          assistanceType={selectedAssistance}
        />
      )}
    </div>
  )
}

// ============================================
// SUB-COMPONENTS
// ============================================

function ChatHeader({ submission }: { submission: Submission }) {
  return (
    <div className="border-b border-zinc-800 px-4 py-3 bg-zinc-900/50">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <h3 className="text-sm font-semibold text-zinc-100">Post-Submission AI</h3>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Analyzing your code - hints only, no direct answers
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono text-zinc-400">
            {submission.testsPassed}/{submission.totalTests} tests
          </div>
          <div className={`text-xs font-semibold ${
            submission.testsPassed === submission.totalTests 
              ? 'text-green-400' 
              : 'text-amber-400'
          }`}>
            {submission.testsPassed === submission.totalTests ? 'Passed ✓' : 'Partial'}
          </div>
        </div>
      </div>
    </div>
  )
}

function LockedState() {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-zinc-950 border-l border-zinc-800 p-8">
      <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
        <MessageCircle className="w-8 h-8 text-zinc-600" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-300 mb-2">Submit Your Code First</h3>
      <p className="text-sm text-zinc-500 text-center max-w-xs">
        The AI assistant will be available after you submit your solution. 
        It will analyze your code and provide helpful hints!
      </p>
    </div>
  )
}

function InitializingState() {
  return (
    <div className="text-center py-12">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
        <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
      </div>
      <p className="text-zinc-300 text-sm font-medium">Analyzing your submission...</p>
      <p className="text-xs text-zinc-500 mt-2">This will only take a moment</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-12 px-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
        <MessageCircle className="w-6 h-6 text-blue-400" />
      </div>
      <p className="text-zinc-300 text-sm font-medium mb-2">
        Waiting for analysis...
      </p>
      <p className="text-xs text-zinc-500">
        The AI is reviewing your submission
      </p>
    </div>
  )
}

function AssistanceOptions({ onSelect }: { onSelect: (type: AssistanceType) => void }) {
  const options = [
    {
      type: 'understanding' as AssistanceType,
      icon: BookOpen,
      label: 'Understanding',
      description: 'Help me understand the problem better',
      color: 'from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30'
    },
    {
      type: 'debugging' as AssistanceType,
      icon: Bug,
      label: 'Debugging',
      description: 'Why are some tests failing?',
      color: 'from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30'
    },
    {
      type: 'explanation' as AssistanceType,
      icon: Code,
      label: 'Code Explanation',
      description: 'Explain my approach and logic',
      color: 'from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30'
    },
    {
      type: 'optimization' as AssistanceType,
      icon: Zap,
      label: 'Optimization',
      description: 'Make my solution more efficient',
      color: 'from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30'
    }
  ]

  return (
    <div className="grid grid-cols-1 gap-3 mt-4">
      {options.map((option) => {
        const Icon = option.icon
        return (
          <button
            key={option.type}
            onClick={() => onSelect(option.type)}
            className={`
              flex items-start gap-3 p-4 rounded-lg border border-zinc-800
              bg-gradient-to-br ${option.color}
              transition-all duration-200
              hover:border-zinc-700
            `}
          >
            <div className="w-10 h-10 rounded-lg bg-zinc-900/50 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-zinc-300" />
            </div>
            <div className="text-left flex-1">
              <div className="font-medium text-sm text-zinc-100 mb-0.5">
                {option.label}
              </div>
              <div className="text-xs text-zinc-400">
                {option.description}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm ${
          message.role === 'user'
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
            : 'bg-zinc-900 text-zinc-100 border border-zinc-800'
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        <div className={`text-xs mt-1 ${
          message.role === 'user' ? 'text-blue-200' : 'text-zinc-500'
        }`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-lg px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-xs text-zinc-500">Analyzing...</span>
        </div>
      </div>
    </div>
  )
}

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  isLoading: boolean
  onSend: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  assistanceType: AssistanceType
}

function ChatInput({ input, setInput, isLoading, onSend, onKeyDown, assistanceType }: ChatInputProps) {
  return (
    <div className="border-t border-zinc-800 p-4 bg-zinc-900/30">
      <div className="mb-2 text-xs text-zinc-500">
        Mode: <span className="text-zinc-300 font-medium">{getAssistanceTypeLabel(assistanceType)}</span>
      </div>
      <div className="flex gap-2">
        <Textarea
          placeholder="Ask for hints (I won't give away the answer)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={isLoading}
          className="min-h-[80px] resize-none bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-sm text-zinc-100 placeholder:text-zinc-600"
        />
        <Button 
          onClick={onSend} 
          size="icon" 
          disabled={!input.trim() || isLoading}
          className="self-end bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
      <p className="text-xs text-zinc-600 mt-2">
        Press Enter to send • Remember: I only give hints, never direct answers
      </p>
    </div>
  )
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getAssistanceTypeLabel(type: AssistanceType): string {
  const labels = {
    understanding: 'Help me understand the problem',
    debugging: 'Help me debug my code',
    explanation: 'Explain my code approach',
    optimization: 'Help me optimize my solution'
  }
  return type ? labels[type] : ''
}

function generateContextualResponse(
  assistanceType: AssistanceType,
  userMessage: string,
  submission: Submission
): string {
  // This is a simplified example - in production, this would call your AI API
  const responses = {
    understanding: [
      "That's a good question! Think about it this way: what if you walked through the problem with a simple example? Try input [1,2,3] - what should happen?",
      "Hint: The problem is asking you to transform the data in a specific way. What pattern do you notice in the expected outputs?",
      "Consider the constraints carefully. What does it mean for your algorithm when the input size is very large?"
    ],
    debugging: [
      "I notice your test is failing. Have you considered what happens when the input is empty? That's often a tricky edge case.",
      "Debugging tip: Try printing out intermediate values. What's the state of your variables at each step?",
      "Look at the boundaries of your loops carefully. Are you accessing all the elements you need to?"
    ],
    explanation: [
      "Your approach looks interesting! Can you explain why you chose this data structure? What advantage does it give you?",
      "I see you're using a nested loop here. What's the time complexity of this section? Could it be reduced?",
      "Think about your algorithm's flow. What happens in the best case? What about the worst case?"
    ],
    optimization: [
      "Consider using a hash map to store values you've seen. How might that reduce your time complexity?",
      "You're iterating through the array multiple times. Could you achieve the same result in a single pass?",
      "Think about space-time tradeoffs. Sometimes using extra memory can significantly speed up your solution."
    ]
  }
  
  const typeResponses = assistanceType ? responses[assistanceType] : responses.understanding
  return typeResponses[Math.floor(Math.random() * typeResponses.length)]
}