import * as crypto from 'node:crypto'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as repository from '../auth.repository'
import { register, login, verifyOtp, resendOtp } from '@/modules/auth/auth.service'
import { sendOtpEmail } from '@/lib/email'

vi.mock('../auth.repository', () => ({
  findAdminByEmail: vi.fn(),
  updateOtp: vi.fn(),
  createAdmin: vi.fn(),
  setAdminVerified: vi.fn()
}))
vi.mock('@/lib/email', () => ({ sendOtpEmail: vi.fn() }))

const mockRepo = vi.mocked(repository)
const mockSendOtp = vi.mocked(sendOtpEmail)

beforeEach(() => {
  vi.clearAllMocks()
  mockSendOtp.mockResolvedValue(undefined)
})

function hashOtp (otp: string) {
  return crypto.createHash('sha256').update(otp).digest('hex')
}

describe('register', () => {
  it('creates admin and sends OTP when email is new', async () => {
    mockRepo.findAdminByEmail.mockResolvedValue(null)
    mockRepo.createAdmin.mockResolvedValue({
      id: 'admin_1',
      email: 'new@example.com',
      name: 'New Admin',
      hashedOtp: 'x',
      otpExpiresAt: new Date(),
      emailVerified: null
    } as never)

    const result = await register({ email: 'new@example.com', name: 'New Admin' })

    expect(result).toEqual({ success: true })
    expect(mockRepo.createAdmin).toHaveBeenCalled()
    expect(mockRepo.updateOtp).not.toHaveBeenCalled()
    expect(mockSendOtp).toHaveBeenCalledWith('new@example.com', expect.any(String))
  })

  it('updates OTP for existing unverified admin', async () => {
    mockRepo.findAdminByEmail.mockResolvedValue({
      id: 'admin_1',
      email: 'existing@example.com',
      name: 'Existing',
      hashedOtp: 'old',
      otpExpiresAt: new Date(),
      emailVerified: null
    } as never)
    mockRepo.updateOtp.mockResolvedValue(undefined as never)

    const result = await register({ email: 'existing@example.com', name: 'Existing' })

    expect(result).toEqual({ success: true })
    expect(mockRepo.updateOtp).toHaveBeenCalledWith('admin_1', expect.any(String), expect.any(Date))
    expect(mockSendOtp).toHaveBeenCalled()
  })

  it('returns error when email already registered (verified)', async () => {
    mockRepo.findAdminByEmail.mockResolvedValue({
      id: 'admin_1',
      email: 'done@example.com',
      name: 'Done',
      hashedOtp: null,
      otpExpiresAt: null,
      emailVerified: new Date()
    } as never)

    const result = await register({ email: 'done@example.com', name: 'Done' })

    expect(result).toEqual({ error: 'Email already registered' })
    expect(mockRepo.createAdmin).not.toHaveBeenCalled()
    expect(mockRepo.updateOtp).not.toHaveBeenCalled()
  })
})

describe('login', () => {
  it('sends OTP and returns success when admin exists and is verified', async () => {
    mockRepo.findAdminByEmail.mockResolvedValue({
      id: 'admin_1',
      email: 'admin@example.com',
      name: 'Admin',
      hashedOtp: null,
      otpExpiresAt: null,
      emailVerified: new Date()
    } as never)
    mockRepo.updateOtp.mockResolvedValue(undefined as never)

    const result = await login({ email: 'admin@example.com' })

    expect(result).toEqual({ success: true })
    expect(mockRepo.updateOtp).toHaveBeenCalled()
    expect(mockSendOtp).toHaveBeenCalledWith('admin@example.com', expect.any(String))
  })

  it('returns error when account not found or not verified', async () => {
    mockRepo.findAdminByEmail.mockResolvedValue(null)
    expect(await login({ email: 'nobody@example.com' })).toEqual({ error: 'Account not found' })

    mockRepo.findAdminByEmail.mockResolvedValue({
      id: 'admin_1',
      email: 'u@example.com',
      name: 'U',
      hashedOtp: 'x',
      otpExpiresAt: new Date(),
      emailVerified: null
    } as never)
    expect(await login({ email: 'u@example.com' })).toEqual({ error: 'Account not found' })
  })
})

describe('verifyOtp', () => {
  it('returns success with adminId and email when code matches and not expired', async () => {
    const code = '123456'
    const hashedOtp = hashOtp(code)
    const future = new Date(Date.now() + 60 * 60 * 1000)
    mockRepo.findAdminByEmail.mockResolvedValue({
      id: 'admin_1',
      email: 'v@example.com',
      name: 'V',
      hashedOtp,
      otpExpiresAt: future,
      emailVerified: null
    } as never)
    mockRepo.setAdminVerified.mockResolvedValue(undefined as never)

    const result = await verifyOtp({ email: 'v@example.com', code })

    expect(result).toEqual({
      success: true,
      adminId: 'admin_1',
      email: 'v@example.com',
      name: 'V'
    })
    expect(mockRepo.setAdminVerified).toHaveBeenCalledWith('admin_1')
  })

  it('returns error when admin not found', async () => {
    mockRepo.findAdminByEmail.mockResolvedValue(null)

    const result = await verifyOtp({ email: 'nobody@example.com', code: '123456' })

    expect(result).toEqual({ error: 'Invalid code' })
    expect(mockRepo.setAdminVerified).not.toHaveBeenCalled()
  })

  it('returns error when OTP expired', async () => {
    const code = '123456'
    const hashedOtp = hashOtp(code)
    const past = new Date(Date.now() - 1000)
    mockRepo.findAdminByEmail.mockResolvedValue({
      id: 'admin_1',
      email: 'v@example.com',
      name: 'V',
      hashedOtp,
      otpExpiresAt: past,
      emailVerified: null
    } as never)

    const result = await verifyOtp({ email: 'v@example.com', code })

    expect(result).toEqual({ error: 'OTP expired, please request a new one' })
    expect(mockRepo.setAdminVerified).not.toHaveBeenCalled()
  })

  it('returns error when code does not match', async () => {
    const hashedOtp = hashOtp('123456')
    const future = new Date(Date.now() + 60 * 60 * 1000)
    mockRepo.findAdminByEmail.mockResolvedValue({
      id: 'admin_1',
      email: 'v@example.com',
      name: 'V',
      hashedOtp,
      otpExpiresAt: future,
      emailVerified: null
    } as never)

    const result = await verifyOtp({ email: 'v@example.com', code: '999999' })

    expect(result).toEqual({ error: 'Invalid code' })
    expect(mockRepo.setAdminVerified).not.toHaveBeenCalled()
  })
})

describe('resendOtp', () => {
  it('updates OTP and sends email when admin exists', async () => {
    mockRepo.findAdminByEmail.mockResolvedValue({
      id: 'admin_1',
      email: 'r@example.com',
      name: 'R',
      hashedOtp: null,
      otpExpiresAt: null,
      emailVerified: new Date()
    } as never)
    mockRepo.updateOtp.mockResolvedValue(undefined as never)

    const result = await resendOtp({ email: 'r@example.com' })

    expect(result).toEqual({ success: true })
    expect(mockRepo.updateOtp).toHaveBeenCalledWith('admin_1', expect.any(String), expect.any(Date))
    expect(mockSendOtp).toHaveBeenCalledWith('r@example.com', expect.any(String))
  })

  it('returns error when account not found', async () => {
    mockRepo.findAdminByEmail.mockResolvedValue(null)

    const result = await resendOtp({ email: 'nobody@example.com' })

    expect(result).toEqual({ error: 'Account not found' })
    expect(mockRepo.updateOtp).not.toHaveBeenCalled()
  })
})
