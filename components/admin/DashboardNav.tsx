import Link from 'next/link'

export function DashboardNav () {
  return (
    <nav>
      <Link href="/admin/dashboard" className="font-semibold">
        PollApp
      </Link>
    </nav>
  )
}
