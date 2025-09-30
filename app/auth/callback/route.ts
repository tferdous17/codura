import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/dashboard'
  const error = url.searchParams.get('error')
  const error_description = url.searchParams.get('error_description')

  if (error) {
    console.error('OAuth callback error:', error, error_description)
    return NextResponse.redirect(new URL('/auth/auth-code-error', url.origin))
  }

  const supabase = await createClient()

  if (code) {
    const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code)
    if (exchangeErr) {
      console.error('exchangeCodeForSession failed:', exchangeErr)
      return NextResponse.redirect(new URL('/auth/auth-code-error', url.origin))
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const full_name =
        (user.user_metadata?.full_name as string) ||
        user.user_metadata?.name ||
        user.email?.split('@')[0] ||
        'New User'

      const avatar_url = (user.user_metadata?.avatar_url as string) ?? null
      const email = user.email

      // --- Upsert into `users` table ---
      const { error: usersErr } = await supabase
        .from('users')
        .upsert(
          {
            user_id: user.id,
            full_name,
            avatar_url,
            email,              // Add email if your schema supports it
            points: 0,          // default values for new users
            daily_streak: 0,
            questionnaire_completed: false,
            major: "",
            age:0,
            academic_year:2025,
            
          },
          { onConflict: 'user_id' }
        )

      if (usersErr) console.error('users upsert failed:', usersErr)

      // --- Upsert into `user_profile` table ---
      const { error: profileErr } = await supabase
        .from('user_profile')
        .upsert(
          {
            user_id: user.id,
            full_name,
            day_streak: 0,
            mock_interviews: 0,
            university_rank: 0,
            universityID: null,
            problems_solved: 0,
            topics_studying: [],
          },
          { onConflict: 'user_id' }
        )

      if (profileErr) console.error('profile upsert failed:', profileErr)
    }
  }

  return NextResponse.redirect(new URL(next, url.origin))
}
