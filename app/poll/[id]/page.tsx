import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPoll } from '@/modules/poll/poll.service'
import { votedCookieName } from '@/lib/cookies'
import { PublicPollShell } from '@/components/public-poll-shell'
import { PollVoteForm } from '@/components/poll/PollVoteForm'
import { PollResults } from '@/components/poll/PollResults'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata ({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const poll = await getPoll(id)
  if (!poll) return { title: 'Poll not found' }
  return {
    title: `${poll.question} — PollApp`,
    description: `Vote in this poll: ${poll.question}`
  }
}

export default async function PollPage ({ params }: PageProps) {
  const { id: pollId } = await params
  const poll = await getPoll(pollId)
  if (!poll) notFound()

  const cookieStore = await cookies()
  const hasVoted = cookieStore.get(votedCookieName(pollId))?.value === 'true'
  const showResults = hasVoted || !poll.isActive

  return (
    <PublicPollShell>
      <div className="space-y-6">
        {showResults ? (
          <>
            {!poll.isActive && (
              <div className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-center text-sm text-muted-foreground">
                This poll is closed. Results are final.
              </div>
            )}
            <PollResults pollId={pollId} />
          </>
        ) : (
          <PollVoteForm
            pollId={poll.id}
            question={poll.question}
            options={poll.options.map((o) => ({ id: o.id, text: o.text }))}
          />
        )}
      </div>
    </PublicPollShell>
  )
}
