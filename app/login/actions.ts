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
  redirect('/dashboard')
}



/**
 * Function to handle user signup
 * @param formData - FormData from signup form
 */
/**
 * Function to handle user signup
 * @param formData - FormData from signup form
 */
export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: formData.get("full_name") as string,
      },
    },
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp(data)

  if (signUpError || !signUpData.user) {
    console.error(signUpError)
    redirect("/error")
  }

  const user = signUpData.user

  // Insert into users table
  const { error: userError } = await supabase.from("users").insert([
    {
      user_id: user.id,
      full_name: formData.get("full_name") as string,
      email: user.email,
      avatar_url: user.user_metadata?.avatar_url ?? null,
      major: null,
      age: null,
      academic_year: null,
      daily_streak: 0,
      points: 0,
      questionnaire_completed: false,
    },
  ])

  if (userError) {
    console.error("Error inserting into users:", userError)
  }

  // Insert into user_profile table
  const { error: profileError } = await supabase.from("user_profile").insert([
    {
      user_id: user.id,
      full_name: formData.get("full_name") as string,
      day_streak: 0,
      mock_interviews: 0,
      university_rank: null,
      topics_studying: [],
      universityID: null,
      problems_solved: 0,
    },
  ])

  if (profileError) {
    console.error("Error inserting into user_profile:", profileError)
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}




/**
 * Function to handle GitHub OAuth login
 */
export async function signInWithGithub() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: 'http://localhost:3000/auth/callback?next=/dashboard'
    }
  })

  if (error) {
    console.log(error)
    redirect('/error')
  }

  
  /**
   * Redirect to GitHub for authentication
   * After GitHub auth, user will be redirected back to /auth/callback
   * which will then redirect to /dashboard
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
      redirectTo: 'http://localhost:3000/auth/callback?next=/dashboard',

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
   * which will then redirect to /dashboard
   */
  if (data.url) {
    redirect(data.url)
  }
}