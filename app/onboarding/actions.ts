"use server";

// Basic FAFSA/Title-IV code validation (6 alphanumeric characters)
const CODE_RE = /^[0-9A-Za-z]{6}$/;

// Optional: normalize to uppercase for consistency
export function validateFederalSchoolCode(input: string) {
  const code = (input || "").trim().toUpperCase();
  if (!CODE_RE.test(code)) {
    return { ok: false, error: "FAFSA code must be 6 letters/numbers (e.g., 002546)." };
  }
  return { ok: true, code };
}

// Save the user’s choice to Supabase (no userId in client; we read session server-side)
import { createClient } from "@/utils/supabase/server";

export type Choice =
  | { kind: "college"; code: string } // FAFSA/Title-IV 6-char code
  | { kind: "no_school" };            // bootcamp/self_taught/etc.

export async function saveEducationChoice(choice: Choice) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  if (choice.kind === "college") {
    const { ok, code, error } = validateFederalSchoolCode(choice.code);
    if (!ok || !code) throw new Error(error || "Invalid FAFSA code.");

    const { error: upsertErr } = await supabase.from("users").update({
      federal_school_code: code,
      is_student: true,
    }).eq("user_id", user.id);
    if (upsertErr) throw upsertErr;
  } else {
    // bootcamp / self-taught → no FAFSA code, mark not student
    const { error: upsertErr } = await supabase.from("users").update({
      federal_school_code: null,
      is_student: false,
    }).eq("user_id", user.id);
    if (upsertErr) throw upsertErr;
  }

  return { ok: true };
}