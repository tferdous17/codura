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

  // Get the OAuth provider from the user's app_metadata
  const provider = user.app_metadata?.provider || user.app_metadata?.providers?.[0];
  console.log("OAuth provider:", provider);

  // Check if user row already exists in unified users table
  const { data: existingUser, error: checkError } = await supabase
    .from("users")
    .select("user_id, federal_school_code, questionnaire_completed, email")
    .eq("user_id", user.id)
    .maybeSingle();

  console.log("Existing user:", existingUser);
  console.log("Check error:", checkError);

  let profile = existingUser;

  // If user doesn't exist, create them in unified users table
  // The trigger will automatically create user_stats entry
  if (!existingUser) {
    console.log("Creating new user row...");

    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.user_name ||
      user.email?.split('@')[0] ||
      "User";

    const email = user.email || "";

    // Check if a user with this email already exists (signed up with different method)
    if (email) {
      const { data: emailUser, error: emailCheckError } = await supabase
        .from("users")
        .select("user_id, email")
        .eq("email", email)
        .maybeSingle();

      if (emailUser) {
        console.error(`User with email ${email} already exists with user_id: ${emailUser.user_id}`);
        console.error(`Attempted ${provider} OAuth signup with existing email`);
        return NextResponse.redirect(`${origin}/error?message=account_exists`);
      }

      if (emailCheckError) {
        console.error("Email check error:", emailCheckError);
      }
    }

    // For GitHub OAuth, verify no existing GitHub user
    if (provider === 'github' && user.user_metadata?.provider_id) {
      const { data: githubUser, error: githubCheckError } = await supabase
        .from("users")
        .select("user_id")
        .eq("github_id", user.user_metadata.provider_id)
        .maybeSingle();

      if (githubUser) {
        console.error(`GitHub user already exists: ${user.user_metadata.provider_id}`);
        return NextResponse.redirect(`${origin}/error?message=github_account_exists`);
      }

      if (githubCheckError) {
        console.error("GitHub check error:", githubCheckError);
      }
    }

    // For Google OAuth, verify no existing Google user
    if (provider === 'google' && user.user_metadata?.provider_id) {
      const { data: googleUser, error: googleCheckError } = await supabase
        .from("users")
        .select("user_id")
        .eq("google_id", user.user_metadata.provider_id)
        .maybeSingle();

      if (googleUser) {
        console.error(`Google user already exists: ${user.user_metadata.provider_id}`);
        return NextResponse.redirect(`${origin}/error?message=google_account_exists`);
      }

      if (googleCheckError) {
        console.error("Google check error:", googleCheckError);
      }
    }

    // Create entry in unified users table
    // Trigger will automatically create user_stats
    const insertData: any = {
      user_id: user.id,
      full_name: fullName,
      email: email,
      federal_school_code: null,
      questionnaire_completed: false,
      avatar_url: user.user_metadata?.avatar_url || null,
    };

    // Store provider IDs if available
    if (provider === 'github' && user.user_metadata?.provider_id) {
      insertData.github_id = user.user_metadata.provider_id;
    }
    if (provider === 'google' && user.user_metadata?.provider_id) {
      insertData.google_id = user.user_metadata.provider_id;
    }

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert(insertData)
      .select("user_id, federal_school_code, questionnaire_completed, email")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
    } else {
      console.log("New user created:", newUser);
      console.log("User stats auto-created by trigger");
      profile = newUser;
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

