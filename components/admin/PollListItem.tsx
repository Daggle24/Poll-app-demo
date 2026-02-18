'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link01Icon } from '@hugeicons/core-free-icons'

interface PollListItemProps {
  id: string
  question: string
  voteCount: number
  createdAt: Date
  isActive: boolean
}

export function PollListItem ({ id, question, voteCount, createdAt, isActive }: PollListItemProps) {
  const [copied, setCopied] = useState(false)

  async function copyLink () {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/poll/${id}` : ''
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-3 py-4">
        <Link
          href={`/admin/dashboard/${id}`}
          className="min-w-0 flex-1 hover:underline"
        >
          <span className="line-clamp-1 font-medium">{question}</span>
        </Link>
        <span className="text-muted-foreground text-sm tabular-nums">
          {voteCount} vote{voteCount !== 1 ? 's' : ''}
        </span>
        <span className="text-muted-foreground text-sm">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </span>
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Closed'}
        </Badge>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={copyLink}
          aria-label="Copy share link"
          title="Copy share link"
        >
          <HugeiconsIcon icon={Link01Icon} strokeWidth={2} className="size-4" />
        </Button>
        {copied && (
          <span className="text-muted-foreground text-xs">Copied!</span>
        )}
      </CardContent>
    </Card>
  )
}
