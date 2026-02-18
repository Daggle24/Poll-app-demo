'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ResultOptionRowProps {
  index: number
  text: string
  votes: number
  percentage: number
}

export function ResultOptionRow ({ index, text, votes, percentage }: ResultOptionRowProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card">
      <div
        className="absolute inset-y-0 left-0 bg-primary/20 dark:bg-primary/30 transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
      <div className="relative flex items-center gap-3 px-4 py-3">
        <Badge variant="default" className="shrink-0 rounded-lg px-2 py-0.5 text-xs font-semibold">
          {index}.
        </Badge>
        <span className="min-w-0 flex-1 truncate font-medium">{text}</span>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-muted-foreground text-sm">{votes} votes</span>
          <span className="font-bold tabular-nums">{percentage}%</span>
        </div>
      </div>
    </div>
  )
}
