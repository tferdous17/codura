// app/questionnaire/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

type RawAnswer = {
  question_id: number | string;
  option_id?: number | string | null; // for single/multi
  answer_text?: string | null;        // for text/open-ended
};

export async function saveAnswers(formData: FormData) {
  const supabase = await createClient();

  // 1) Auth
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) throw new Error("Not logged in");

  // 2) Parse & validate
  const raw = formData.get("payload");
  if (typeof raw !== "string") throw new Error("Missing payload");
  let answers: RawAnswer[];
  try {
    answers = JSON.parse(raw);
  } catch {
    throw new Error("Invalid payload");
  }
  if (!Array.isArray(answers) || answers.length === 0) {
    throw new Error("No answers provided");
  }

  // 3) Normalize and split
  const now = new Date().toISOString();
  const choiceRows = [];
  const textRows = [];

  for (const a of answers) {
    const qid = Number(a.question_id);
    if (!Number.isFinite(qid)) throw new Error("Bad question_id");

    const hasOption = a.option_id !== undefined && a.option_id !== null && a.option_id !== "";
    if (hasOption) {
      const oid = Number(a.option_id);
      if (!Number.isFinite(oid)) throw new Error("Bad option_id");
      choiceRows.push({
        user_id: user.id,
        question_id: qid,
        option_id: oid,
        answer_text: null,
        answered_at: now,
      });
    } else {
      textRows.push({
        user_id: user.id,
        question_id: qid,
        option_id: null,
        answer_text: (a.answer_text ?? "").toString(),
        answered_at: now,
      });
    }
  }

  // 4) Upserts (separate conflict targets)
  if (choiceRows.length) {
    const { error } = await supabase
      .from("user_answers")
      .upsert(choiceRows, { onConflict: "user_id,question_id,option_id" });
    if (error) throw error;
  }

  if (textRows.length) {
    // Requires a UNIQUE index on (user_id, question_id) for text answers
    // or make option_id DEFAULT 0 and never null, then use the first upsert only.
    const { error } = await supabase
      .from("user_answers")
      .upsert(textRows, { onConflict: "user_id,question_id" });
    if (error) throw error;
  }

  // 5) Mark completion (idempotent)
  {
    const { error: completionErr } = await supabase
      .from("users")
      .update({ questionnaire_completed: true })
      .eq("user_id", user.id);
    if (completionErr) throw completionErr;
  }

  // 6) Revalidate + tell client we're done
  revalidatePath("/dashboard");
  return { ok: true };
}