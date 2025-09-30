'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

/**
 * Get the base URL dynamically
 */
async function getURL() {
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  return `${protocol}://${host}`
}

/**
 * Function to handle user login
 * @param formData - FormData from login form
 */
export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login error:', error)
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
/**
 * Function to handle user signup
 * @param formData - FormData from signup form
 */
export async function signup(formData: FormData) {
  console.log('=== SIGNUP ACTION START ===')
  const supabase = await createClient()
}