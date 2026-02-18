import { getSession } from '@/lib/auth'
import { apiServerError, apiUnauthorized, apiValidationError } from '@/lib/api-utils'
import { createPoll } from '@/modules/poll/poll.service'
import { createPollSchema, createPollResponseSchema } from '@/modules/poll/poll.validators'

/**
 * Create a new poll
 * @description Creates a poll with question and 2-5 options. Requires authentication.
 * @body createPollSchema
 * @response 201:createPollResponseSchema
 */
export async function POST (req: Request) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return apiUnauthorized()
    }
    const body = await req.json()
    const parsed = createPollSchema.safeParse(body)
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? 'Validation failed'
      return apiValidationError(msg)
    }
    const poll = await createPoll(parsed.data, session.user.id)
    return Response.json(poll, { status: 201 })
  } catch (err) {
    if (err instanceof Error && err.message.includes('Poll must have')) {
      return apiValidationError(err.message)
    }
    console.error(err)
    return apiServerError()
  }
}
