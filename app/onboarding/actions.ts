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

// Validate and clean major input
function validateMajor(input: string) {
  const major = (input || "").trim();
  if (!major || major.length < 2) {
    return { ok: false as const, error: "Please provide a valid major or field of study." };
  }
  if (major.length > 100) {
    return { ok: false as const, error: "Major name is too long (max 100 characters)." };
  }
  return { ok: true as const, major };
}

// Save the user's choice to Supabase (no userId in client; we read session server-side)
import { createClient } from "@/utils/supabase/server";

export async function saveEducationChoice(choice: { 
  kind: string; 
  code?: string; 
  major?: string | null; 
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  let federalSchoolCode: string | null = null;
  let major: string | null = null;

  // Validate major if provided
  if (choice.major && choice.major.trim()) {
    const majorValidation = validateMajor(choice.major);
    if (!majorValidation.ok) {
      throw new Error(majorValidation.error);
    }
    major = majorValidation.major;
  }

  // Handle school code validation if provided
  if (choice.kind === "college") {
    // For college choice, both school code and major are required
    if (!choice.code) {
      throw new Error("School selection is required.");
    }
    if (!major) {
      throw new Error("Major/field of study is required when selecting a school.");
    }
    
    const { ok, code, error } = validateFederalSchoolCode(choice.code);
    if (!ok || !code) throw new Error(error || "Invalid FAFSA code.");
    federalSchoolCode = code;
  } else {
    // For "no school" choice, major is optional
    federalSchoolCode = null;
  }
  
  try {
    const { error: upsertErr } = await supabase
      .from("users")
      .update({ 
        federal_school_code: federalSchoolCode,
        major: major 
      })
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