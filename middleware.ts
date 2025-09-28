// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

const PUBLIC_PATHS = new Set<string>([
  "/",
  "/login",
  "/auth/callback",
  "/auth/auth-code-error",
  "/error",
  "/api/health",
  "/onboarding", // allow visiting onboarding
  "/questionnaire", // allow visiting the questionnaire itself
]);

// Paths that should never trigger redirect logic (static, images, etc.)
function isAssetPath(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon.") ||
    /\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml|woff2?)$/i.test(pathname)
  );
}

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  if (isAssetPath(pathname)) {
    return NextResponse.next();
  }

  // Call your Supabase helper (keeps cookies fresh + gives you user)
  const { response, user, supabase } = await updateSession(req);

  // If not logged in and trying to hit protected areas, send to /login
  const isPublic = PUBLIC_PATHS.has(pathname);
  const isAuthRoute = pathname.startsWith("/auth");

  if (!user && !isPublic && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  // If logged in, handle the onboarding flow
  if (user) {
    const { data: profile, error } = await supabase
      .from("users")
      .select("questionnaire_completed, federal_school_code")
      .eq("user_id", user.id)
      .single();

    if (!error && profile) {
      const onQuestionnairePage = pathname === "/questionnaire";
      const onOnboardingPage = pathname === "/onboarding";
      const onDashboardPage = pathname === "/dashboard";
      const onAuth = isAuthRoute || pathname === "/logout";

      // Determine school code presence
      const code = profile.federal_school_code;
      const hasCode = code !== null && code !== undefined && String(code).trim() !== "";
      const completed = profile.questionnaire_completed;

      // Case 1: Questionnaire already completed → dashboard
      if (completed) {
        if (!onDashboardPage && !onAuth) {
          return NextResponse.redirect(new URL("/dashboard", origin));
        }
        return response;
      }

      // Case 2: Questionnaire not completed
      if (!completed) {
        if (!hasCode) {
          // No code:
          // - Default to onboarding
          // - But if already on questionnaire (after "No school" server redirect), allow it
          if (!onOnboardingPage && !onQuestionnairePage && !onAuth) {
            return NextResponse.redirect(new URL("/onboarding", origin));
          }
        } else {
          // Has code but questionnaire not completed → questionnaire
          if (!onQuestionnairePage && !onAuth) {
            return NextResponse.redirect(new URL("/questionnaire", origin));
          }
        }
      }
    }
  }

  // Default: continue the request (with any set cookies from updateSession)
  return response;
}

// ✅ Matcher: run middleware for everything except static assets (extra safety)
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml|woff2?|ttf)$).*)",
  ],
};