import Link from 'next/link'
import { PublicPollShell } from '@/components/public-poll-shell'
import { Button } from '@/components/ui/button'

export default function PollNotFound () {
  return (
    <PublicPollShell>
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-bold">Poll not found</h1>
        <p className="text-muted-foreground">
          This poll may have been removed or the link might be incorrect.
        </p>
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </PublicPollShell>
  )
}
