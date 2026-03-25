'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'

type User = {
  id: string
  first_name: string
  last_name: string
  email: string
}

export function FeedbackComposer({
  currentUserId,
  tenantId,
  users,
  onSuccess,
}: {
  currentUserId: string
  tenantId: string
  users: User[]
  onSuccess?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [recipientId, setRecipientId] = useState('')
  const [type, setType] = useState<string>('praise')
  const [visibility, setVisibility] = useState<string>('public')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!recipientId || !content.trim()) return

    setLoading(true)
    setError('')

    const { error: insertError } = await supabase
      .from('feedback_entries')
      .insert({
        tenant_id: tenantId,
        author_id: currentUserId,
        recipient_id: recipientId,
        type,
        visibility,
        content: content.trim(),
      })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setContent('')
    setRecipientId('')
    setType('praise')
    setVisibility('public')
    setOpen(false)
    setLoading(false)
    onSuccess?.()
  }

  const otherUsers = users.filter((u) => u.id !== currentUserId)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button><Plus className="mr-2 h-4 w-4" />Give Feedback</Button>}
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Give Feedback</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Recipient</Label>
            <Select value={recipientId} onValueChange={(value) => setRecipientId(value ?? '')}>
              <SelectTrigger>
                <SelectValue placeholder="Select a person" />
              </SelectTrigger>
              <SelectContent>
                {otherUsers.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.first_name} {u.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(value) => setType(value ?? '')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="praise">Praise</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="manager_note">Manager Note</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <Label>Visibility</Label>
              <Select value={visibility} onValueChange={(value) => setVisibility(value ?? '')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="private_with_manager">Private + Manager</SelectItem>
                  <SelectItem value="manager_only">Manager Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Feedback</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What would you like to share? Use SBI format: Situation, Behavior, Impact..."
              rows={4}
              required
            />
            <p className="text-xs text-gray-500">
              Tip: Be specific about the situation, describe the behavior you observed, and explain the impact.
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !recipientId || !content.trim()}>
              {loading ? 'Sending...' : 'Send Feedback'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
