// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const supabase = await createClient();

  // Finish login
  const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeErr) {
    console.error("Exchange error:", exchangeErr);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  // Who just logged in?
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/login`);

  // Ensure a row exists (safe if you already insert elsewhere)
  const { error: upsertError } = await supabase
    .from("users")
    .upsert(
      {
        user_id: user.id,
        full_name:
          (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) ||
          user.email ||
          "User",
      },
      { onConflict: "user_id", ignoreDuplicates: true }
    );

  if (upsertError) {
    console.error("Upsert error:", upsertError);
  }

  // Read flags
  const { data: profile, error: selectError } = await supabase
    .from("users")
    .select("federal_school_code, questionnaire_completed")
    .eq("user_id", user.id)
    .single();

  console.log("AUTH CALLBACK profile:", profile);
  console.log("AUTH CALLBACK select error:", selectError);

  // Decide destination with proper null checking
  let dest = "/onboarding";
  
  if (profile) {
    if (profile.questionnaire_completed) {
      dest = "/dashboard";
    } else if (profile.federal_school_code && profile.federal_school_code.trim() !== "") {
      dest = "/questionnaire";
    } else {
      dest = "/onboarding";
    }
  }

  console.log("AUTH CALLBACK destination:", dest);

  // Handle load balancer host if present
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocal = process.env.NODE_ENV === "development";

  if (isLocal) return NextResponse.redirect(`${origin}${dest}`);
  if (forwardedHost) return NextResponse.redirect(`https://${forwardedHost}${dest}`);
  return NextResponse.redirect(`${origin}${dest}`);
}