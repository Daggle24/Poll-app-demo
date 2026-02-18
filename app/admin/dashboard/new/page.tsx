import Link from 'next/link'
import { CreatePollForm } from '@/components/admin/CreatePollForm'
import { Button } from '@/components/ui/button'

export default function NewPollPage () {
  return (
    <div className="mx-auto max-w-2xl lg:max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/dashboard">← Back</Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Create a poll</h1>
      </div>
      <CreatePollForm />
    </div>
  )
}
