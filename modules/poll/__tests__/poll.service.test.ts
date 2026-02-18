import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as repository from '@/modules/poll/poll.repository'
import { createPoll, getPoll, getResults, castVote, closePoll } from '@/modules/poll/poll.service'
import { prisma } from '@/lib/prisma'

vi.mock('@/modules/poll/poll.repository')
vi.mock('@/lib/prisma', () => ({
  prisma: {
    vote: { create: vi.fn() }
  }
}))

const mockRepo = vi.mocked(repository)
const mockVoteCreate = vi.mocked(prisma.vote.create)

beforeEach(() => {
  vi.clearAllMocks()
  mockVoteCreate.mockResolvedValue({} as never)
})

describe('createPoll', () => {
  it('returns created poll from repository with valid input', async () => {
    const created = {
      id: 'poll_1',
      question: 'Favourite colour?',
      isActive: true,
      createdAt: new Date().toISOString(),
      adminId: 'admin_1',
      options: [
        { id: 'opt_1', text: 'Red', pollId: 'poll_1' },
        { id: 'opt_2', text: 'Blue', pollId: 'poll_1' }
      ]
    }
    mockRepo.createPoll.mockResolvedValue(created as never)

    const result = await createPoll(
      { question: 'Favourite colour?', options: ['Red', 'Blue'] },
      'admin_1'
    )

    expect(result).toEqual(created)
    expect(mockRepo.createPoll).toHaveBeenCalledWith({
      question: 'Favourite colour?',
      adminId: 'admin_1',
      options: [{ text: 'Red' }, { text: 'Blue' }]
    })
  })

  it('throws when options count is out of range', async () => {
    await expect(createPoll({ question: 'Q?', options: ['Only one'] }, 'admin_1')).rejects.toThrow(
      /2-5 options/
    )
    await expect(
      createPoll({ question: 'Q?', options: ['A', 'B', 'C', 'D', 'E', 'F'] }, 'admin_1')
    ).rejects.toThrow(/2-5 options/)
    expect(mockRepo.createPoll).not.toHaveBeenCalled()
  })
})

describe('getPoll', () => {
  it('returns poll from repository', async () => {
    const poll = { id: 'p1', question: 'Q?', options: [], isActive: true, adminId: 'a1', createdAt: new Date() }
    mockRepo.getPollById.mockResolvedValue(poll as never)

    const result = await getPoll('p1')
    expect(result).toEqual(poll)
    expect(mockRepo.getPollById).toHaveBeenCalledWith('p1')
  })
})

describe('getResults', () => {
  it('returns results with percentages when poll has votes', async () => {
    const poll = {
      id: 'p1',
      question: 'Q?',
      isActive: true,
      adminId: 'a1',
      createdAt: new Date(),
      options: [
        { id: 'opt_1', text: 'A', pollId: 'p1', votes: [{ id: 'v1' }] },
        { id: 'opt_2', text: 'B', pollId: 'p1', votes: [{ id: 'v2' }, { id: 'v3' }] }
      ],
      votes: [{ id: 'v1' }, { id: 'v2' }, { id: 'v3' }]
    }
    mockRepo.getPollWithVotes.mockResolvedValue(poll as never)

    const result = await getResults('p1')
    expect(result).not.toBeNull()
    if (result) {
      expect(result.question).toBe('Q?')
      expect(result.totalVotes).toBe(3)
      expect(result.results).toHaveLength(2)
      expect(result.results[0]).toMatchObject({ optionId: 'opt_1', text: 'A', votes: 1 })
      expect(result.results[1]).toMatchObject({ optionId: 'opt_2', text: 'B', votes: 2 })
    }
  })

  it('returns null when poll not found', async () => {
    mockRepo.getPollWithVotes.mockResolvedValue(null)
    const result = await getResults('nonexistent')
    expect(result).toBeNull()
  })
})

describe('castVote', () => {
  it('records vote and returns success when poll is active', async () => {
    const poll = {
      id: 'p1',
      question: 'Q?',
      isActive: true,
      adminId: 'a1',
      createdAt: new Date(),
      options: [
        { id: 'opt_1', text: 'A', pollId: 'p1', votes: [] },
        { id: 'opt_2', text: 'B', pollId: 'p1', votes: [] }
      ],
      votes: []
    }
    mockRepo.getPollWithVotes.mockResolvedValue(poll as never)

    const result = await castVote('p1', { optionId: 'opt_1' })

    expect(result).toEqual({ success: true })
    expect(mockVoteCreate).toHaveBeenCalledWith({
      data: { pollId: 'p1', optionId: 'opt_1', voterToken: null }
    })
  })

  it('returns error when poll not found', async () => {
    mockRepo.getPollWithVotes.mockResolvedValue(null)

    const result = await castVote('nonexistent', { optionId: 'opt_1' })

    expect(result).toEqual({ error: 'Poll not found' })
    expect(mockVoteCreate).not.toHaveBeenCalled()
  })

  it('returns error when poll is closed', async () => {
    const poll = {
      id: 'p1',
      question: 'Q?',
      isActive: false,
      adminId: 'a1',
      createdAt: new Date(),
      options: [{ id: 'opt_1', text: 'A', pollId: 'p1', votes: [] }],
      votes: []
    }
    mockRepo.getPollWithVotes.mockResolvedValue(poll as never)

    const result = await castVote('p1', { optionId: 'opt_1' })

    expect(result).toEqual({ error: 'This poll is closed' })
    expect(mockVoteCreate).not.toHaveBeenCalled()
  })

  it('returns error when optionId not in poll options', async () => {
    const poll = {
      id: 'p1',
      question: 'Q?',
      isActive: true,
      adminId: 'a1',
      createdAt: new Date(),
      options: [{ id: 'opt_1', text: 'A', pollId: 'p1', votes: [] }],
      votes: []
    }
    mockRepo.getPollWithVotes.mockResolvedValue(poll as never)

    const result = await castVote('p1', { optionId: 'wrong_id' })

    expect(result).toEqual({ error: 'Invalid option for this poll' })
    expect(mockVoteCreate).not.toHaveBeenCalled()
  })
})

describe('closePoll', () => {
  it('calls repository closePoll and returns success when poll exists and admin matches', async () => {
    const poll = {
      id: 'p1',
      question: 'Q?',
      isActive: true,
      adminId: 'admin_1',
      createdAt: new Date(),
      options: []
    }
    mockRepo.getPollById.mockResolvedValue(poll as never)
    mockRepo.closePoll.mockResolvedValue(undefined as never)

    const result = await closePoll('p1', 'admin_1')

    expect(result).toEqual({ success: true })
    expect(mockRepo.closePoll).toHaveBeenCalledWith('p1')
  })

  it('returns error when poll not found', async () => {
    mockRepo.getPollById.mockResolvedValue(null)

    const result = await closePoll('nonexistent', 'admin_1')

    expect(result).toEqual({ error: 'Poll not found' })
    expect(mockRepo.closePoll).not.toHaveBeenCalled()
  })

  it('returns error when adminId does not match', async () => {
    const poll = {
      id: 'p1',
      question: 'Q?',
      isActive: true,
      adminId: 'other_admin',
      createdAt: new Date(),
      options: []
    }
    mockRepo.getPollById.mockResolvedValue(poll as never)

    const result = await closePoll('p1', 'admin_1')

    expect(result).toEqual({ error: 'Forbidden' })
    expect(mockRepo.closePoll).not.toHaveBeenCalled()
  })
})
