// app/api/ai/initial-analysis/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";


export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      problemId,
      problemDescription,
      problemTitle,
      submissionCode,
      language,
      testsPassed,
      totalTests
    } = body;

    if (!problemId || !submissionCode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify submission exists
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', user.id)
      .eq('problem_id', problemId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (submissionError || !submission) {
      return NextResponse.json(
        { error: "No submission found" },
        { status: 403 }
      );
    }

    // Build system prompt for initial analysis
    const systemPrompt = `You are a supportive coding mentor analyzing a student's code submission.

Your task:
1. Briefly acknowledge their submission (1 sentence)
2. If tests passed: Congratulate them
3. If tests failed: Encourage them and note they're making progress
4. Suggest which type of help would be most beneficial:
   - Understanding (if approach seems unclear)
   - Debugging (if tests are failing)
   - Explanation (if code works but could be clearer)
   - Optimization (if code works but may be inefficient)

RULES:
- Be encouraging and positive
- NEVER reveal solutions
- Keep response under 150 words
- Focus on next steps`;

    const userPrompt = `Problem: ${problemTitle}
${problemDescription}

Student's Code (${language}):
\`\`\`${language}
${submissionCode}
\`\`\`

Result: ${testsPassed}/${totalTests} tests passed

Provide initial encouraging analysis and suggest next steps.`;

    // Call AI API
    const aiResponse = await callOpenAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    // Log the initial analysis
    await supabase.from('ai_interactions').insert({
      user_id: user.id,
      problem_id: problemId,
      assistance_type: 'initial_analysis',
      user_message: 'Initial submission analysis',
      ai_response: aiResponse,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: aiResponse
    });

  } catch (error) {
    console.error("Initial Analysis Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze submission" },
      { status: 500 }
    );
  }
}

async function callOpenAI(messages: Array<{ role: string; content: string }>) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  // Keep models consistent across routes
  const model = process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    // surface the real cause (e.g., "model_not_found")
    throw new Error(`OpenAI API error: ${response.status} ${errBody}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content ?? '';
}