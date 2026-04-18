import crypto from 'crypto'

const ITERATIONS = 100000
const KEYLEN = 64
const DIGEST = 'sha512'

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  const attempt = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST).toString('hex')
  return crypto.timingSafeEqual(Buffer.from(attempt), Buffer.from(hash))
}
