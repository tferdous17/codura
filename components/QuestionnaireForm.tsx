"use client";

import * as React from "react";

type Question = {
  question_id: string;   // UUID
  prompt: string;
  allows_multiple: boolean;
  position: number;      // 1 = ranks, 2 = age
};

type Option = {
  option_id: string;     // UUID
  question_id: string;   // UUID
  label: string;
  value: string;         // e.g. "python"
  position: number;
};

export default function QuestionnaireForm({
  questions = [],
  options = [],
  action, // <-- server action passed from page
}: {
  questions?: Question[];
  options?: Option[];
  action: (fd: FormData) => Promise<any>;
}) {
  const q1 = questions.find((q) => q.position === 1);
  const q2 = questions.find((q) => q.position === 2);
  const q1Options = options
    .filter((o) => o.question_id === q1?.question_id)
    .slice()
    .sort((a, b) => a.position - b.position);

  const [rank1, setRank1] = React.useState("");
  const [rank2, setRank2] = React.useState("");
  const [rank3, setRank3] = React.useState("");
  const [age, setAge] = React.useState<number | "">("");

  const taken = new Set([rank1, rank2, rank3].filter(Boolean));
  const available = (current: string) =>
    q1Options.filter((o) => !taken.has(o.option_id) || o.option_id === current);

  if (!q1 || !q2) return <p className="text-red-600">No questions found in DB.</p>;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Build a normalized payload the server action expects.
    // - For Q1 (ranked choices): send rows with option_id and answer_text = rank ("1|2|3")
    // - For Q2 (age): send a text answer with answer_text
    const payload = {
      q1Id: q1.question_id,
      q2Id: q2.question_id,
      ranks: [
        rank1 ? { option_id: rank1, rank: 1 } : null,
        rank2 ? { option_id: rank2, rank: 2 } : null,
        rank3 ? { option_id: rank3, rank: 3 } : null,
      ].filter(Boolean),
      age: age === "" ? null : Number(age),
    };

    const fd = new FormData();
    fd.set("payload", JSON.stringify(payload));
    const res = await action(fd);

    // Optional: the action can return {ok:true, redirect:"/dashboard"}
    if (res?.redirect) window.location.href = res.redirect;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Q1: Languages ranked 1–3 (use option_id as value to avoid server-side lookups) */}
      <fieldset className="space-y-3">
        <legend className="font-semibold">{q1.prompt}</legend>
        <p className="text-sm text-gray-600">
          Pick up to three in order (1 = top preference). You can also pick just one.
        </p>

        <div className="grid grid-cols-1 gap-3">
          <label className="flex items-center gap-3">
            <span className="w-16 shrink-0">Rank 1</span>
            <select
              name="rank1"
              className="border rounded p-2 w-full"
              value={rank1}
              onChange={(e) => setRank1(e.target.value)}
            >
              <option value="">— none —</option>
              {available(rank1).map((o) => (
                <option key={o.option_id} value={o.option_id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-3">
            <span className="w-16 shrink-0">Rank 2</span>
            <select
              name="rank2"
              className="border rounded p-2 w-full"
              value={rank2}
              onChange={(e) => setRank2(e.target.value)}
            >
              <option value="">— none —</option>
              {available(rank2).map((o) => (
                <option key={o.option_id} value={o.option_id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-3">
            <span className="w-16 shrink-0">Rank 3</span>
            <select
              name="rank3"
              className="border rounded p-2 w-full"
              value={rank3}
              onChange={(e) => setRank3(e.target.value)}
            >
              <option value="">— none —</option>
              {available(rank3).map((o) => (
                <option key={o.option_id} value={o.option_id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>

      {/* Q2: Age (typed) */}
      <fieldset className="space-y-3">
        <legend className="font-semibold">{q2.prompt}</legend>
        <input
          type="number"
          name="age"
          min={0}
          className="border rounded p-2 w-full"
          placeholder="Enter your age"
          value={age}
          onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
          required
        />
      </fieldset>

      <button type="submit" className="rounded bg-black text-white px-4 py-2 hover:opacity-90">
        Submit
      </button>
    </form>
  );
}