import { z } from 'zod'

export const createPollSchema = z.object({
  question: z.string().min(1, 'Question is required').max(200, 'Question must be at most 200 characters').describe('Poll question text'),
  options: z
    .array(z.string().min(1, 'Option cannot be empty').max(100, 'Option must be at most 100 characters').describe('Option text'))
    .min(2, 'Poll must have at least 2 options')
    .max(5, 'Poll must have at most 5 options')
    .describe('Between 2 and 5 option strings')
})

export type CreatePollInput = z.infer<typeof createPollSchema>

export const voteSchema = z.object({
  optionId: z.string().min(1, 'Option is required').describe('ID of the option being voted for')
})

export type VoteInput = z.infer<typeof voteSchema>

/** Path param for poll ID (OpenAPI) */
export const pollIdParamsSchema = z.object({
  id: z.string().describe('Poll ID')
})

/** Created poll response (OpenAPI) */
export const createPollResponseSchema = z.object({
  id: z.string(),
  question: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  options: z.array(z.object({ id: z.string(), text: z.string() }))
})

/** Vote success response (OpenAPI) */
export const voteSuccessResponseSchema = z.object({
  success: z.literal(true)
})

/** Results response (OpenAPI) */
export const pollResultsResponseSchema = z.object({
  options: z.array(z.object({
    id: z.string(),
    text: z.string(),
    voteCount: z.number(),
    percentage: z.number()
  })),
  totalVotes: z.number()
})

/** Admin poll list item (OpenAPI) */
export const adminPollListItemSchema = z.object({
  id: z.string(),
  question: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  _count: z.object({ votes: z.number() })
})

/** Admin polls list response (OpenAPI) */
export const adminPollsResponseSchema = z.array(adminPollListItemSchema)
