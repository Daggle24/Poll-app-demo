import { prisma } from '@/lib/prisma'

export async function createPoll (data: { question: string; adminId: string; options: { text: string }[] }) {
  return prisma.poll.create({
    data: {
      question: data.question,
      adminId: data.adminId,
      options: {
        create: data.options.map((o) => ({ text: o.text }))
      }
    },
    include: { options: true }
  })
}

export async function getPollById (id: string) {
  return prisma.poll.findUnique({
    where: { id },
    include: { options: true }
  })
}

export async function getPollWithVotes (id: string) {
  return prisma.poll.findUnique({
    where: { id },
    include: {
      options: {
        include: { votes: true }
      },
      votes: true
    }
  })
}

export async function getAdminPolls (adminId: string) {
  return prisma.poll.findMany({
    where: { adminId },
    orderBy: { createdAt: 'desc' },
    include: {
      options: { include: { _count: { select: { votes: true } } } },
      _count: { select: { votes: true } }
    }
  })
}

export async function closePoll (id: string) {
  return prisma.poll.update({
    where: { id },
    data: { isActive: false }
  })
}
