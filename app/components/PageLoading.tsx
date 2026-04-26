export default function PageLoading() {
  return (
    <>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.25rem',
          fontFamily: 'var(--font-ui, system-ui, sans-serif)',
          color: 'var(--text-muted, #64748b)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-heading, system-ui)',
            fontWeight: 800,
            fontSize: '1.6rem',
            color: 'var(--text-main, #0f172a)',
          }}
        >
          Joka <span style={{ color: 'var(--primary, #006266)' }}>Chat</span>
        </div>
        <div
          aria-label="Lädt"
          style={{
            width: '32px',
            height: '32px',
            border: '3px solid rgba(0, 98, 102, 0.15)',
            borderTopColor: 'var(--primary, #006266)',
            borderRadius: '50%',
            animation: 'jokaai-spin 0.9s linear infinite',
          }}
        />
        <style>{`@keyframes jokaai-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  )
}
