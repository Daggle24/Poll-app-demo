'use client'

import { signOut } from 'next-auth/react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

export function DashboardHeaderActions () {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut({ callbackUrl: '/admin/login' })}
      >
        Logout
      </Button>
    </div>
  )
}
