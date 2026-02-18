'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { Delete02Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils'

const MIN_OPTIONS = 2
const MAX_OPTIONS = 5

export function CreatePollForm () {
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function addOption () {
    if (options.length >= MAX_OPTIONS) return
    setOptions([...options, ''])
  }

  function removeOption (i: number) {
    if (options.length <= MIN_OPTIONS) return
    setOptions(options.filter((_, j) => j !== i))
  }

  function updateOption (i: number, value: string) {
    const next = [...options]
    next[i] = value
    setOptions(next)
  }

  async function handleSubmit (e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const trimmed = options.map((o) => o.trim()).filter(Boolean)
    if (trimmed.length < MIN_OPTIONS) {
      setError(`Poll must have at least ${MIN_OPTIONS} options`)
      return
    }
    if (trimmed.length > MAX_OPTIONS) {
      setError(`Poll must have at most ${MAX_OPTIONS} options`)
      return
    }
    if (!question.trim()) {
      setError('Question is required')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim(), options: trimmed })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to create poll')
        setIsSubmitting(false)
        return
      }
      router.push(`/admin/dashboard/${data.id}`)
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="space-y-6">
        <CardHeader>
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              placeholder="What do you want to ask?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              maxLength={200}
              rows={2}
              disabled={isSubmitting}
              className="resize-none"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Options</Label>
            {options.map((value, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-muted-foreground flex h-9 w-6 shrink-0 items-center text-sm">
                  {i + 1}.
                </span>
                <Input
                  placeholder={`Option ${i + 1}`}
                  value={value}
                  onChange={(e) => updateOption(i, e.target.value)}
                  maxLength={100}
                  disabled={isSubmitting}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(i)}
                  disabled={options.length <= MIN_OPTIONS}
                  aria-label="Remove option"
                  className={cn(options.length <= MIN_OPTIONS && 'invisible')}
                >
                  <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
              disabled={options.length >= MAX_OPTIONS}
              className="gap-1"
            >
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-4" />
              Add option
            </Button>
          </div>
          {error && (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating…' : 'Create poll'}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
