import { apiNotFound } from '@/lib/api-utils'
import { getPoll } from '@/modules/poll/poll.service'

export async function GET (
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const poll = await getPoll(id)
  if (!poll) return apiNotFound('Poll not found')
  return Response.json(poll)
}
