import Link from 'next/link'
import { auth } from '@/auth.config'
import { redirect } from 'next/navigation'
import { getAdminPolls } from '@/modules/poll/poll.service'
import { PollListItem } from '@/components/admin/PollListItem'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default async function DashboardPage () {
  const session = await auth()
  if (!session?.user?.id) redirect('/admin/login')

  const polls = await getAdminPolls(session.user.id)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Your polls</h1>
        <Button asChild>
          <Link href="/admin/dashboard/new">New poll</Link>
        </Button>
      </div>
      {polls.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">No polls yet.</p>
            <Button asChild>
              <Link href="/admin/dashboard/new">Create your first poll</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {polls.map((poll) => (
            <PollListItem
              key={poll.id}
              id={poll.id}
              question={poll.question}
              voteCount={poll._count.votes}
              createdAt={poll.createdAt}
              isActive={poll.isActive}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
