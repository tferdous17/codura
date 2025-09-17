import React from 'react'
import { createClient } from '@/utils/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: students } = await supabase.from('students').select('*')

  return (
    <div>
        <h1 className='text-white'>Dashboard</h1>
      {students?.map((student) => (
        <div className='text-white' 
        key={student.student_id}>
            {student.student_id}, {student.full_name}, {student.university_id}, {student.points}
        </div>
      ))}
    </div>
  )
}
