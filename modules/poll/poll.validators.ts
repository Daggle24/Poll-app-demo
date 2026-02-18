import { z } from 'zod'

export const createPollSchema = z.object({
  question: z.string().min(1, 'Question is required').max(200, 'Question must be at most 200 characters'),
  options: z
    .array(z.string().min(1, 'Option cannot be empty').max(100, 'Option must be at most 100 characters'))
    .min(2, 'Poll must have at least 2 options')
    .max(5, 'Poll must have at most 5 options')
})

export type CreatePollInput = z.infer<typeof createPollSchema>

export const voteSchema = z.object({
  optionId: z.string().min(1, 'Option is required')
})

export type VoteInput = z.infer<typeof voteSchema>
