// app/api/ai/submission-analysis/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";

type AssistanceType = 'understanding' | 'debugging' | 'explanation' | 'optimization';

interface AnalyzeSubmissionParams {
  problemId: number;
  problemDescription: string;
  submissionCode: string;
  language: string;
  assistanceType: AssistanceType;
  userMessage: string;
  conversationHistory: Array<{ role: string; content: string }>;
  testsPassed: number;
  totalTests: number;
}

/**
 * Analyzes a code submission and provides hints based on assistance type
 * CRITICAL: Never provides direct solutions, only hints and guidance
 */
export async function analyzeSubmission(params: AnalyzeSubmissionParams) {
  const supabase = await createClient();
  
  // Verify user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  // Build the system prompt that enforces hint-only responses
  const systemPrompt = buildSystemPrompt(params.assistanceType, params.problemDescription);
  
  // Build the user prompt with context
  const userPrompt = buildUserPrompt(params);

  try {
    // TODO: Replace with your actual AI API call (OpenAI, Claude, etc.)
    // Example for OpenAI:
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          ...params.conversationHistory,
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    */

    // Simulated response for demonstration
    const aiResponse = generateSimulatedResponse(params);

    // Log the interaction for analytics
    await logAIInteraction(user.id, params.problemId, params.assistanceType);

    return {
      success: true,
      message: aiResponse
    };
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      success: false,
      message: "I'm having trouble analyzing your code right now. Please try again in a moment."
    };
  }
}

/**
 * Initial analysis when submission is first received
 */
export async function initialSubmissionAnalysis(params: {
  problemId: number;
  problemDescription: string;
  submissionCode: string;
  language: string;
  testsPassed: number;
  totalTests: number;
}) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  const systemPrompt = `You are a coding mentor AI assistant. Analyze the student's code submission and provide:

1. A brief assessment of their approach (1-2 sentences)
2. Identification of potential issues WITHOUT revealing solutions
3. Suggestions for which type of help would be most beneficial

CRITICAL RULES:
- NEVER provide complete solutions or correct code
- NEVER write code that solves the problem directly
- Focus on guiding questions and conceptual hints
- Be encouraging and supportive

The student's code ${params.testsPassed === params.totalTests ? 'passed all tests' : `passed ${params.testsPassed}/${params.totalTests} tests`}.`;

  const userPrompt = `Problem: ${params.problemDescription}

Student's Code (${params.language}):
\`\`\`${params.language}
${params.submissionCode}
\`\`\`

Provide initial analysis and suggest which type of assistance would be most helpful.`;

  try {
    // TODO: Replace with actual AI API call
    const aiResponse = `I've reviewed your ${params.language} solution. ${
      params.testsPassed === params.totalTests
        ? "Great job passing all tests! Your approach works correctly."
        : `You're on the right track with ${params.testsPassed}/${params.totalTests} tests passing.`
    }

I can help you with:

• **Understanding**: Break down the problem requirements
• **Debugging**: Investigate why certain tests fail
• **Explanation**: Analyze your code's approach and logic
• **Optimization**: Improve time/space complexity

Which area would you like to explore?`;

    await logAIInteraction(user.id, params.problemId, 'initial_analysis');

    return {
      success: true,
      message: aiResponse
    };
  } catch (error) {
    console.error("Initial Analysis Error:", error);
    return {
      success: false,
      message: "I'm having trouble analyzing your submission. Please try again."
    };
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function buildSystemPrompt(assistanceType: AssistanceType, problemDescription: string): string {
  const baseRules = `You are an expert coding mentor and tutor. Your role is to guide students to discover solutions themselves, NOT to provide direct answers.

CRITICAL RULES - YOU MUST FOLLOW THESE:
1. NEVER provide complete solutions or working code
2. NEVER write code that directly solves the problem
3. NEVER reveal the exact algorithm or data structure needed
4. ALWAYS respond with questions, hints, and conceptual guidance
5. Guide students through logical reasoning
6. Encourage them to think about edge cases
7. Be patient, encouraging, and supportive

Problem Context: ${problemDescription}`;

  const typeSpecificPrompts = {
    understanding: `${baseRules}

ASSISTANCE TYPE: Problem Understanding

Focus on:
- Breaking down the problem into smaller parts
- Clarifying requirements and constraints
- Suggesting simple test cases to work through
- Asking questions that reveal problem patterns
- Never explaining the full solution approach`,

    debugging: `${baseRules}

ASSISTANCE TYPE: Debugging Help

Focus on:
- Asking about edge cases they might have missed
- Suggesting areas of code to examine closely
- Recommending debugging techniques (print statements, step-through)
- Asking questions about their logic at specific points
- Never pointing directly to the bug or fixing it for them`,

    explanation: `${baseRules}

ASSISTANCE TYPE: Code Explanation

Focus on:
- Asking them to explain their approach in their own words
- Questioning the time/space complexity
- Prompting them to consider alternative approaches
- Discussing trade-offs in their design decisions
- Never providing the optimal solution`,

    optimization: `${baseRules}

ASSISTANCE TYPE: Optimization Help

Focus on:
- Asking about current time/space complexity
- Suggesting general optimization patterns (without specifics)
- Prompting them to identify bottlenecks
- Asking if certain operations could be reduced or eliminated
- Never providing the optimized algorithm directly`
  };

  return typeSpecificPrompts[assistanceType];
}

function buildUserPrompt(params: AnalyzeSubmissionParams): string {
  return `Student's Question: ${params.userMessage}

Context:
- Tests Passed: ${params.testsPassed}/${params.totalTests}
- Language: ${params.language}

Student's Code:
\`\`\`${params.language}
${params.submissionCode}
\`\`\`

Provide a helpful hint or guiding question. Remember: NO direct solutions!`;
}

function generateSimulatedResponse(params: AnalyzeSubmissionParams): string {
  // This simulates AI responses for development/testing
  // Replace with actual AI API call in production
  
  const responses = {
    understanding: [
      "Great question! Let's think about this step by step. What would happen if you traced through your algorithm with a simple input like [1, 2, 3]? Can you describe what your code would do at each step?",
      "I see you're trying to understand the problem better. Consider this: what's the relationship between the input and output? Try writing down 2-3 examples by hand first.",
      "That's a key point to clarify! Think about the constraints mentioned in the problem. How do they affect which approach you should take? What do they rule out?"
    ],
    debugging: [
      "Good thinking! When debugging, I'd recommend adding some debug prints. What is the value of your variables right before the failing test? Are they what you expect?",
      "Interesting observation! Have you considered what happens with edge cases? What if the input is empty? What if it has only one element?",
      "Let's debug systematically. Look at line where your loop starts - are you sure you're iterating through all elements? Try tracing through with a small input."
    ],
    explanation: [
      "Excellent! Let me ask you this: why did you choose to use this data structure? What advantage does it give you over alternatives?",
      "That's a thoughtful approach! Can you walk me through the time complexity? How many times does each element get processed?",
      "I see your logic here. What happens in your algorithm when you encounter a duplicate? Does your code handle that case?"
    ],
    optimization: [
      "Good question! Think about how many times you're accessing the same data. Could you store something to avoid repeated lookups?",
      "You're on the right track! Consider this: are you doing any unnecessary work in your loops? Can you achieve the same result with fewer iterations?",
      "Interesting approach! What's your current space complexity? Sometimes using a bit more memory can significantly speed things up. What trade-off could you make here?"
    ]
  };

  const typeResponses = responses[params.assistanceType];
  return typeResponses[Math.floor(Math.random() * typeResponses.length)];
}

async function logAIInteraction(
  userId: string,
  problemId: number,
  assistanceType: string
) {
  try {
    const supabase = await createClient();
    
    await supabase.from('ai_interactions').insert({
      user_id: userId,
      problem_id: problemId,
      assistance_type: assistanceType,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Log but don't throw - analytics failure shouldn't break the feature
    console.error("Failed to log AI interaction:", error);
  }
}