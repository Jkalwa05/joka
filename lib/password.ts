import crypto from 'crypto'

const ITERATIONS = 100000
const KEYLEN = 64
const DIGEST = 'sha512'

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string | null | undefined): boolean {
  const safe = stored && stored.includes(':') ? stored : `${'0'.repeat(32)}:${'0'.repeat(KEYLEN * 2)}`
  const [salt, hash] = safe.split(':')
  const attempt = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST).toString('hex')
  const a = Buffer.from(attempt)
  const b = Buffer.from(hash)
  if (a.length !== b.length) return false
  const match = crypto.timingSafeEqual(a, b)
  return match && !!stored && stored.includes(':')
}
