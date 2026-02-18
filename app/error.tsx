'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LayoutShell } from '@/components/layout-shell'

export default function GlobalError ({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <LayoutShell>
      <div className="mx-auto max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Something went wrong</CardTitle>
            <CardDescription>
              An unexpected error occurred. You can try again or return home.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={reset}>Try again</Button>
            <Button variant="outline" asChild>
              <Link href="/">Go home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </LayoutShell>
  )
}
