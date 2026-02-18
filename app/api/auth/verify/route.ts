import { apiServerError, apiValidationError } from '@/lib/api-utils'
import { setToken } from '@/lib/auth-token-store'
import { verifyOtp } from '@/modules/auth/auth.service'
import { verifySchema } from '@/modules/auth/auth.validators'
import { randomBytes } from 'node:crypto'

export async function POST (req: Request) {
  try {
    const body = await req.json()
    const parsed = verifySchema.safeParse(body)
    if (!parsed.success) {
      return apiValidationError(parsed.error.issues[0]?.message ?? 'Validation failed')
    }
    const result = await verifyOtp(parsed.data)
    if ('error' in result) {
      return apiValidationError(result.error ?? 'Validation failed')
    }
    const token = randomBytes(32).toString('hex')
    setToken(token, {
      adminId: result.adminId,
      email: result.email,
      name: result.name
    })
    return Response.json({ success: true, token })
  } catch (err) {
    console.error(err)
    return apiServerError()
  }
}
