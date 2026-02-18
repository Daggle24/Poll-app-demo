import { getSession } from '@/lib/auth'
import { apiForbidden, apiNotFound, apiServerError, apiUnauthorized } from '@/lib/api-utils'
import { closePoll } from '@/modules/poll/poll.service'
import { pollIdParamsSchema } from '@/modules/poll/poll.validators'

/**
 * Close a poll
 * @description Marks the poll as closed (no more votes). Requires authentication and poll ownership.
 * @pathParams pollIdParamsSchema
 * @response voteSuccessResponseSchema
 */
export async function PATCH (
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session?.user?.id) return apiUnauthorized()
    const { id: pollId } = await params
    const result = await closePoll(pollId, session.user.id)
    if ('error' in result) {
      if (result.error === 'Poll not found') return apiNotFound(result.error)
      if (result.error === 'Forbidden') return apiForbidden(result.error)
    }
    return Response.json({ success: true })
  } catch (err) {
    console.error(err)
    return apiServerError()
  }
}
