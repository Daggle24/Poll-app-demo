'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link01Icon } from '@hugeicons/core-free-icons'

interface PollDetailActionsProps {
  pollId: string
  isActive: boolean
  shareUrl?: string
}

export function PollDetailActions ({ pollId, isActive }: PollDetailActionsProps) {
  const router = useRouter()
  const [isClosing, setIsClosing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  async function copyLink () {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/poll/${pollId}` : ''
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  async function closePoll () {
    setIsClosing(true)
    try {
      const res = await fetch(`/api/polls/${pollId}/close`, { method: 'PATCH' })
      if (res.ok) {
        setDialogOpen(false)
        router.refresh()
      }
    } finally {
      setIsClosing(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" size="sm" onClick={copyLink} className="gap-1">
        <HugeiconsIcon icon={Link01Icon} strokeWidth={2} className="size-4" />
        {copied ? 'Copied!' : 'Copy share link'}
      </Button>
      {isActive && (
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={isClosing}>
              {isClosing ? 'Closing…' : 'Close poll'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Close this poll?</AlertDialogTitle>
              <AlertDialogDescription>
                Closed polls will no longer accept new votes. Results will still be visible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault()
                  closePoll()
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Close poll
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
