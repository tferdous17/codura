import React from "react";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { resetQuestionnaire } from "./action";  // 👈 import your server action

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const completed = userData?.questionnaire_completed === true;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5">
      <h1 className="text-white text-4xl font-bold">Dashboard</h1>

      <p className="text-violet-500">You are logged in as: {user.email}</p>

      {/* Status pill */}
      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            completed
              ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40"
              : "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40"
          }`}
        >
          {completed ? "Questionnaire: Completed ✅" : "Questionnaire: Not completed"}
        </span>

        {!completed && (
          <Link href="/questionnaire">
            <Button size="sm" variant="secondary">Finish now</Button>
          </Link>
        )}
      </div>

      {/* 👇 Reset button (only when completed) */}
      {completed && (
        <form action={resetQuestionnaire}>
          <Button type="submit" variant="destructive" size="sm">
            Reset Questionnaire (Testing)
          </Button>
        </form>
      )}

      {/* Sign out */}
      <form action="/auth/signout" method="POST">
        <Button type="submit">Sign Out</Button>
      </form>
    </div>
  );
}