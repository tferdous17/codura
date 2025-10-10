import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const supabase = await createClient();
    const { username } = params;

    // Get user by username
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('user_id, username, full_name, avatar_url, bio, location, current_role, education, github_username, linkedin_username, personal_website')
      .eq('username', username)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userData.user_id;

    // Fetch user stats
    const { data: stats, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (statsError) {
      console.error('Error fetching user stats:', statsError);
    }

    // Fetch recent submissions (limit to 50 for public view)
    const { data: submissions, error: submissionsError } = await supabase
      .from('user_submissions')
      .select(`
        id,
        user_id,
        problem_id,
        status,
        language,
        runtime,
        memory,
        submitted_at,
        problems (
          id,
          leetcode_id,
          title,
          title_slug,
          difficulty,
          acceptance_rate
        )
      `)
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })
      .limit(50);

    if (submissionsError) {
      console.error('Error fetching submissions:', submissionsError);
    }

    // Fetch public lists only
    const { data: userLists, error: listsError } = await supabase
      .from('user_problem_lists')
      .select('*')
      .eq('user_id', userId)
      .eq('is_public', true)
      .order('created_at', { ascending: true });

    if (listsError) {
      console.error('Error fetching user lists:', listsError);
    }

    // Get problem counts and solved counts for each public list
    const publicListsWithCounts = await Promise.all(
      (userLists || []).map(async (list) => {
        // Get total problem count
        const { count: problemCount } = await supabase
          .from('user_list_problems')
          .select('*', { count: 'exact', head: true })
          .eq('list_id', list.id);

        // Get solved count for the list owner
        const { data: solvedProblems } = await supabase
          .from('user_list_problems')
          .select('problem_id, user_problem_progress!inner(is_solved)')
          .eq('list_id', list.id)
          .eq('user_problem_progress.user_id', userId)
          .eq('user_problem_progress.is_solved', true);

        return {
          ...list,
          problem_count: problemCount || 0,
          solved_count: solvedProblems?.length || 0
        };
      })
    );

    // Fetch achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select(`
        achievement_id,
        earned_at,
        achievements (
          name,
          description,
          icon,
          color,
          requirement_type,
          requirement_value
        )
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (achievementsError) {
      console.error('Error fetching achievements:', achievementsError);
    }

    // Format achievements
    const formattedAchievements = (achievements || []).map((ua: any) => ({
      achievement_id: ua.achievement_id,
      name: ua.achievements.name,
      description: ua.achievements.description,
      icon: ua.achievements.icon,
      color: ua.achievements.color,
      earned_at: ua.earned_at,
      requirement_type: ua.achievements.requirement_type,
      requirement_value: ua.achievements.requirement_value,
    }));

    // Calculate achievement summary
    const achievementSummary = {
      total_achievements: formattedAchievements.length,
      latest_achievement_name: formattedAchievements[0]?.name || null,
      latest_achievement_date: formattedAchievements[0]?.earned_at || null,
      achievement_progress: formattedAchievements,
    };

    return NextResponse.json({
      profile: userData,
      stats: stats || {
        user_id: userId,
        total_solved: 0,
        easy_solved: 0,
        medium_solved: 0,
        hard_solved: 0,
        current_streak: 0,
        longest_streak: 0,
        total_submissions: 0,
      },
      submissions: submissions || [],
      achievements: formattedAchievements,
      achievementSummary,
      publicLists: publicListsWithCounts,
    });
  } catch (error) {
    console.error('Error in public profile GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
