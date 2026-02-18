import { getSession } from '@/lib/auth'
import { apiServerError, apiUnauthorized } from '@/lib/api-utils'
import { getAdminPolls } from '@/modules/poll/poll.service'

export async function GET () {
  try {
    const session = await getSession()
    if (!session?.user?.id) return apiUnauthorized()
    const polls = await getAdminPolls(session.user.id)
    return Response.json(polls)
  } catch (err) {
    console.error(err)
    return apiServerError()
  }
}
