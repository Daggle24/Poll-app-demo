import { getSession } from '@/lib/auth'
import { apiServerError, apiUnauthorized, apiValidationError } from '@/lib/api-utils'
import { createPoll } from '@/modules/poll/poll.service'
import { createPollSchema } from '@/modules/poll/poll.validators'

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
