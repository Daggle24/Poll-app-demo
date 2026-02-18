'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { ThemeToggle } from '@/components/theme-toggle'

export default function AdminVerifyPage () {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const handleVerify = useCallback(async () => {
    if (code.length !== 6 || !email) return
    setError(null)
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Invalid code')
        setIsSubmitting(false)
        return
      }
      const signInResult = await signIn('credentials', {
        token: data.token,
        redirect: false
      })
      if (signInResult?.error) {
        setError('Session error. Please try again.')
        setIsSubmitting(false)
        return
      }
      router.push('/admin/dashboard')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }, [code, email, router])

  async function handleResend () {
    if (!email) return
    setError(null)
    setIsResending(true)
    try {
      const res = await fetch('/api/auth/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Could not resend')
      } else {
        setCode('')
        setError(null)
      }
    } catch {
      setError('Could not resend code.')
    }
    setIsResending(false)
  }

  if (!email) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="flex justify-end border-b border-border p-4">
          <ThemeToggle />
        </header>
        <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
          <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl">
            <CardContent className="pt-6 pb-6 sm:pb-8 sm:pt-8">
              <p className="text-muted-foreground text-center text-sm sm:text-base">
                Missing email. Please start from{' '}
                <Link href="/admin/login" className="text-primary underline">login</Link> or{' '}
                <Link href="/admin/register" className="text-primary underline">register</Link>.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex justify-end border-b border-border p-4">
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl">
          <CardHeader className="space-y-1.5 pb-4 sm:pb-6 sm:pt-6 md:pt-8">
            <CardTitle className="text-xl sm:text-2xl">Enter verification code</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              We sent a 6-digit code to {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5 pb-6 sm:pb-8">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={setCode}
              onComplete={handleVerify}
            >
              <InputOTPGroup className="justify-center">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {error && (
              <p className="text-destructive text-center text-sm" role="alert">
                {error}
              </p>
            )}
            <Button
              type="button"
              variant="secondary"
              className="w-full h-10 sm:h-11 text-sm sm:text-base"
              disabled={isSubmitting || code.length !== 6}
              onClick={handleVerify}
            >
              {isSubmitting ? 'Verifying…' : 'Verify'}
            </Button>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-muted-foreground hover:text-foreground w-full text-center text-sm underline-offset-4 hover:underline disabled:opacity-50"
            >
              {isResending ? 'Sending…' : 'Resend code'}
            </button>
            <p className="text-muted-foreground text-center text-sm sm:text-base">
              <Link href="/admin/login" className="underline-offset-4 hover:underline">
                Use a different email
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
