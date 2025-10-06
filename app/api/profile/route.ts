import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile (or create if doesn't exist)
    let { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // If no profile exists, create one
    if (!profile) {
      const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

      const { data: newProfile, error: createProfileError } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          full_name: fullName,
        })
        .select()
        .single();

      if (createProfileError) {
        return NextResponse.json({ error: createProfileError.message }, { status: 500 });
      }

      profile = newProfile;
    }

    // Get user stats (or create if doesn't exist)
    let { data: stats, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (statsError) {
      return NextResponse.json({ error: statsError.message }, { status: 500 });
    }

    // If no stats exist, create default stats
    if (!stats) {
      const { data: newStats, error: createStatsError } = await supabase
        .from('user_stats')
        .insert({
          user_id: user.id,
        })
        .select()
        .single();

      if (createStatsError) {
        return NextResponse.json({ error: createStatsError.message }, { status: 500 });
      }

      stats = newStats;
    }

    // Get recent submissions
    const { data: submissions, error: submissionsError } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false })
      .limit(5);

    if (submissionsError) {
      return NextResponse.json({ error: submissionsError.message }, { status: 500 });
    }

    // Get user achievements with achievement details
    const { data: userAchievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select('*, achievements(*)')
      .eq('user_id', user.id);

    if (achievementsError) {
      return NextResponse.json({ error: achievementsError.message }, { status: 500 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      profile: profile || null,
      stats: stats || null,
      submissions: submissions || [],
      achievements: userAchievements || [],
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate and sanitize input
    const {
      username,
      full_name,
      bio,
      avatar_url,
      university,
      graduation_year,
      location,
      job_title,
      website,
      github_username,
      linkedin_username,
    } = body;

    // Check if username is already taken (if changed)
    if (username) {
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('username', username)
        .neq('id', user.id)
        .single();

      if (existingUser) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
      }
    }

    // Upsert profile
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        username,
        full_name,
        bio,
        avatar_url,
        university,
        graduation_year,
        location,
        job_title,
        website,
        github_username,
        linkedin_username,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
