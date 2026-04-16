import { NextRequest, NextResponse } from 'next/server'
import { getAuthUrl } from '@/lib/google'

export async function GET(req: NextRequest) {
  const customerId = req.nextUrl.searchParams.get('customerId')
  if (!customerId) {
    return NextResponse.json({ error: 'customerId fehlt' }, { status: 400 })
  }
  const url = getAuthUrl(customerId)
  return NextResponse.redirect(url)
}
