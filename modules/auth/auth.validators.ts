import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Invalid email address').describe('Admin email address'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters').describe('Admin display name')
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').describe('Admin email address')
})

export const verifySchema = z.object({
  email: z.string().email().describe('Email the OTP was sent to'),
  code: z.string().length(6, 'Code must be 6 digits').describe('6-digit verification code')
})

export const resendSchema = z.object({
  email: z.string().email().describe('Email to resend the OTP to')
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type VerifyInput = z.infer<typeof verifySchema>
export type ResendInput = z.infer<typeof resendSchema>

/** Auth success response (OpenAPI) */
export const authSuccessResponseSchema = z.object({
  success: z.literal(true)
})

/** Verify OTP success response (OpenAPI) */
export const verifyResponseSchema = z.object({
  success: z.literal(true),
  token: z.string().describe('Session token for sign-in')
})
