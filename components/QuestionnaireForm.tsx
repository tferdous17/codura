// app/questionnaire/QuestionnaireForm.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveAnswersAndComplete } from "@/app/questionnaire/submit/actions";

type Question = { question_id: number; prompt: string; allows_multiple: boolean };
type Option = { label: string; value: string; position: number };

export default function QuestionnaireForm({
  question,
  options,
  maxChoices = 3,
}: {
  question: Question;
  options: Option[];
  maxChoices?: number;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const toggle = (val: string) => {
    setSelected((prev) => {
      if (prev.includes(val)) return prev.filter((v) => v !== val);
      if (!question.allows_multiple || maxChoices <= 1) return [val];
      if (prev.length < maxChoices) return [...prev, val];
      return prev;
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setErrMsg("");

    startTransition(async () => {
      const res = await saveAnswersAndComplete({
        questionId: question.question_id,
        values: selected,
      });
      if (!res?.ok) {
        setStatus("error");
        setErrMsg(res?.message || "Save failed");
        return;
      }
      router.push("/dashboard");
    });
  };

  const disabled =
    isPending || status === "saving" || (question.allows_multiple && selected.length === 0);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-md rounded-lg border border-gray-700 bg-gray-800 shadow-lg p-6 text-white">
        <form onSubmit={onSubmit} className="space-y-6">
          <h2 className="text-xl font-semibold text-center">{question.prompt}</h2>

          <div className="grid gap-3">
            {options.map((opt) => {
              const checked = selected.includes(opt.value);
              const capReached =
                question.allows_multiple && selected.length >= maxChoices && !checked;

              return (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 rounded-md border p-3 cursor-pointer ${
                    checked ? "bg-gray-700" : "bg-gray-900"
                  } ${capReached ? "opacity-60" : ""}`}
                >
                  <input
                    type={question.allows_multiple ? "checkbox" : "radio"}
                    value={opt.value}
                    checked={checked}
                    onChange={() => toggle(opt.value)}
                    disabled={capReached}
                    className="accent-primary"
                  />
                  <span>{opt.label}</span>
                </label>
              );
            })}
          </div>

          {question.allows_multiple && (
            <p className="text-sm text-gray-300 text-center">
              {selected.length}/{maxChoices} selected
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 text-white font-semibold hover:bg-primary/90 disabled:opacity-50"
            disabled={disabled}
          >
            {isPending || status === "saving" ? "Submitting..." : "Submit & Go to Dashboard"}
          </button>

          {status === "error" && (
            <p className="text-red-400 text-sm text-center">Error: {errMsg}</p>
          )}
        </form>
      </div>
    </div>
  );

}