import { prisma } from '@/lib/prisma'

export async function createAdmin (data: { email: string; name: string; hashedOtp: string; otpExpiresAt: Date }) {
  return prisma.admin.create({
    data: {
      email: data.email,
      name: data.name,
      hashedOtp: data.hashedOtp,
      otpExpiresAt: data.otpExpiresAt
    }
  })
}

export async function findAdminByEmail (email: string) {
  return prisma.admin.findUnique({
    where: { email }
  })
}

export async function updateOtp (adminId: string, hashedOtp: string, otpExpiresAt: Date) {
  return prisma.admin.update({
    where: { id: adminId },
    data: { hashedOtp, otpExpiresAt }
  })
}

export async function setAdminVerified (adminId: string) {
  return prisma.admin.update({
    where: { id: adminId },
    data: { emailVerified: new Date(), hashedOtp: null, otpExpiresAt: null }
  })
}
