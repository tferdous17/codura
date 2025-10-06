// app/submit/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';

type ResponsePayload = { questionId: number; values: string[] };

export async function saveQuestionnaireAndComplete({
  responses,
}: {
  responses: ResponsePayload[];
}) {
  const supabase = await createClient();

  // Auth
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) return { ok: false, message: 'Not authenticated' };

  // Gather all question ids we need to save
  const questionIds = responses.map((r) => r.questionId);

  // Load option_id maps for each question
  const { data: opts, error: optsErr } = await supabase
    .from('question_options')
    .select('question_id, option_id, value')
    .in('question_id', questionIds);

  if (optsErr) return { ok: false, message: optsErr.message };

  const mapByQ: Record<number, Map<string, number>> = {};
  for (const qid of questionIds) mapByQ[qid] = new Map<string, number>();
  for (const o of opts ?? []) mapByQ[o.question_id].set(o.value, o.option_id);

  // Build new user_answers rows (preserve order via priority)
  const nowIso = new Date().toISOString();
  const rows: {
    user_id: string;
    question_id: number;
    option_id: number;
    priority: number;
    text_value: string | null;
    answered_at: string;
  }[] = [];

  for (const r of responses) {
    const m = mapByQ[r.questionId] || new Map<string, number>();
    r.values.forEach((v, i) => {
      const option_id = m.get(v);
      if (option_id) {
        rows.push({
          user_id: user.id,
          question_id: r.questionId,
          option_id,
          priority: i + 1,
          text_value: null,
          answered_at: nowIso,
        });
      }
    });
  }

  // Remove previous answers for these questions
  const del = await supabase
    .from('user_answers')
    .delete()
    .eq('user_id', user.id)
    .in('question_id', questionIds);
  if (del.error) return { ok: false, message: del.error.message };

  // Insert new answers
  if (rows.length) {
    const ins = await supabase.from('user_answers').insert(rows);
    if (ins.error) return { ok: false, message: ins.error.message };
  }

  // Mark questionnaire completed
  const upd = await supabase
    .from('users')
    .update({ questionnaire_completed: true })
    .eq('user_id', user.id);
  if (upd.error) return { ok: false, message: upd.error.message };

  return { ok: true };
}