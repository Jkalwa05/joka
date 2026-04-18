import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function getWhatsAppReply(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    system: systemPrompt,
    messages,
  })
  const block = response.content[0]
  return block.type === 'text' ? block.text : ''
}

export async function parseAppointmentIntent(
  userMessage: string,
  businessInfo: { businessName?: string | null; services?: string | null; openingHours?: string | null },
  recent: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<{ title: string; date: string; time?: string; confidence: 'high' | 'low' } | null> {
  const today = new Date().toISOString().slice(0, 10)
  const context = recent.map((m) => `${m.role === 'user' ? 'Kunde' : 'Bot'}: ${m.content}`).join('\n')

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 250,
    messages: [
      {
        role: 'user',
        content: `Du bist ein Parser. Extrahiere aus der WhatsApp-Konversation den gewünschten Termin. Antworte NUR mit JSON, ohne Markdown.

Heute: ${today}
Business: ${businessInfo.businessName ?? 'Unbekannt'}
Leistungen: ${businessInfo.services ?? 'nicht angegeben'}
Öffnungszeiten: ${businessInfo.openingHours ?? 'nicht angegeben'}

Bisheriger Chatverlauf:
${context}

Neue Nachricht:
"${userMessage}"

Extrahiere den gewünschten Termin. Wenn Datum oder Uhrzeit nicht eindeutig genannt sind, setze confidence auf "low".

Antwort im Format:
{
  "title": "Kurzer Titel, z.B. 'Haarschnitt – Kunde' oder 'Reservierung 2 Personen'",
  "date": "YYYY-MM-DD",
  "time": "HH:MM" oder null,
  "confidence": "high" | "low"
}

Oder wenn kein konkreter Termin erkennbar: {"confidence": "low"}`,
      },
    ],
  })
  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
  try {
    const parsed = JSON.parse(text)
    if (!parsed.date || !parsed.title || parsed.confidence !== 'high') return null
    return {
      title: String(parsed.title),
      date: String(parsed.date),
      time: parsed.time ? String(parsed.time) : undefined,
      confidence: parsed.confidence,
    }
  } catch {
    return null
  }
}

export async function classifyEmail(subject: string, snippet: string): Promise<{
  label: string
  calendarEvent: { title: string; date: string; time?: string } | null
}> {
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    messages: [
      {
        role: 'user',
        content: `Klassifiziere diese E-Mail und antworte NUR mit JSON (kein Markdown):

Betreff: ${subject}
Vorschau: ${snippet}

JSON-Format:
{
  "label": "Finanzen" | "Termine" | "Anfragen" | "Werbung" | "Sonstiges",
  "calendarEvent": null | { "title": "string", "date": "YYYY-MM-DD", "time": "HH:MM" }
}`,
      },
    ],
  })
  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
  try {
    return JSON.parse(text)
  } catch {
    return { label: 'Sonstiges', calendarEvent: null }
  }
}
