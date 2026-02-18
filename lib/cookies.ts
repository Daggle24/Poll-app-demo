const VOTED_PREFIX = 'voted_'

export function votedCookieName (pollId: string) {
  return VOTED_PREFIX + pollId
}

export function setVotedCookie (pollId: string) {
  if (typeof document === 'undefined') return
  const name = votedCookieName(pollId)
  document.cookie = `${name}=true; path=/; max-age=31536000; SameSite=Lax`
}
