'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AutoLoginInner() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const token = params.get('token')
    if (token) {
      localStorage.setItem('inboxToken', token)
      router.replace('/dashboard')
    } else {
      router.replace('/anmelden')
    }
  }, [params, router])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Wird eingeloggt…</p>
    </div>
  )
}

export default function AutoLogin() {
  return (
    <Suspense>
      <AutoLoginInner />
    </Suspense>
  )
}
