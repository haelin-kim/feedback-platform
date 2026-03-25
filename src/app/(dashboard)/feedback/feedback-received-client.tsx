'use client'

import { useRouter } from 'next/navigation'
import { FeedbackComposer } from '@/components/feedback/feedback-composer'
import { FeedbackCard } from '@/components/feedback/feedback-card'

type User = { id: string; first_name: string; last_name: string; email: string }
type Entry = {
  id: string
  content: string
  type: string
  visibility: string
  direction: string | null
  created_at: string | null
  author: { id: string; first_name: string; last_name: string } | null
  recipient: { id: string; first_name: string; last_name: string } | null
  acknowledged: boolean
}

export function FeedbackReceivedClient({
  currentUserId,
  tenantId,
  users,
  initialEntries,
}: {
  currentUserId: string
  tenantId: string
  users: User[]
  initialEntries: Entry[]
}) {
  const router = useRouter()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Feedback Received</h1>
          <p className="text-sm text-gray-500">Feedback others have shared with you</p>
        </div>
        <FeedbackComposer
          currentUserId={currentUserId}
          tenantId={tenantId}
          users={users}
          onSuccess={() => router.refresh()}
        />
      </div>

      {initialEntries.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center">
          <p className="text-gray-500">No feedback received yet.</p>
          <p className="mt-1 text-sm text-gray-400">
            When someone gives you feedback, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {initialEntries.map((entry) => (
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
  )
}
