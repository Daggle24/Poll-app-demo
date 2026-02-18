'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PollOptionRow } from '@/components/poll/PollOptionRow'
import { VoteButton } from '@/components/poll/VoteButton'
import { setVotedCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'

interface Option {
  id: string
  text: string
}

interface PollVoteFormProps {
  pollId: string
  question: string
  options: Option[]
}

export function PollVoteForm ({ pollId, question, options }: PollVoteFormProps) {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit (e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!selectedId) {
      setError('Please select an option')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId: selectedId })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to submit vote')
        setIsSubmitting(false)
        return
      }
      setVotedCookie(pollId)
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{question}</h1>
        </CardHeader>
        <CardContent className="space-y-3">
          {options.map((option, i) => (
            <PollOptionRow
              key={option.id}
              index={i + 1}
              text={option.text}
              selected={selectedId === option.id}
              onSelect={() => setSelectedId(option.id)}
            />
          ))}
        </CardContent>
      </Card>
      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:justify-end">
        <VoteButton disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Vote'}
        </VoteButton>
      </div>
    </form>
  )
}
