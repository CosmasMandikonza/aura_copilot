// src/lib/ai.ts
import { anthropic, safeClaudeMessage, messageToText } from './llm'

export async function analyzePortfolioWithAI(
  address: string,
  strategies: unknown,
  balances: unknown
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    // AI disabled in this deployment — return an empty but valid string
    return ''
  }

  const sys =
    'You are a DeFi portfolio analyst. Be concise, actionable, and avoid hype. Output short paragraphs and bullet points.'
  const user = `
Address: ${address}

Balances (truncated): ${JSON.stringify(balances).slice(0, 4000)}
Strategies (truncated): ${JSON.stringify(strategies).slice(0, 4000)}

Tasks:
1) Top 3 opportunities worth trying now (with reasons)
2) Key risks to consider (protocol, execution, or timing)
3) Quick win suggestions (if nothing obvious)
  `.trim()

  const msgs = safeClaudeMessage(sys, user)
  const model = process.env.CLAUDE_MODEL || 'claude-3-7-sonnet-20250219'

  const res = await anthropic().messages.create({
    model,
    max_tokens: 600,
    messages: msgs as any
  })

  // Convert to plain text
  const text =
    (res.content as any[])
      ?.map((b) => (b.type === 'text' ? b.text : ''))
      ?.join('\n') ?? ''

  return text
}

