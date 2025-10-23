// src/lib/llm.ts
import Anthropic from '@anthropic-ai/sdk'

/**
 * Convert Claude message content to plain text for simple rendering.
 * Works even if the model returns mixed content blocks.
 */
export function messageToText(content: unknown): string {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content
      .map((c: any) => {
        if (!c) return ''
        if (typeof c === 'string') return c
        if (typeof c.text === 'string') return c.text
        if (typeof c.type === 'string' && c.type === 'text' && typeof c.value === 'string') return c.value
        if (typeof c.type === 'string' && c.type === 'text' && typeof c.text === 'string') return c.text
        return ''
      })
      .join('\n')
  }
  if (content && typeof content === 'object' && 'text' in (content as any)) {
    return String((content as any).text ?? '')
  }
  return ''
}

/**
 * Wrap Anthropic messages.create with defensiveness so the rest of the
 * app never crashes if the key/model/quota is missing.
 */
export async function safeClaudeMessage(
  model: string,
  system: string,
  userPrompt: string
): Promise<{ ok: boolean; text: string }> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) {
    return { ok: false, text: 'AI disabled: missing ANTHROPIC_API_KEY.' }
  }
  try {
    const client = new Anthropic({ apiKey: key })
    const res = await client.messages.create({
      model,
      system,
      max_tokens: 800,
      messages: [{ role: 'user', content: userPrompt }],
    } as any) // cast because SDK versions vary slightly

    const text = messageToText((res as any)?.content ?? '')
    return { ok: true, text }
  } catch (e: any) {
    return { ok: false, text: `AI error: ${e?.message ?? 'unknown error'}` }
  }
}

