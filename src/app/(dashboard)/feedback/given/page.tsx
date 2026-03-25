import { createServerSupabase } from '@/lib/supabase/server'
import { FeedbackGivenClient } from './feedback-given-client'

export default async function FeedbackGivenPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('users')
    .select('id, tenant_id')
    .eq('id', user.id)
    .single()

  if (!profile) return null

  const { data: users } = await supabase
    .from('users')
    .select('id, first_name, last_name, email')
    .eq('tenant_id', profile.tenant_id)
    .eq('employment_status', 'active')

  const { data: feedbackEntries } = await supabase
    .from('feedback_entries')
    .select('*, author:users!feedback_entries_author_id_fkey(id, first_name, last_name), recipient:users!feedback_entries_recipient_id_fkey(id, first_name, last_name)')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const entries = (feedbackEntries || []).map((f) => ({
    ...f,
    author: Array.isArray(f.author) ? f.author[0] || null : f.author,
    recipient: Array.isArray(f.recipient) ? f.recipient[0] || null : f.recipient,
    acknowledged: false,
  }))

  return (
    <FeedbackGivenClient
      currentUserId={user.id}
      tenantId={profile.tenant_id}
      users={users || []}
      initialEntries={entries}
    />
  )
}
