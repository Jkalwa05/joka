import { redirect } from 'next/navigation'
import OnboardingForm from './OnboardingForm'

type Props = {
  searchParams: { session_id?: string; product?: string }
}

export default async function OnboardingPage({ searchParams }: Props) {
  const { session_id, product } = searchParams

  if (!session_id || !product) {
    redirect('/')
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  const res = await fetch(
    `${baseUrl}/api/onboarding/session?session_id=${session_id}&product=${product}`,
    { cache: 'no-store' }
  )

  if (!res.ok) {
    const { error } = await res.json()
    return (
      <div style={{ maxWidth: '520px', margin: '4rem auto', padding: '0 1.5rem' }}>
        <h2>Einen Moment...</h2>
        <p style={{ color: 'var(--text-muted)' }}>{error}</p>
        <a href={`/onboarding?session_id=${session_id}&product=${product}`} className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
          Neu laden
        </a>
      </div>
    )
  }

  const { customerId, email, inboxToken } = await res.json()

  return <OnboardingForm customerId={customerId} product={product} email={email} inboxToken={inboxToken} />
}
