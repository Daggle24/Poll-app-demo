/**
 * Seed script for local development and E2E testing.
 * Creates one test admin, one active poll, and one closed poll.
 *
 * Run: pnpm prisma db seed
 * Then set E2E_POLL_ID and E2E_CLOSED_POLL_ID in .env.
 */
import { prisma } from '../lib/prisma'

async function main () {
  const email = 'e2e@example.com'
  const name = 'E2E Test Admin'

  const existing = await prisma.admin.findUnique({ where: { email } })
  let adminId: string

  if (existing) {
    adminId = existing.id
    console.log('Using existing E2E admin:', email)
  } else {
    const admin = await prisma.admin.create({
      data: {
        email,
        name,
        emailVerified: new Date(),
        hashedOtp: null,
        otpExpiresAt: null
      }
    })
    adminId = admin.id
    console.log('Created E2E admin:', email)
  }

  const existingActive = await prisma.poll.findFirst({
    where: { adminId, isActive: true },
    orderBy: { createdAt: 'desc' }
  })

  let activePollId: string
  if (existingActive) {
    activePollId = existingActive.id
    console.log('Active poll already exists:', activePollId)
  } else {
    const poll = await prisma.poll.create({
      data: {
        question: 'E2E test poll: What is your favourite colour?',
        isActive: true,
        adminId,
        options: {
          create: [{ text: 'Red' }, { text: 'Blue' }, { text: 'Green' }]
        }
      }
    })
    activePollId = poll.id
    console.log('Created active poll:', activePollId)
  }

  const existingClosed = await prisma.poll.findFirst({
    where: { adminId, isActive: false },
    orderBy: { createdAt: 'desc' }
  })

  let closedPollId: string
  if (existingClosed) {
    closedPollId = existingClosed.id
    console.log('Closed poll already exists:', closedPollId)
  } else {
    const poll = await prisma.poll.create({
      data: {
        question: 'E2E closed poll: Best season?',
        isActive: false,
        adminId,
        options: {
          create: [{ text: 'Spring' }, { text: 'Summer' }, { text: 'Autumn' }, { text: 'Winter' }]
        }
      }
    })
    closedPollId = poll.id
    console.log('Created closed poll:', closedPollId)
  }

  console.log('')
  console.log('Add to your .env:')
  console.log(`  E2E_POLL_ID=${activePollId}`)
  console.log(`  E2E_CLOSED_POLL_ID=${closedPollId}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
