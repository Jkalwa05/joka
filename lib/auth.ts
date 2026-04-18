import { prisma } from './prisma'
import type { NextRequest } from 'next/server'

export async function validateInboxToken(token: string | null | undefined) {
  if (!token) return null
  const customer = await prisma.customer.findUnique({
    where: { inboxToken: token },
    include: { autoChatConfig: true },
  })
  if (!customer || !customer.inboxTokenExpiry || customer.inboxTokenExpiry < new Date()) {
    return null
  }
  return customer
}

export function getIp(req: NextRequest | Request): string {
  const h = req.headers
  const fwd = h.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return h.get('x-real-ip') || 'unknown'
}
