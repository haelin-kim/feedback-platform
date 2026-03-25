import { createServerSupabase } from '@/lib/supabase/server'
import { FeedbackReceivedClient } from './feedback-received-client'

export default async function FeedbackReceivedPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get user profile for tenant_id
  const { data: profile } = await supabase
    .from('users')
    .select('id, tenant_id, first_name, last_name')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return (
      <div className="rounded-lg bg-white p-8 text-center">
        <h2 className="text-lg font-semibold">Profile not found</h2>
        <p className="text-sm text-gray-500 mt-2">
          Your user profile hasn&apos;t been created yet. Please contact an admin.
        </p>
      </div>
    )
  }

  // Get all users in tenant for the composer
  const { data: users } = await supabase
    .from('users')
    .select('id, first_name, last_name, email')
    .eq('tenant_id', profile.tenant_id)
    .eq('employment_status', 'active')

  // Get feedback received
  const { data: feedbackEntries } = await supabase
    .from('feedback_entries')
    .select('*, author:users!feedback_entries_author_id_fkey(id, first_name, last_name), recipient:users!feedback_entries_recipient_id_fkey(id, first_name, last_name)')
    .eq('recipient_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  // Get acknowledgments for these entries
  const feedbackIds = (feedbackEntries || []).map((f) => f.id)
  const { data: acks } = feedbackIds.length
    ? await supabase
        .from('feedback_acknowledgments')
        .select('feedback_id')
        .in('feedback_id', feedbackIds)
        .eq('acknowledged_by', user.id)
    : { data: [] }

  const ackedIds = new Set((acks || []).map((a) => a.feedback_id))

  const entries = (feedbackEntries || []).map((f) => ({
    ...f,
    author: Array.isArray(f.author) ? f.author[0] || null : f.author,
    recipient: Array.isArray(f.recipient) ? f.recipient[0] || null : f.recipient,
    acknowledged: ackedIds.has(f.id),
  }))

  return (
    <FeedbackReceivedClient
      currentUserId={user.id}
      tenantId={profile.tenant_id}
      users={users || []}
      initialEntries={entries}
    />
  )
}
