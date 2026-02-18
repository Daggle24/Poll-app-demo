import { describe, it, expect } from 'vitest'
import { createPollSchema, voteSchema } from '@/modules/poll/poll.validators'

describe('setup verification', () => {
  it('runs with @/ path alias', () => {
    const result = createPollSchema.safeParse({
      question: 'Test?',
      options: ['A', 'B']
    })
    expect(result.success).toBe(true)
  })
})

describe('createPollSchema', () => {
  it('accepts valid input (question 1–200 chars, 2–5 options 1–100 chars)', () => {
    const result = createPollSchema.safeParse({
      question: 'What is your favourite colour?',
      options: ['Red', 'Blue']
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.question).toBe('What is your favourite colour?')
      expect(result.data.options).toEqual(['Red', 'Blue'])
    }
  })

  it('rejects empty question', () => {
    const result = createPollSchema.safeParse({
      question: '',
      options: ['A', 'B']
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message?.includes('Question') || i.message?.includes('required'))).toBe(true)
    }
  })

  it('rejects question over 200 characters', () => {
    const result = createPollSchema.safeParse({
      question: 'x'.repeat(201),
      options: ['A', 'B']
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message?.includes('200'))).toBe(true)
    }
  })

  it('rejects fewer than 2 options', () => {
    const result = createPollSchema.safeParse({
      question: 'Q?',
      options: ['Only one']
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message?.includes('2') || i.message?.includes('least'))).toBe(true)
    }
  })

  it('rejects more than 5 options', () => {
    const result = createPollSchema.safeParse({
      question: 'Q?',
      options: ['A', 'B', 'C', 'D', 'E', 'F']
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message?.includes('5') || i.message?.includes('most'))).toBe(true)
    }
  })

  it('rejects option longer than 100 characters', () => {
    const result = createPollSchema.safeParse({
      question: 'Q?',
      options: ['A', 'x'.repeat(101)]
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message?.includes('100') || i.message?.includes('Option'))).toBe(true)
    }
  })

  it('rejects empty option string', () => {
    const result = createPollSchema.safeParse({
      question: 'Q?',
      options: ['A', '']
    })
    expect(result.success).toBe(false)
  })
})

describe('voteSchema', () => {
  it('accepts valid optionId', () => {
    const result = voteSchema.safeParse({ optionId: 'opt_abc123' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.optionId).toBe('opt_abc123')
  })

  it('rejects missing optionId', () => {
    const result = voteSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejects empty optionId', () => {
    const result = voteSchema.safeParse({ optionId: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message?.includes('Option') || i.message?.includes('required'))).toBe(true)
    }
  })
})
