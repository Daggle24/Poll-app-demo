import { Suspense } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { VerifyContent } from '@/components/admin/VerifyContent'

function VerifyFallback () {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex justify-end border-b border-border p-4">
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-sm sm:text-base">Loading…</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function AdminVerifyPage () {
  return (
    <Suspense fallback={<VerifyFallback />}>
      <VerifyContent />
    </Suspense>
  )
}
