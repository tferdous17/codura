// app/questionnaire/page.tsx (server component)

import { createClient } from "@/utils/supabase/server";
import QuestionnaireForm from "@/components/QuestionnaireForm";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const supabase = await createClient();

  // 1) Load the single active question at position 1
  const { data: question, error: qErr } = await supabase
    .from("questions")
    .select("question_id, prompt, allows_multiple")
    .eq("position", 1)
    .eq("is_active", true)
    .single();

  if (qErr || !question) {
    return (
      <div className="text-red-500">
        Couldn’t load question{qErr?.message ? `: ${qErr.message}` : ""}.
      </div>
    );
  }

  // 2) Load options ordered by position
  const { data: options, error: oErr } = await supabase
    .from("question_options")
    .select("label, value, position")
    .eq("question_id", question.question_id)
    .order("position", { ascending: true });

  if (oErr) {
    return (
      <div className="text-red-500">
        Couldn’t load options{oErr?.message ? `: ${oErr.message}` : ""}.
      </div>
    );
  }

  // If somehow no options, show a helpful nudge
  if (!options?.length) {
    return (
      <div className="text-yellow-600">
        No options found for this question. Check the <code>question_options</code> rows for
        question_id {String(question.question_id)}.
      </div>
    );
  }

  // 3) Render client form (it handles saving via server action, no redirects)
  return (
    <div className="max-w-2xl mx-auto p-6">
      <QuestionnaireForm
        question={question}
        options={options}
        maxChoices={3} // adjust or remove cap as you like
      />
    </div>
  );
}