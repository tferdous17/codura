// app/onboarding/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SchoolSearchStep from "./SchoolSearchStep"; // the client UI below

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const supabase = await createClient();

  // Require auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Pull only what we need
  const { data: profile } = await supabase
    .from("users")
    .select("federal_school_code, questionnaire_completed")
    .eq("user_id", user.id)
    .single();

  // If questionnaire is finished -> dashboard
  if (profile?.questionnaire_completed) {
    redirect("/dashboard");
  }

  // If FAFSA code is present (non-empty) -> questionnaire
  const code = profile?.federal_school_code ?? null;
  const hasCode = code !== null && String(code).trim() !== "";
  if (hasCode) {
    redirect("/questionnaire");
  }

  // Otherwise, render the FAFSA step (client UI)
  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Tell us about your education</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Enter your FAFSA code or choose “No” if you’re in a bootcamp or self-taught.
      </p>
      <SchoolSearchStep />
    </div>
  );
}