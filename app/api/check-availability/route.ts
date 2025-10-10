import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const { username, email } = await request.json()

    if (!username || !email) {
      return NextResponse.json(
        { error: 'Username and email are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if username exists
    const { data: usernameData } = await supabase
      .from('users')
      .select('username')
      .eq('username', username.toLowerCase())
      .maybeSingle()

    // Check if email exists
    const { data: emailData } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle()

    const usernameAvailable = !usernameData
    const emailAvailable = !emailData
    const available = usernameAvailable && emailAvailable

    return NextResponse.json({
      available,
      usernameAvailable,
      emailAvailable,
    })
  } catch (error) {
    console.error('Check availability error:', error)
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    )
  }
}
