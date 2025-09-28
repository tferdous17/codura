// app/questionnaire/submit/action.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function submitQuestionnaire(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 🔽 TODO: read your fields from formData and insert into user_answers
  // Example: answers[] entries posted by QuestionnaireForm
  // const raw = formData.getAll("answers"); // shape depends on your form
  // ... insert/upsert to user_answers ...

  // ✅ Mark completed
  const { error: updateErr } = await supabase
    .from("users")
    .update({ questionnaire_completed: true })
    .eq("user_id", user.id);
  if (updateErr) {
    console.error(updateErr);
    redirect("/error");
  }

  // ✅ Go straight to dashboard (no confirmation page)
  redirect("/dashboard");
}