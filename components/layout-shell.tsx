import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

export function LayoutShell ({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/" className="font-semibold">
            PollApp
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/login">Admin</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto flex-1 flex flex-col px-4 py-8 max-w-5xl lg:max-w-6xl">{children}</main>
    </div>
  )
}
