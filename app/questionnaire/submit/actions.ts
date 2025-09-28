// app/submit/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function saveAnswersAndComplete({
  questionId,
  values,
}: {
  questionId: number;
  values: string[];
}) {
  const supabase = await createClient();

  // Auth
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) return { ok: false, message: 'Not authenticated' };

  // Map values -> option_ids
  const { data: opts, error: optsErr } = await supabase
    .from('question_options')
    .select('option_id, value')
    .eq('question_id', questionId);
  if (optsErr) return { ok: false, message: optsErr.message };

  const map = new Map(opts.map((o) => [o.value, o.option_id]));
  const nowIso = new Date().toISOString();

  const rows = values
    .map((v, i) => {
      const option_id = map.get(v);
      if (!option_id) return null;
      return {
        user_id: user.id,
        question_id: questionId,
        option_id,
        priority: i + 1,
        text_value: null,
        answered_at: nowIso,
      };
    })
    .filter(Boolean);

  // Clear old
  const del = await supabase
    .from('user_answers')
    .delete()
    .eq('user_id', user.id)
    .eq('question_id', questionId);
  if (del.error) return { ok: false, message: del.error.message };

  // Insert new
  if (rows.length) {
    const ins = await supabase.from('user_answers').insert(rows);
    if (ins.error) return { ok: false, message: ins.error.message };
  }

  // ✅ Flag questionnaire completed
  const upd = await supabase
    .from('users')
    .update({ questionnaire_completed: true })
    .eq('user_id', user.id);
  if (upd.error) return { ok: false, message: upd.error.message };

  return { ok: true };
}