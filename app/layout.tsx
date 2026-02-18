import type { Metadata } from 'next'
import { Geist, Geist_Mono, Figtree } from 'next/font/google'
import { Providers } from '@/components/providers'
import './globals.css'

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' })
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PollApp — Create and share polls',
  description: 'Create polls, share links, and view live results'
}

export default function RootLayout ({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={figtree.variable} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
