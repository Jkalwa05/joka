import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { constantTimeEqual } from '@/lib/security'

async function getCustomers() {
  return prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
    include: { autoChatConfig: true, mailPilotConfig: true },
  })
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { key?: string }
}) {
  const adminKey = process.env.ADMIN_KEY ?? ''
  const queryKey = searchParams.key ?? ''

  if (!adminKey || !queryKey || !constantTimeEqual(queryKey, adminKey)) {
    redirect('/')
  }

  let customers
  let dbError = false
  try {
    customers = await getCustomers()
  } catch {
    customers = []
    dbError = true
  }

  const statusColor: Record<string, string> = {
    ACTIVE: '#0d9488',
    INACTIVE: '#64748b',
    PAST_DUE: '#d97706',
    CANCELED: '#dc2626',
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '3rem auto', padding: '0 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span className="sub-label">Intern</span>
        <h1>Admin Dashboard</h1>
        <p style={{ color: dbError ? '#ef4444' : 'var(--text-muted)' }}>
          {dbError ? '⚠ Datenbankfehler – Supabase vermutlich pausiert. Seite neu laden.' : `${customers.length} Kunden gesamt`}
        </p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
              <th style={th}>Name / E-Mail</th>
              <th style={th}>Produkt</th>
              <th style={th}>Geschäftskontakt</th>
              <th style={th}>WhatsApp</th>
              <th style={th}>Gmail / Outlook</th>
              <th style={th}>Status</th>
              <th style={th}>Seit</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => {
              const businessContact = c.autoChatConfig?.phoneNumber || c.mailPilotConfig?.gmailAddress || c.mailPilotConfig?.outlookAddress || '–'
              const whatsappReady = c.autoChatConfig ? (c.autoChatConfig.phoneNumberId && c.autoChatConfig.accessToken ? '✓ Aktiv' : '✗ Ausstehend') : '–'
              const gmailReady = c.mailPilotConfig ? (c.mailPilotConfig.gmailAddress ? `✓ ${c.mailPilotConfig.gmailAddress}` : c.mailPilotConfig.outlookAddress ? `✓ ${c.mailPilotConfig.outlookAddress}` : '✗ Ausstehend') : '–'
              const products = [
                c.autoChatConfig ? 'AutoChat' : null,
                c.mailPilotConfig ? 'MailPilot' : null,
              ]
                .filter(Boolean)
                .join(', ') || '–'

              return (
                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={td}>
                    <strong style={{ display: 'block' }}>{c.name}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{c.email}</span>
                  </td>
                  <td style={td}>{products}</td>
                  <td style={td}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{businessContact}</span>
                  </td>
                  <td style={td}>
                    <span style={{ color: whatsappReady.startsWith('✓') ? '#0d9488' : whatsappReady === '–' ? '#94a3b8' : '#d97706', fontWeight: 600, fontSize: '0.82rem' }}>
                      {whatsappReady}
                    </span>
                  </td>
                  <td style={td}>
                    <span style={{ color: gmailReady.startsWith('✓') ? '#0d9488' : gmailReady === '–' ? '#94a3b8' : '#d97706', fontWeight: 600, fontSize: '0.82rem' }}>
                      {gmailReady}
                    </span>
                  </td>
                  <td style={td}>
                    <span style={{ color: statusColor[c.subscriptionStatus] ?? '#64748b', fontWeight: 600, fontSize: '0.8rem' }}>
                      {c.subscriptionStatus}
                    </span>
                  </td>
                  <td style={td}>
                    {new Date(c.createdAt).toLocaleDateString('de-DE')}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {customers.length === 0 && (
          <p style={{ color: 'var(--text-muted)', marginTop: '2rem', textAlign: 'center' }}>
            Noch keine Kunden.
          </p>
        )}
      </div>
    </div>
  )
}

const th: React.CSSProperties = { padding: '0.75rem 1rem', fontWeight: 700 }
const td: React.CSSProperties = { padding: '0.75rem 1rem', color: 'var(--text-main)' }
