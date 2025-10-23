// src/lib/ai.ts
import { safeClaudeMessage, messageToText } from './llm'

/**
 * High-level helper that formats a portfolio + strategies into an AI prompt.
 * Returns plain text for rendering (or a friendly message if AI is disabled).
 */
export async function analyzePortfolioWithAI(
  address: string,
  strategies: any,
  balances: any
): Promise<string> {
  const model =
    process.env.CLAUDE_MODEL ||
    process.env.ANTHROPIC_MODEL || // legacy var, just in case
    'claude-3-5-haiku-20241022'

  const system =
    'You are a seasoned DeFi portfolio analyst. ' +
    'Be concise, actionable, and prioritize safety. ' +
    'If an opportunity seems risky, clearly say why and suggest safer alternatives.'

  // Keep payload compact to avoid hitting token limits
  const trimmed = {
    address,
    strategies: Array.isArray(strategies)
      ? strategies.slice(0, 30) // top N for cost
      : strategies?.strategies?.slice?.(0, 30) ?? [],
    // extract a light-weight balances summary
    balances: (balances?.portfolio || []).map((p: any) => ({
      network: p?.network?.name || p?.network?.chainId || 'unknown',
      tokens: (p?.tokens || [])
        .slice(0, 10)
        .map((t: any) => ({ symbol: t?.symbol, usd: t?.balanceUSD })),
    })),
  }

  const user =
    `Wallet: ${address}\n` +
    `Objective: Identify top opportunities (airdrops, stacked yield, governance).\n` +
    `Constraints: Prefer low risk, call out approvals/bridges, and give direct links when possible.\n\n` +
    `Data (JSON):\n` +
    '```json\n' +
    JSON.stringify(trimmed, null, 2) +
    '\n```'

  const resp = await safeClaudeMessage({
    model,
    system,
    messages: [{ role: 'user', content: user }],
    max_tokens: 900,
    temperature: 0.4,
  })

  const text = messageToText(resp)
  return text || 'AI analysis is unavailable right now.'
}

