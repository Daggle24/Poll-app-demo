import Link from 'next/link'
import { LayoutShell } from '@/components/layout-shell'
import { Button } from '@/components/ui/button'

export default function Page () {
  return (
    <LayoutShell>
      <div className="mx-auto max-w-3xl flex-1 flex flex-col justify-center w-full">
        <div className="space-y-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Create and share polls</h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-xl mx-auto">
            Create a poll, share the link, and watch results update in real time.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/admin/register">Get started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/admin/login">Admin login</Link>
            </Button>
          </div>
        </div>
      </div>
    </LayoutShell>
  )
}