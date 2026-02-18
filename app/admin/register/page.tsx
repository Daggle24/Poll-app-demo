'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export default function AdminRegisterPage () {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit (e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong')
        setIsSubmitting(false)
        return
      }
      router.push(`/admin/verify?email=${encodeURIComponent(email)}`)
    } catch {
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex justify-end border-b border-border p-4">
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl">
          <CardHeader className="space-y-1.5 pb-4 sm:pb-6 sm:pt-6 md:pt-8">
            <CardTitle className="text-xl sm:text-2xl">Create admin account</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              We&apos;ll send a verification code to your email
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6 sm:pb-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm sm:text-base">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  disabled={isSubmitting}
                  className="h-10 sm:h-11 text-base sm:text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isSubmitting}
                  className="h-10 sm:h-11 text-base sm:text-lg"
                />
              </div>
              {error && (
                <p className="text-destructive text-sm" role="alert">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base" disabled={isSubmitting}>
                {isSubmitting ? 'Sending…' : 'Send code'}
              </Button>
            </form>
            <p className="text-muted-foreground mt-4 text-center text-sm sm:text-base">
              Already have an account?{' '}
              <Link href="/admin/login" className="text-primary underline-offset-4 hover:underline">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
