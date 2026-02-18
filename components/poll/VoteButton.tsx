'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface VoteButtonProps {
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

export function VoteButton ({ disabled, className, children = 'Vote' }: VoteButtonProps) {
  return (
    <Button
      type="submit"
      variant="default"
      size="lg"
      disabled={disabled}
      className={cn('bg-primary text-primary-foreground hover:bg-primary/90 min-h-11 px-6 text-base', className)}
    >
      {children}
    </Button>
  )
}
