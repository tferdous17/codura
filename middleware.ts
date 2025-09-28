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

  // If logged in, check questionnaire flag
  if (user) {
    const { data: profile, error } = await supabase
      .from("users")
      .select("questionnaire_completed")
      .eq("user_id", user.id)
      .single();

    // If we can read the row and it’s NOT completed, force them to questionnaire
    if (!error && profile && !profile.questionnaire_completed) {
      const onQuestionnairePage = pathname === "/questionnaire";
      const onAuth = isAuthRoute || pathname === "/logout";
      if (!onQuestionnairePage && !onAuth) {
        return NextResponse.redirect(new URL("/questionnaire", origin));
      }
    }

    // Optional: if already completed and they go to /questionnaire, kick to /dashboard
    if (!error && profile?.questionnaire_completed && pathname === "/questionnaire") {
      return NextResponse.redirect(new URL("/dashboard", origin));
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