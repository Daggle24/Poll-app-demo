import { apiForbidden, apiServerError, apiValidationError } from '@/lib/api-utils'
import { castVote } from '@/modules/poll/poll.service'
import { voteSchema, voteSuccessResponseSchema, pollIdParamsSchema } from '@/modules/poll/poll.validators'

/**
 * Cast a vote on a poll
 * @description Submit a vote for one option. Public; optional cookie/header for idempotency.
 * @pathParams pollIdParamsSchema
 * @body voteSchema
 * @response 201:voteSuccessResponseSchema
 */
export async function POST (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pollId } = await params
    const body = await req.json()
    const parsed = voteSchema.safeParse(body)
    if (!parsed.success) {
      return apiValidationError(parsed.error.issues[0]?.message ?? 'Validation failed')
    }
    const voterToken = req.headers.get('x-voter-token') ?? undefined
    const result = await castVote(pollId, parsed.data, voterToken)
    if ('error' in result) {
      const msg = result.error ?? 'Validation failed'
      if (msg === 'This poll is closed') return apiForbidden(msg)
      return apiValidationError(msg)
    }
    return Response.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error(err)
    return apiServerError()
  }
}
