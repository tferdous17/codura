// app/questionnaire/page.tsx
import { createClient } from "@/utils/supabase/server";
import QuestionnaireForm from "@/components/QuestionnaireForm";
import { redirect } from "next/navigation";
import { submitQuestionnaire } from "./submit/actions";
import { GalleryVerticalEnd } from "lucide-react"; // only if you used this icon on login

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const supabase = await createClient();

  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) redirect("/login");

  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("question_id, prompt, position, allows_multiple, is_active")
    .eq("is_active", true)
    .order("position", { ascending: true });

  if (questionsError) {
    console.error("Questions load error:", questionsError);
  }

  const questionIds = (questions ?? []).map((q) => q.question_id);
  let options:
    { option_id: string; question_id: string; label: string; value: string; position: number }[] = [];

  if (questionIds.length) {
    const { data: opts, error: optionsError } = await supabase
      .from("question_options")
      .select("option_id, question_id, label, value, position")
      .in("question_id", questionIds)
      .order("position", { ascending: true });

    if (optionsError) {
      console.error("Options load error:", optionsError);
    }
    options = opts ?? [];
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* Brand header (matches Login) */}
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Codura
        </a>

        {/* Card-like wrapper to match LoginForm placement */}
        <div className="rounded-lg border bg-background p-6 shadow-sm">
          <h1 className="text-xl font-semibold mb-4">Questionnaire</h1>

          {/* Errors (simple, inline) */}
          {!questions?.length && (
            <p className="text-sm text-muted-foreground">
              No active questions found. Please try again later.
            </p>
          )}

          {questions?.length ? (
            <QuestionnaireForm
              questions={questions}
              options={options}
              action={submitQuestionnaire}
            />
          ) : null}
        </div>

        {/* Optional: theme toggle if you had it on login */}
        {/* <ModeToggle /> */}
      </div>
    </div>
  );
}