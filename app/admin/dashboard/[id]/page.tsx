import Link from 'next/link'
import { auth } from '@/auth.config'
import { redirect } from 'next/navigation'
import { getPoll } from '@/modules/poll/poll.service'
import { PollResults } from '@/components/poll/PollResults'
import { PollDetailActions } from '@/components/admin/PollDetailActions'
import { Button } from '@/components/ui/button'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PollDetailPage ({ params }: PageProps) {
  const session = await auth()
  if (!session?.user?.id) redirect('/admin/login')

  const { id } = await params
  const poll = await getPoll(id)
  if (!poll) redirect('/admin/dashboard')
  if (poll.adminId !== session.user.id) redirect('/admin/dashboard')

  return (
    <div className="mx-auto max-w-2xl lg:max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/dashboard">← Back to polls</Link>
        </Button>
      </div>
      <PollDetailActions pollId={id} isActive={poll.isActive} />
      <PollResults pollId={id} />
    </div>
  )
}
