// One-time tokens for OTP verify -> signIn. In production consider Redis or DB.
const tokenToAdmin = new Map<string, { adminId: string; email: string; name: string }>()

const TTL_MS = 60 * 1000 // 1 minute

export function setToken (token: string, admin: { adminId: string; email: string; name: string }) {
  tokenToAdmin.set(token, admin)
  setTimeout(() => tokenToAdmin.delete(token), TTL_MS)
}

export function consumeToken (token: string) {
  const admin = tokenToAdmin.get(token)
  if (admin) tokenToAdmin.delete(token)
  return admin ?? null
}
