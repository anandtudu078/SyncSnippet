import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Profile</h1>
        <div className="space-y-2 text-gray-700 dark:text-gray-300">
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">GitHub Username:</span> {user.user_metadata?.user_name || 'N/A'}</p>
          <p><span className="font-medium">Plan:</span> Free</p>
        </div>
      </div>
    </div>
  )
}