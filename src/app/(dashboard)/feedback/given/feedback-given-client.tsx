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

export function FeedbackGivenClient({
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
          <h1 className="text-2xl font-bold">Feedback Given</h1>
          <p className="text-sm text-gray-500">Feedback you&apos;ve shared with others</p>
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
          <p className="text-gray-500">You haven&apos;t given any feedback yet.</p>
          <p className="mt-1 text-sm text-gray-400">
            Click &quot;Give Feedback&quot; to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {initialEntries.map((entry) => (
            <FeedbackCard
              key={entry.id}
              entry={entry}
              currentUserId={currentUserId}
              showRecipient
            />
          ))}
        </div>
      )}
    </div>
  )
}
