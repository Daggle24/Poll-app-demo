import { apiServerError, apiValidationError } from '@/lib/api-utils'
import { resendOtp } from '@/modules/auth/auth.service'
import { resendSchema, authSuccessResponseSchema } from '@/modules/auth/auth.validators'

/**
 * Resend verification code
 * @description Sends a new OTP to the given email (e.g. after login or register).
 * @body resendSchema
 * @response 200:authSuccessResponseSchema
 */
export async function POST (req: Request) {
  try {
    const body = await req.json()
    const parsed = resendSchema.safeParse(body)
    if (!parsed.success) {
      return apiValidationError(parsed.error.issues[0]?.message ?? 'Validation failed')
    }
    const result = await resendOtp(parsed.data)
    if ('error' in result) {
      return apiValidationError(result.error ?? 'Validation failed')
    }
    return Response.json({ success: true })
  } catch (err) {
    console.error(err)
    return apiServerError()
  }
}
