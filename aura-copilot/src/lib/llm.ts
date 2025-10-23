// src/lib/llm.ts

/**
 * Minimal helpers around Anthropic Messages API.
 * These are written "fail-soft": if no API key is provided, they return a stub.
 */

type ClaudeRole = 'user' | 'assistant'

export interface ClaudeMsg {
  role: ClaudeRole
  content: string
}

export interface ClaudeRequest {
  model: string
  system?: string
  messages: ClaudeMsg[]
  max_tokens?: number
  temperature?: number
}

/**
 * Call Anthropic Messages API safely. Returns the raw JSON from the API,
 * or a stub shape when ANTHROPIC_API_KEY is not configured.
 */
export async function safeClaudeMessage(req: ClaudeRequest): Promise<any> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    // No API key in this environment – return a stub so the UI still renders.
    return {
      id: 'no-key',
      type: 'message',
      role: 'assistant',
      content: [
        {
          type: 'text',
          text:
            'AI analysis disabled in this deployment. Add ANTHROPIC_API_KEY to enable Claude.',
        },
      ],
    }
  }

  const body: Record<string, any> = {
    model: req.model,
    max_tokens: req.max_tokens ?? 800,
    temperature: req.temperature ?? 0.3,
    messages: req.messages.map(({ role, content }) => ({ role, content })),
  }
  if (req.system) body.system = req.system

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    } as any,
    body: JSON.stringify(body),
  })

  // If Anthropic is down or returns a non-2xx, return a readable stub
  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    return {
      id: 'error',
      type: 'message',
      role: 'assistant',
      content: [
        {
          type: 'text',
          text:
            'AI analysis temporarily unavailable. ' +
            (errText ? `Upstream error: ${errText.slice(0, 500)}` : ''),
        },
      ],
    }
  }

  return res.json()
}

/**
 * Extract the first text chunk from a Claude response.
 */
export function messageToText(resp: any): string {
  try {
    const arr = resp?.content
    if (Array.isArray(arr)) {
      const firstText = arr.find((c: any) => c?.type === 'text')?.text
      if (typeof firstText === 'string') return firstText
    }
  } catch {
    // ignore
  }
  return ''
}

