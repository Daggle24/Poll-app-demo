import { auth } from '@/auth.config'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/admin/DashboardNav'
import { DashboardHeaderActions } from '@/components/admin/DashboardHeaderActions'

export default async function DashboardLayout ({
  children
}: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 max-w-5xl lg:max-w-6xl">
          <DashboardNav />
          <div className="flex items-center gap-4">
            <DashboardHeaderActions />
            <span className="text-muted-foreground text-sm max-w-[180px] truncate sm:max-w-none">
              {session.user.email}
            </span>
          </div>
        </div>
      </header>
      <main className="container mx-auto flex-1 px-4 py-6 max-w-5xl lg:max-w-6xl">
        {children}
      </main>
    </div>
  )
}
