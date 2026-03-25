import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { LogoutButton } from './logout-button'

export default async function DashboardPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold">Welcome to Feedback Platform</h1>
        <p className="mb-6 text-gray-600">
          Signed in as <span className="font-medium">{user.email}</span>
        </p>
        <p className="mb-6 text-sm text-gray-500">
          Your continuous feedback dashboard is coming soon. This is Phase 1 — auth is live.
        </p>
        <LogoutButton />
      </div>
    </div>
  )
}
