import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

/**
 * Minimal layout for public poll pages: no header, theme toggle (light bulb), "Powered by PollApp" footer.
 * Use on /poll/[id] and /poll/[id]/not-found for a clean shared experience.
 */
export function PublicPollShell ({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-4 right-4">
        <ThemeToggle iconVariant="bulb" />
      </div>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-xl mx-auto">
          {children}
        </div>
      </main>
      <footer className="py-6 text-center">
        <Link
          href="/"
          className="text-muted-foreground text-sm hover:text-foreground transition-colors"
        >
          Powered by PollApp
        </Link>
      </footer>
    </div>
  )
}
