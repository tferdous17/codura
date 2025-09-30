// app/dashboard/page.tsx
import { createClient } from "@/utils/supabase/server"
import { Dashboard } from "@/components/dashboard"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get the currently authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-xl font-bold">Not logged in</h1>
        <p className="text-gray-600">Please log in to access your dashboard.</p>
      </div>
    )
  }

  // Query `users` table
  const { data: userRow } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()

  // Query `user_profile` table
  const { data: profileRow } = await supabase
    .from("user_profile")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()

  return (
    <Dashboard
      userData={{
        full_name:
          userRow?.full_name ??
          profileRow?.full_name ??
          user.user_metadata?.full_name ??
          user.email?.split("@")[0] ??
          "New User",
        avatar_url: userRow?.avatar_url ?? null,
        email: user.email!,
      }}
      userDashboard={{
        problems_solved: profileRow?.problems_solved ?? 0,
        university_rank: profileRow?.university_rank ?? null,
        mock_interviews: profileRow?.mock_interviews ?? 0,
        day_streak: profileRow?.day_streak ?? 0,
      }}
    />
  )
}
