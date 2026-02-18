import { apiNotFound } from '@/lib/api-utils'
import { getResults } from '@/modules/poll/poll.service'

export async function GET (
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const results = await getResults(id)
  if (!results) return apiNotFound('Poll not found')
  return Response.json(results)
}
