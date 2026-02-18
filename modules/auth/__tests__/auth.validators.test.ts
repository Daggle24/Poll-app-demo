import { describe, it, expect } from 'vitest'
import {
  registerSchema,
  loginSchema,
  verifySchema,
  resendSchema
} from '@/modules/auth/auth.validators'

describe('registerSchema', () => {
  it('accepts valid email and name', () => {
    const result = registerSchema.safeParse({
      email: 'admin@example.com',
      name: 'Test Admin'
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('admin@example.com')
      expect(result.data.name).toBe('Test Admin')
    }
  })

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({
      email: 'not-an-email',
      name: 'Test'
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing name', () => {
    const result = registerSchema.safeParse({
      email: 'admin@example.com'
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty name', () => {
    const result = registerSchema.safeParse({
      email: 'admin@example.com',
      name: ''
    })
    expect(result.success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('accepts valid email', () => {
    const result = loginSchema.safeParse({ email: 'admin@example.com' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.email).toBe('admin@example.com')
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'invalid' })
    expect(result.success).toBe(false)
  })

  it('rejects missing email', () => {
    const result = loginSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe('verifySchema', () => {
  it('accepts valid email and 6-character code', () => {
    const result = verifySchema.safeParse({
      email: 'admin@example.com',
      code: '123456'
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('admin@example.com')
      expect(result.data.code).toBe('123456')
    }
  })

  it('rejects code with length other than 6', () => {
    expect(verifySchema.safeParse({ email: 'a@b.co', code: '12345' }).success).toBe(false)
    expect(verifySchema.safeParse({ email: 'a@b.co', code: '1234567' }).success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = verifySchema.safeParse({
      email: 'invalid',
      code: '123456'
    })
    expect(result.success).toBe(false)
  })
})

describe('resendSchema', () => {
  it('accepts valid email', () => {
    const result = resendSchema.safeParse({ email: 'admin@example.com' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.email).toBe('admin@example.com')
  })

  it('rejects invalid email', () => {
    const result = resendSchema.safeParse({ email: 'not-email' })
    expect(result.success).toBe(false)
  })
})
