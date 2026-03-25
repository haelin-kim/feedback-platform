import { createServerSupabase } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GitCompareArrows } from 'lucide-react'

export default async function ExchangeListPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: threads } = await supabase
    .from('exchange_threads')
    .select(`
      id, is_active, created_at,
      manager:users!exchange_threads_manager_id_fkey(id, first_name, last_name),
      direct_report:users!exchange_threads_direct_report_id_fkey(id, first_name, last_name)
    `)
    .or(`manager_id.eq.${user.id},direct_report_id.eq.${user.id}`)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const threadList = (threads || []).map((t) => ({
    ...t,
    manager: Array.isArray(t.manager) ? t.manager[0] : t.manager,
    direct_report: Array.isArray(t.direct_report) ? t.direct_report[0] : t.direct_report,
  }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Exchange Threads</h1>
        <p className="text-sm text-gray-500">
          Shared feedback dashboards between managers and direct reports
        </p>
      </div>

      {threadList.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center">
          <GitCompareArrows className="mx-auto mb-3 h-8 w-8 text-gray-400" />
          <p className="text-gray-500">No exchange threads yet.</p>
          <p className="mt-1 text-sm text-gray-400">
            Exchange threads are created automatically when a manager-DR relationship is set up.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {threadList.map((thread) => {
            const otherPerson =
              thread.manager?.id === user.id ? thread.direct_report : thread.manager
            const role = thread.manager?.id === user.id ? 'Manager' : 'Direct Report'

            return (
              <Link key={thread.id} href={`/exchange/${thread.id}`}>
                <Card className="transition-colors hover:bg-gray-50">
                  <CardContent className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-3">
                      <GitCompareArrows className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">
                          {otherPerson?.first_name} {otherPerson?.last_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          You are the {role.toLowerCase()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{role}</Badge>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
