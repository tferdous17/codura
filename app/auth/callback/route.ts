// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");

  console.log("=== AUTH CALLBACK START ===");
  console.log("Code present:", !!code);

  if (!code) {
    console.error("No code in callback");
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const supabase = await createClient();

  // Exchange code for session
  const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeErr) {
    console.error("Exchange error:", exchangeErr);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  // Get the authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("User error:", userError);
    return NextResponse.redirect(`${origin}/login`);
  }

  console.log("User authenticated:", user.id, user.email);

  // First, check if user row already exists in users table (onboarding)
  const { data: existingUser, error: checkError } = await supabase
    .from("users")
    .select("user_id, federal_school_code, questionnaire_completed")
    .eq("user_id", user.id)
    .maybeSingle();

  console.log("Existing user:", existingUser);
  console.log("Check error:", checkError);

  let profile = existingUser;

  // If user doesn't exist, create them in both users and user_profiles tables
  if (!existingUser) {
    console.log("Creating new user row...");

    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.user_name ||
      user.email?.split('@')[0] ||
      "User";

    // Create entry in users table (for onboarding)
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        user_id: user.id,
        full_name: fullName,
        federal_school_code: null,
        questionnaire_completed: false,
      })
      .select("user_id, federal_school_code, questionnaire_completed")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
    } else {
      console.log("New user created:", newUser);
      profile = newUser;
    }

    // Also create entry in user_profiles table (for profile page)
    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        id: user.id,
        full_name: fullName,
      });

    if (profileError) {
      console.error("Profile insert error:", profileError);
    } else {
      console.log("User profile created");
    }

    // Create initial stats entry
    const { error: statsError } = await supabase
      .from("user_stats")
      .insert({
        user_id: user.id,
      });

    if (statsError) {
      console.error("Stats insert error:", statsError);
    } else {
      console.log("User stats created");
    }
  }

  // Decide destination based on profile
  let dest = "/onboarding";
  
  if (profile) {
    console.log("Profile data:", {
      questionnaire_completed: profile.questionnaire_completed,
      federal_school_code: profile.federal_school_code,
    });

    if (profile.questionnaire_completed) {
      dest = "/dashboard";
    } else {
      const code = profile.federal_school_code;
      const hasCode = code !== null && code !== undefined && String(code).trim() !== "";
      
      if (hasCode) {
        dest = "/questionnaire";
      } else {
        dest = "/onboarding";
      }
    }
  }

  console.log("Redirecting to:", dest);
  console.log("=== AUTH CALLBACK END ===");

  // Handle different environments
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocal = process.env.NODE_ENV === "development";

  if (isLocal) {
    return NextResponse.redirect(`${origin}${dest}`);
  }
  
  if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${dest}`);
  }
  
  return NextResponse.redirect(`${origin}${dest}`);
}