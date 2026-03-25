import { createServerSupabase } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ExchangeThreadClient } from './exchange-thread-client'

export default async function ExchangeThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>
}) {
  const { threadId } = await params
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: thread } = await supabase
    .from('exchange_threads')
    .select(`
      id, tenant_id, is_active, created_at,
      manager:users!exchange_threads_manager_id_fkey(id, first_name, last_name, email),
      direct_report:users!exchange_threads_direct_report_id_fkey(id, first_name, last_name, email)
    `)
    .eq('id', threadId)
    .single()

  if (!thread) notFound()

  const manager = Array.isArray(thread.manager) ? thread.manager[0] : thread.manager
  const directReport = Array.isArray(thread.direct_report) ? thread.direct_report[0] : thread.direct_report

  if (manager?.id !== user.id && directReport?.id !== user.id) notFound()

  // Get feedback entries for this thread
  const { data: feedbackEntries } = await supabase
    .from('feedback_entries')
    .select('*, author:users!feedback_entries_author_id_fkey(id, first_name, last_name)')
    .eq('exchange_thread_id', threadId)
    .order('created_at', { ascending: false })
    .limit(50)

  // Get acknowledgments
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
    recipient: manager?.id === f.author_id ? directReport : manager,
    acknowledged: ackedIds.has(f.id),
  }))

  // Get AI summary if exists
  const { data: aiSummary } = await supabase
    .from('ai_feedback_summaries')
    .select('*')
    .eq('exchange_thread_id', threadId)
    .single()

  return (
    <ExchangeThreadClient
      thread={{ ...thread, manager, direct_report: directReport }}
      currentUserId={user.id}
      entries={entries}
      aiSummary={aiSummary}
    />
  )
}
