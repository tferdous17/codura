import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get the currently authenticated user
  const { data: { user } } = await supabase.auth.getUser()


  // Getting user's email and id, if they're not authenticated, middleware should handle redirect
  const email = user!.email
  const userId = user!.id


  // Only get the current user's data with error handling
  const { data: userData, error: dbError } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single()



  // Handle database errors gracefully
  if (dbError) {
    alert('Error fetching user data.')
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen  gap-5'>
      <h1 className='text-white text-4xl font-bold'>Dashboard</h1>
    
      <p className='text-violet-500'>You are logged in as: {email}</p>

      {/* Display user data */}
      {userData && (
        <div className='text-white'>
          <p>User ID: {userData.user_id}</p>
          <p>Name: {userData.full_name}</p>
          <p>Is Student: {userData.is_student ? 'Yes' : 'No'}</p>
          <p>Points: {userData.points}</p>
          <p>Daily Streak: {userData.daily_streak}</p>
          <p>University id: {userData.university_id}</p>
          <p>Avatar url: {userData.avatar_url}</p>
        </div>
      )}

      {/* Button to sign out */}
      <form action="/auth/signout" method="POST">
        <Button type="submit">Sign Out</Button>
      </form>
    </div>
  )
}
