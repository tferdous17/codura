import React from "react";
import { createClient } from "@/utils/supabase/server";
import { Dashboard } from "@/components/dashboard";
import { redirect } from "next/navigation";
import { resetQuestionnaire } from "./action";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("full_name, avatar_url, email, questionnaire_completed")
    .eq("user_id", user.id)
    .single();

  const { data: userDashboard } = await supabase
    .from("user_profile")
    .select("problems_solved, university_rank, mock_interviews, day_streak")
    .eq("user_id", user.id)
    .single();

  const completed = userData?.questionnaire_completed === true;

  return (
    <Dashboard
      userData={{
        full_name: userData?.full_name || user.email?.split('@')[0] || "User",
        avatar_url: userData?.avatar_url || null,
        email: userData?.email || user.email || "",
      }}
      userDashboard={{
        problems_solved: userDashboard?.problems_solved || 0,
        university_rank: userDashboard?.university_rank || 0,
        mock_interviews: userDashboard?.mock_interviews || 0,
        day_streak: userDashboard?.day_streak || 0,
      }}
      questionnaireCompleted={completed}
      resetQuestionnaireAction={resetQuestionnaire}
    />
  );
}