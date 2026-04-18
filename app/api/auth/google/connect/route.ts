import { NextRequest, NextResponse } from 'next/server'
import { validateInboxToken } from '@/lib/auth'
import { getAuthUrl } from '@/lib/google'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const customer = await validateInboxToken(token)
  if (!customer) {
    return NextResponse.json({ error: 'Ungültiger Zugang' }, { status: 401 })
  }
  return NextResponse.redirect(getAuthUrl(customer.id))
}
