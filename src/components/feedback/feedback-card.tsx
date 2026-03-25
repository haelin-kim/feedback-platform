'use client'

import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, MessageSquare, ArrowDown, ArrowUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

type FeedbackEntry = {
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

const typeBadgeColor: Record<string, string> = {
  praise: 'bg-green-100 text-green-800',
  private: 'bg-blue-100 text-blue-800',
  manager_note: 'bg-purple-100 text-purple-800',
  exchange: 'bg-orange-100 text-orange-800',
}

export function FeedbackCard({
  entry,
  currentUserId,
  showRecipient = false,
  onAcknowledged,
}: {
  entry: FeedbackEntry
  currentUserId: string
  showRecipient?: boolean
  onAcknowledged?: () => void
}) {
  const [acknowledging, setAcknowledging] = useState(false)
  const supabase = createClient()

  const isRecipient = entry.recipient?.id === currentUserId
  const personLabel = showRecipient
    ? `To ${entry.recipient?.first_name} ${entry.recipient?.last_name}`
    : `From ${entry.author?.first_name} ${entry.author?.last_name}`

  async function handleAcknowledge() {
    setAcknowledging(true)
    await supabase.from('feedback_acknowledgments').insert({
      feedback_id: entry.id,
      acknowledged_by: currentUserId,
    })
    setAcknowledging(false)
    onAcknowledged?.()
  }

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{personLabel}</span>
            {entry.direction && (
              entry.direction === 'downward'
                ? <ArrowDown className="h-3 w-3 text-gray-400" />
                : <ArrowUp className="h-3 w-3 text-gray-400" />
            )}
            <Badge variant="secondary" className={typeBadgeColor[entry.type] || ''}>
              {entry.type.replace('_', ' ')}
            </Badge>
            {entry.visibility !== 'public' && (
              <Badge variant="outline" className="text-xs">
                {entry.visibility.replace(/_/g, ' ')}
              </Badge>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {entry.created_at
              ? formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })
              : ''}
          </span>
        </div>
        <p className="mb-3 text-sm text-gray-700 whitespace-pre-wrap">{entry.content}</p>
        <div className="flex items-center gap-2">
          {isRecipient && !entry.acknowledged && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleAcknowledge}
              disabled={acknowledging}
            >
              <Check className="mr-1 h-3 w-3" />
              Acknowledge
            </Button>
          )}
          {entry.acknowledged && (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <Check className="h-3 w-3" /> Acknowledged
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
