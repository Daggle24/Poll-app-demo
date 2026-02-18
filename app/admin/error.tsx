'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'

export default function AdminError ({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex justify-end border-b border-border p-4">
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Something went wrong</CardTitle>
            <CardDescription>
              An error occurred in the admin section. You can try again or go back.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={reset}>Try again</Button>
            <Button variant="outline" asChild>
              <Link href="/admin/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
