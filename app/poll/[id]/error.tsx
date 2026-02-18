'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PublicPollShell } from '@/components/public-poll-shell'

export default function PollPageError ({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Poll page error:', error)
  }, [error])

  return (
    <PublicPollShell>
      <Card>
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>
            We couldn’t load this poll. You can try again or go back to the home page.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/">Go home</Link>
          </Button>
        </CardContent>
      </Card>
    </PublicPollShell>
  )
}
