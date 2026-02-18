import { apiServerError, apiValidationError } from '@/lib/api-utils'
import { login } from '@/modules/auth/auth.service'
import { loginSchema, authSuccessResponseSchema } from '@/modules/auth/auth.validators'

/**
 * Request admin login (send OTP)
 * @description Sends a verification code to the given email. Use verify endpoint with the code to sign in.
 * @body loginSchema
 * @response 200:authSuccessResponseSchema
 */
export async function POST (req: Request) {
  try {
    const body = await req.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return apiValidationError(parsed.error.issues[0]?.message ?? 'Validation failed')
    }
    const result = await login(parsed.data)
    if ('error' in result) {
      return apiValidationError(result.error ?? 'Validation failed')
    }
    return Response.json({ success: true })
  } catch (err) {
    console.error(err)
    return apiServerError()
  }
}
