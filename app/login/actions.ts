'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'


/**
 * Function to handle user login
 * @param formData - FormData from login form
 */
export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')

  // Decide destination based on onboarding flags
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('federal_school_code, questionnaire_completed')
    .eq('user_id', user.id)
    .single()

  const fafsaCode = (profile?.federal_school_code ?? '').trim()
  const hasValidCode = /^[0-9A-Za-z]{6}$/.test(fafsaCode)
  const isCompleted = !!profile?.questionnaire_completed

  if (isCompleted) {
    redirect('/dashboard')
  } else if (hasValidCode) {
    redirect('/questionnaire')
  } else {
    redirect('/onboarding')
  }
}



/**
 * Function to handle user signup
 * @param formData - FormData from signup form
 */
export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
        // avatar_url: formData.get('avatar_url') as string, // coming soon
      }
    }
  }


  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.log(error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/onboarding')
}




/**
 * Function to handle GitHub OAuth login
 */
export async function signInWithGithub() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: 'http://localhost:3000/auth/callback'
    }
  })

  if (error) {
    console.log(error)
    redirect('/error')
  }

  
  /**
   * Redirect to GitHub for authentication
   * After GitHub auth, user will be redirected back to /auth/callback
   * which will then decide onboarding → questionnaire → dashboard.
   */
  if (data.url) {
    redirect(data.url)
  }
}



export async function signInWithGoogle() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:3000/auth/callback',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  })

  if (error) {
    console.log(error)
    redirect('/error')
  }

  /**
   * Redirect to Google for authentication
   * After Google auth, user will be redirected back to /auth/callback
   * which will then decide onboarding → questionnaire → dashboard.
   */
  if (data.url) {
    redirect(data.url)
  }
}