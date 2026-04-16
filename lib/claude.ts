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
