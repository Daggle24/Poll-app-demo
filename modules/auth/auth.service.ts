import * as crypto from 'node:crypto'
import { sendOtpEmail } from '@/lib/email'
import * as repository from './auth.repository'

const OTP_EXPIRY_MS = 10 * 60 * 1000 // 10 minutes

function generateOtp () {
  if (process.env.E2E_TEST_OTP?.length === 6) return process.env.E2E_TEST_OTP
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function hashOtp (otp: string) {
  return crypto.createHash('sha256').update(otp).digest('hex')
}

function isOtpExpired (expiresAt: Date | null) {
  return !expiresAt || new Date() > expiresAt
}

export async function register (data: { email: string; name: string }) {
  const existing = await repository.findAdminByEmail(data.email)
  if (existing?.emailVerified) {
    return { error: 'Email already registered' as const }
  }
  const otp = generateOtp()
  const hashedOtp = hashOtp(otp)
  const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MS)
  if (existing) {
    await repository.updateOtp(existing.id, hashedOtp, otpExpiresAt)
  } else {
    await repository.createAdmin({
      email: data.email,
      name: data.name,
      hashedOtp,
      otpExpiresAt
    })
  }
  await sendOtpEmail(data.email, otp)
  return { success: true as const }
}

export async function login (data: { email: string }) {
  const admin = await repository.findAdminByEmail(data.email)
  if (!admin || !admin.emailVerified) {
    return { error: 'Account not found' as const }
  }
  const otp = generateOtp()
  const hashedOtp = hashOtp(otp)
  const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MS)
  await repository.updateOtp(admin.id, hashedOtp, otpExpiresAt)
  await sendOtpEmail(data.email, otp)
  return { success: true as const }
}

export async function verifyOtp (data: { email: string; code: string }) {
  const admin = await repository.findAdminByEmail(data.email)
  if (!admin) return { error: 'Invalid code' as const }
  if (isOtpExpired(admin.otpExpiresAt)) {
    return { error: 'OTP expired, please request a new one' as const }
  }
  const hash = hashOtp(data.code)
  if (hash !== admin.hashedOtp) {
    return { error: 'Invalid code' as const }
  }
  await repository.setAdminVerified(admin.id)
  return { success: true as const, adminId: admin.id, email: admin.email, name: admin.name }
}

export async function resendOtp (data: { email: string }) {
  const admin = await repository.findAdminByEmail(data.email)
  if (!admin) return { error: 'Account not found' as const }
  const otp = generateOtp()
  const hashedOtp = hashOtp(otp)
  const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MS)
  await repository.updateOtp(admin.id, hashedOtp, otpExpiresAt)
  await sendOtpEmail(data.email, otp)
  return { success: true as const }
}
