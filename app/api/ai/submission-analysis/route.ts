// app/api/ai/submission-analysis/route.ts
import { NextRequest, NextResponse } from "next/server";

// ---- Guardrails: keep responses as hints-only (no runnable code)
function sanitizeToHintsOnly(text: string) {
  let out = text.replace(/```[\s\S]*?```/g, "[redacted: replaced with a high-level hint]");
  out = out.replace(/`[^`]{60,}`/g, "[code redacted]");
  out = out.replace(
    /(def|function|public|private|class)\s+[a-zA-Z0-9_]+[^{\n]*\{[\s\S]*?\}/g,
    "[redacted: full function body removed]"
  );
  const lines = out.split("\n");
  let streak = 0;
  for (let i = 0; i < lines.length; i++) {
    const looksCode = /^[\s]*([A-Za-z_][A-Za-z0-9_]*\s*$begin:math:text$|if|for|while|return|let|const|var|=>|=|;|\\{|\\}|$end:math:text$|$begin:math:display$|$end:math:display$)/.test(
      lines[i]
    );
    if (looksCode) streak++;
    else streak = 0;
    if (streak >= 4) lines[i] = "[redacted: turning code into a conceptual hint]";
  }
  out = lines.join("\n");
  return out.slice(0, 1800);
}

// ---- Estimate judge reliability
function judgeReliabilitySignal(params: {
  testsPassed?: number;
  totalTests?: number;
  judge?: {
    stdout?: string;
    stderr?: string;
    testResults?: Array<{ passed?: boolean; error?: string }>;
  };
}) {
  const { testsPassed = 0, totalTests = 0, judge } = params;
  if (!totalTests) return { score: 0.3, notes: "No tests supplied." };
  let score = testsPassed / totalTests;
  const stderr = judge?.stderr?.toLowerCase() || "";
  if (stderr.includes("internal error") || stderr.includes("timeout") || stderr.includes("flaky"))
    score = Math.min(score, 0.25);
  const fails = totalTests - testsPassed;
  if (fails >= Math.ceil(totalTests * 0.6) && !stderr) score = Math.min(score, 0.4);
  score = Math.max(0.0, Math.min(1.0, score));
  return { score, notes: `Pass-rate ${testsPassed}/${totalTests}${stderr ? "; stderr present" : ""}` };
}

const SYSTEM_PROMPT = `
You are Codura’s coding tutor. Your job is to give HINTS ONLY, never solutions.

Strict rules:
- Do NOT provide runnable or complete code.
- Keep replies conceptual and guiding.
- Use short questions, reasoning steps, and edge-case hints.
- If the judge seems wrong, note that clearly.
- Always end with: "Want another hint or a nudge toward tests?"
`.trim();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      problemId,
      problemDescription,
      submissionCode,
      language,
      assistanceType,
      userMessage,
      conversationHistory = [],
      testsPassed = 0,
      totalTests = 0,
      judge,
      nudges = [],
    } = body;

    // Build reliability summary
    const reliability = judgeReliabilitySignal({ testsPassed, totalTests, judge });
    const judgeSummary = [
      `Tests Passed: ${testsPassed}/${totalTests} (Reliability≈${reliability.score.toFixed(2)})`,
      judge?.stderr ? `stderr: ${judge.stderr.slice(0, 300)}` : "",
      judge?.stdout ? `stdout: ${judge.stdout.slice(0, 300)}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const context = [
      `Problem ID: ${problemId}`,
      `Language: ${language}`,
      `Assistance type: ${assistanceType}`,
      `Problem (trunc 500): ${problemDescription?.slice(0, 500)}`,
      `Submission (trunc 600): ${submissionCode?.slice(0, 600)}`,
      judgeSummary,
      nudges.length ? `User nudges: ${nudges.join(", ")}` : "",
    ].join("\n\n");

    // Combine chat history into OpenAI format
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-6).map((m: any) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.content,
      })),
      {
        role: "user",
        content: [
          "Session context:",
          context,
          "",
          "User message:",
          userMessage,
          "",
          `Judge reliability: ${reliability.score.toFixed(2)} (${reliability.notes})`,
        ].join("\n"),
      },
    ];

    // ---- Call OpenAI
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        max_tokens: 800,
        messages,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("OpenAI error:", text);
      return NextResponse.json({ ok: false, error: "AI provider error" }, { status: 500 });
    }

    const data = await resp.json();
    const raw =
      data?.choices?.[0]?.message?.content ??
      "I couldn't generate a response this time.";
    const text = sanitizeToHintsOnly(raw);

    return NextResponse.json({ ok: true, text, judgeReliability: reliability.score });
  } catch (err: any) {
    console.error("[/api/ai/submission-analysis] Error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}