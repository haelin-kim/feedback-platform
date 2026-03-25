'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FeedbackCard } from '@/components/feedback/feedback-card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Send, Brain, TrendingUp, AlertTriangle, Activity } from 'lucide-react'
import Link from 'next/link'

type Person = { id: string; first_name: string; last_name: string; email?: string } | null

type Entry = {
  id: string
  content: string
  type: string
  visibility: string
  direction: string | null
  created_at: string | null
  author: { id: string; first_name: string; last_name: string } | null
  recipient: Person
  acknowledged: boolean
}

type AISummary = {
  summary_text: string
  strengths: unknown
  improvement_areas: unknown
  bi_directionality_score: number | null
  feedback_cadence_pct: number | null
  generated_at: string | null
} | null

export function ExchangeThreadClient({
  thread,
  currentUserId,
  entries,
  aiSummary,
}: {
  thread: {
    id: string
    tenant_id: string
    manager: Person
    direct_report: Person
  }
  currentUserId: string
  entries: Entry[]
  aiSummary: AISummary
}) {
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const isManager = thread.manager?.id === currentUserId
  const otherPerson = isManager ? thread.direct_report : thread.manager

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    setSending(true)
    await supabase.from('feedback_entries').insert({
      tenant_id: thread.tenant_id,
      author_id: currentUserId,
      recipient_id: otherPerson?.id || '',
      type: 'exchange',
      visibility: 'exchange',
      direction: isManager ? 'downward' : 'upward',
      exchange_thread_id: thread.id,
      content: content.trim(),
    })
    setContent('')
    setSending(false)
    router.refresh()
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <div className="mb-6">
          <Link
            href="/exchange"
            className="mb-2 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Exchanges
          </Link>
          <h1 className="text-2xl font-bold">
            Exchange with {otherPerson?.first_name} {otherPerson?.last_name}
          </h1>
          <p className="text-sm text-gray-500">
            You are the {isManager ? 'manager' : 'direct report'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <Card>
            <CardContent className="pt-4">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share feedback with this thread..."
                rows={3}
              />
              <div className="mt-3 flex items-center justify-between">
                <Badge variant="outline">
                  {isManager ? 'Manager → DR' : 'DR → Manager'}
                </Badge>
                <Button type="submit" size="sm" disabled={sending || !content.trim()}>
                  <Send className="mr-1 h-3 w-3" />
                  {sending ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        {entries.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center">
            <p className="text-gray-500">No feedback in this thread yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <FeedbackCard
                key={entry.id}
                entry={entry}
                currentUserId={currentUserId}
                onAcknowledged={() => router.refresh()}
              />
            ))}
          </div>
        )}
      </div>

      {/* AI Analytics Sidebar */}
      <aside className="w-72 shrink-0">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="h-4 w-4" /> AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiSummary ? (
              <>
                <p className="text-sm text-gray-700">{aiSummary.summary_text}</p>

                {aiSummary.strengths && (
                  <div>
                    <h4 className="flex items-center gap-1 text-xs font-semibold text-green-700">
                      <TrendingUp className="h-3 w-3" /> Strengths
                    </h4>
                    <ul className="mt-1 space-y-1 text-xs text-gray-600">
                      {(aiSummary.strengths as string[]).map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiSummary.improvement_areas && (
                  <div>
                    <h4 className="flex items-center gap-1 text-xs font-semibold text-orange-700">
                      <AlertTriangle className="h-3 w-3" /> Areas for Growth
                    </h4>
                    <ul className="mt-1 space-y-1 text-xs text-gray-600">
                      {(aiSummary.improvement_areas as string[]).map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiSummary.bi_directionality_score !== null && (
                  <div>
                    <h4 className="flex items-center gap-1 text-xs font-semibold text-blue-700">
                      <Activity className="h-3 w-3" /> Bi-directionality
                    </h4>
                    <p className="text-xs text-gray-600">
                      {Math.round(aiSummary.bi_directionality_score * 100)}% balanced
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs text-gray-400">
                AI insights will appear once there is enough feedback in this thread.
              </p>
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}
