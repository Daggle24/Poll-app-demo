import { prisma } from '@/lib/prisma'
import * as repository from './poll.repository'
import type { CreatePollInput, VoteInput } from './poll.validators'

const QUESTION_MAX = 200
const OPTION_MIN = 2
const OPTION_MAX = 5
const OPTION_TEXT_MAX = 100

export async function createPoll (data: CreatePollInput, adminId: string) {
  if (data.options.length < OPTION_MIN || data.options.length > OPTION_MAX) {
    throw new Error('Poll must have 2-5 options')
  }
  if (data.question.length < 1 || data.question.length > QUESTION_MAX) {
    throw new Error('Question must be 1-200 characters')
  }
  for (const o of data.options) {
    if (o.length < 1 || o.length > OPTION_TEXT_MAX) {
      throw new Error('Each option must be 1-100 characters')
    }
  }
  return repository.createPoll({
    question: data.question,
    adminId,
    options: data.options.map((text) => ({ text }))
  })
}

export async function getPoll (id: string) {
  return repository.getPollById(id)
}

export async function getResults (pollId: string) {
  const poll = await repository.getPollWithVotes(pollId)
  if (!poll) return null
  const totalVotes = poll.votes.length
  const results = poll.options.map((option) => {
    const votes = option.votes.length
    const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
    return {
      optionId: option.id,
      text: option.text,
      votes,
      percentage
    }
  })
  return {
    question: poll.question,
    totalVotes,
    results
  }
}

export async function castVote (pollId: string, data: VoteInput, voterToken?: string) {
  const poll = await repository.getPollWithVotes(pollId)
  if (!poll) return { error: 'Poll not found' as const }
  if (!poll.isActive) return { error: 'This poll is closed' as const }
  const optionIds = poll.options.map((o) => o.id)
  if (!optionIds.includes(data.optionId)) {
    return { error: 'Invalid option for this poll' as const }
  }
  await prisma.vote.create({
    data: {
      pollId,
      optionId: data.optionId,
      voterToken: voterToken ?? null
    }
  })
  return { success: true }
}

export async function closePoll (pollId: string, adminId: string) {
  const poll = await repository.getPollById(pollId)
  if (!poll) return { error: 'Poll not found' as const }
  if (poll.adminId !== adminId) return { error: 'Forbidden' as const }
  await repository.closePoll(pollId)
  return { success: true }
}

export async function getAdminPolls (adminId: string) {
  return repository.getAdminPolls(adminId)
}
