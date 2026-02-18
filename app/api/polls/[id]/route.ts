import { apiNotFound } from '@/lib/api-utils'
import { getPoll } from '@/modules/poll/poll.service'
import { pollIdParamsSchema } from '@/modules/poll/poll.validators'

/**
 * Get a poll by ID
 * @description Returns a single poll with its options. Public.
 * @pathParams pollIdParamsSchema
 * @response createPollResponseSchema
 */
export async function GET (
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const poll = await getPoll(id)
  if (!poll) return apiNotFound('Poll not found')
  return Response.json(poll)
}
