'use client'

import { useTheme } from 'next-themes'
import { HugeiconsIcon } from '@hugeicons/react'
import { SunIcon, MoonIcon, BulbIcon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'

interface ThemeToggleProps {
  /** Use light bulb icon (e.g. on public poll page). Default: sun/moon */
  iconVariant?: 'sun-moon' | 'bulb'
}

export function ThemeToggle ({ iconVariant = 'sun-moon' }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {iconVariant === 'bulb' ? (
        <HugeiconsIcon icon={BulbIcon} strokeWidth={2} className="size-4" />
      ) : (
        <HugeiconsIcon
          icon={isDark ? SunIcon : MoonIcon}
          strokeWidth={2}
          className="size-4"
        />
      )}
    </Button>
  )
}
