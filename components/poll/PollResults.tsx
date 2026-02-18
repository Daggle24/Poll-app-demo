'use client'

import useSWR from 'swr'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ResultOptionRow } from '@/components/poll/ResultOptionRow'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

interface ResultItem {
  optionId: string
  text: string
  votes: number
  percentage: number
}

interface ResultsData {
  question: string
  totalVotes: number
  results: ResultItem[]
}

async function fetcher (url: string): Promise<ResultsData> {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch results')
  return res.json()
}

interface PollResultsProps {
  pollId: string
  className?: string
}

export function PollResults ({ pollId, className }: PollResultsProps) {
  const { data, error, isLoading } = useSWR<ResultsData>(
    `/api/polls/${pollId}/results`,
    fetcher,
    { refreshInterval: 3000, revalidateOnFocus: true }
  )

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <Spinner className="size-8" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className={cn('rounded-xl border border-border bg-card p-6 text-center text-muted-foreground', className)}>
        Unable to load results. Please try again.
      </div>
    )
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{data.question}</h1>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.results.map((result, i) => (
          <ResultOptionRow
            key={result.optionId}
            index={i + 1}
            text={result.text}
            votes={result.votes}
            percentage={result.percentage}
          />
        ))}
        <p className="text-muted-foreground pt-2 text-sm">
          {data.totalVotes} vote{data.totalVotes !== 1 ? 's' : ''} total
        </p>
      </CardContent>
    </Card>
  )
}
