// components/QuestionnaireForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveQuestionnaireAndComplete } from "@/app/questionnaire/submit/actions";

type Option = { label: string; value: string; position: number };
type Item = {
  question_id: number;
  prompt: string;
  allows_multiple: boolean;
  position: number;
  options: Option[];
  maxChoices: number;
};

export default function QuestionnaireForm({ items }: { items: Item[] }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, string[]>>(
    Object.fromEntries(items.map((i) => [i.question_id, []]))
  );
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const toggle = (
    qid: number,
    val: string,
    allowsMultiple: boolean,
    maxChoices: number
  ) => {
    setAnswers((prev) => {
      const curr = prev[qid] ?? [];
      if (curr.includes(val)) return { ...prev, [qid]: curr.filter((v) => v !== val) };
      if (!allowsMultiple || maxChoices <= 1) return { ...prev, [qid]: [val] };
      if (curr.length < maxChoices) return { ...prev, [qid]: [...curr, val] };
      return prev; // cap reached
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setErrMsg("");

    const payload = items.map((i) => ({
      questionId: i.question_id,
      values: answers[i.question_id] ?? [],
    }));

    startTransition(async () => {
      const res = await saveQuestionnaireAndComplete({ responses: payload });
      if (!res?.ok) {
        setStatus("error");
        setErrMsg(res?.message || "Save failed");
        return;
      }
      router.push("/dashboard");
    });
  };

  // Require at least one selection per question (tweak if optional)
  const anyEmpty = items.some((i) => (answers[i.question_id]?.length ?? 0) === 0);
  const disabled = isPending || status === "saving" || anyEmpty;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Page header (optional logo could go here) */}
      <div className="text-center text-white">
        <h1 className="text-2xl font-bold">Tell us your interests</h1>
        <p className="text-gray-300 mt-1">Pick your top choices for each section.</p>
      </div>

      {/* Cards grid: 1 col on small, 2 cols on md+ */}
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((i) => (
          <div
            key={i.question_id}
            className="rounded-lg border border-gray-700 bg-gray-800 shadow-lg p-6 text-white"
          >
            <h2 className="text-lg font-semibold mb-4 text-center">{i.prompt}</h2>

            {/* Option boxes grid: 1 / 2 / 3 cols responsively */}
            <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {i.options.map((opt) => {
                const selected = (answers[i.question_id] ?? []).includes(opt.value);
                const capReached =
                  i.allows_multiple &&
                  (answers[i.question_id]?.length ?? 0) >= i.maxChoices &&
                  !selected;

                return (
                  <label
                    key={opt.value}
                    className={[
                      "flex items-start gap-3 rounded-md border p-4 cursor-pointer transition",
                      "min-h-[80px]", // taller blocks for multi-line text
                      selected ? "bg-gray-700 border-gray-600" : "bg-gray-900 border-gray-700",
                      capReached ? "opacity-60" : "",
                    ].join(" ")}
                  >
                    <input
                      type={i.allows_multiple ? "checkbox" : "radio"}
                      value={opt.value}
                      checked={selected}
                      onChange={() =>
                        toggle(i.question_id, opt.value, i.allows_multiple, i.maxChoices)
                      }
                      disabled={capReached}
                      className="mt-1 accent-primary"
                    />
                    <span className="whitespace-normal break-words leading-snug">
                      {opt.label}
                    </span>
                  </label>
                );
              })}
            </div>

            {i.allows_multiple && (
              <p className="mt-3 text-sm text-gray-300 text-center">
                {(answers[i.question_id]?.length ?? 0)}/{i.maxChoices} selected
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="max-w-md mx-auto">
        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2 text-white font-semibold hover:bg-primary/90 disabled:opacity-50"
          disabled={disabled}
        >
          {isPending || status === "saving" ? "Submitting..." : "Submit & Go to Dashboard"}
        </button>

        {status === "error" && (
          <p className="mt-3 text-red-400 text-sm text-center">Error: {errMsg}</p>
        )}
      </div>
    </form>
  );
}