// app/dashboard/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function resetQuestionnaire(_formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) {
    console.error("Not authenticated");
    return; // or throw new Error("Not authenticated")
  }

  const { error } = await supabase
    .from("users")
    .update({ questionnaire_completed: false, federal_school_code: null })
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to reset questionnaire:", error);
    return; // or throw error
  }

  // Revalidate the dashboard so the status pill updates immediately
  revalidatePath("/dashboard");
}