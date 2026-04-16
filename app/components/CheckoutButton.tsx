'use client'

import { useState } from 'react'

export default function CheckoutButton({ product, className, children }: {
  product: 'autochat' | 'mailpilot'
  className?: string
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
    else setLoading(false)
  }

  return (
    <button onClick={handleClick} disabled={loading} className={className}>
      {loading ? 'Wird geladen...' : children}
    </button>
  )
}
