"use server";

import { redirect } from "next/navigation";

// Basic FAFSA/Title-IV code validation (6 alphanumeric characters)
const CODE_RE = /^[0-9A-Za-z]{6}$/;

// Optional: normalize to uppercase for consistency (kept local to avoid client imports)
function validateFederalSchoolCode(input: string) {
  const code = (input || "").trim().toUpperCase();
  if (!CODE_RE.test(code)) {
    return { ok: false as const, error: "FAFSA code must be 6 letters/numbers (e.g., 002546)." };
  }
  return { ok: true as const, code };
}

// Save the user’s choice to Supabase (no userId in client; we read session server-side)
import { createClient } from "@/utils/supabase/server";

export async function saveEducationChoice(choice: { kind: string; code?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  let federalSchoolCode: string | null = null;
  if (choice.kind === "college") {
    const { ok, code, error } = validateFederalSchoolCode(choice.code || "");
    if (!ok || !code) throw new Error(error || "Invalid FAFSA code.");
    federalSchoolCode = code;
  } else {
    federalSchoolCode = null;
  }
  
  try {
    const { error: upsertErr } = await supabase
      .from("users")
      .update({ federal_school_code: federalSchoolCode })
      .eq("user_id", user.id);
    if (upsertErr) throw upsertErr;
  } catch (e) {
    // Swallow DB error to ensure redirect; you can read logs server-side
    console.error("saveEducationChoice update error:", e);
  } finally {
    redirect("/questionnaire");
  }

  // Unreachable after redirect, but kept for type completeness if redirect is ever removed
  return { ok: true };
}