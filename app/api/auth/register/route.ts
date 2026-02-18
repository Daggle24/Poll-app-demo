import { apiServerError, apiValidationError } from '@/lib/api-utils'
import { register } from '@/modules/auth/auth.service'
import { registerSchema, authSuccessResponseSchema } from '@/modules/auth/auth.validators'

/**
 * Register a new admin
 * @description Sends a verification code to the given email. Use verify endpoint to complete sign-in.
 * @body registerSchema
 * @response 200:authSuccessResponseSchema
 */
export async function POST (req: Request) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return apiValidationError(parsed.error.issues[0]?.message ?? 'Validation failed')
    }
    const result = await register(parsed.data)
    if ('error' in result) {
      return apiValidationError(result.error ?? 'Validation failed')
    }
    return Response.json({ success: true })
  } catch (err) {
    console.error(err)
    return apiServerError()
  }
}
