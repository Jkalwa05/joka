import crypto from 'crypto'

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function escapeHtml(v: string | null | undefined): string {
  if (v == null) return ''
  return String(v).replace(/[&<>"']/g, (c) => HTML_ESCAPES[c])
}

type Bucket = { count: number; reset: number }
const buckets = new Map<string, Bucket>()

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const b = buckets.get(key)
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs })
    return true
  }
  if (b.count >= max) return false
  b.count++
  return true
}

if (typeof setInterval !== 'undefined') {
  const timer = setInterval(() => {
    const now = Date.now()
    buckets.forEach((v, k) => { if (v.reset < now) buckets.delete(k) })
  }, 60_000)
  ;(timer as unknown as { unref?: () => void }).unref?.()
}

export function verifyHmacSignature(
  rawBody: string,
  header: string | null,
  secret: string,
  algo: 'sha256' | 'sha1' = 'sha256'
): boolean {
  if (!header) return false
  const expected = `${algo}=` + crypto.createHmac(algo, secret).update(rawBody).digest('hex')
  try {
    const a = Buffer.from(expected)
    const b = Buffer.from(header)
    if (a.length !== b.length) return false
    return crypto.timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export function constantTimeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ba.length !== bb.length) return false
  return crypto.timingSafeEqual(ba, bb)
}
