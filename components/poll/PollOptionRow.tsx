'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { HugeiconsIcon } from '@hugeicons/react'
import { Tick02Icon } from '@hugeicons/core-free-icons'

interface PollOptionRowProps {
  index: number
  text: string
  selected: boolean
  onSelect: () => void
}

export function PollOptionRow ({ index, text, selected, onSelect }: PollOptionRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'relative flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all',
        'min-h-12 touch-manipulation sm:min-h-11',
        selected
          ? 'border-primary bg-primary/10 dark:bg-primary/20'
          : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50'
      )}
    >
      <Badge variant="default" className="shrink-0 rounded-lg px-2 py-0.5 text-xs font-semibold">
        {index}.
      </Badge>
      <span className="min-w-0 flex-1 truncate font-medium">{text}</span>
      {selected && (
        <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-5 shrink-0 text-primary" />
      )}
    </button>
  )
}
