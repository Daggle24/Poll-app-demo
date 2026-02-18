import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters')
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address')
})

export const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, 'Code must be 6 digits')
})

export const resendSchema = z.object({
  email: z.string().email()
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type VerifyInput = z.infer<typeof verifySchema>
export type ResendInput = z.infer<typeof resendSchema>
