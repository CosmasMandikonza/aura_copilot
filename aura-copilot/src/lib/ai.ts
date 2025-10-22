import Anthropic from '@anthropic-ai/sdk'

import { safeClaudeMessage, messageToText } from './llm'

export async function analyzePortfolioWithAI(address: string, strategies: any, balances: any) {
  const prompt = `You are a DeFi portfolio analyst. Analyze this wallet and provide:
1) Risk Profile (1-10) + reasoning
2) Top 3 personalized, actionable recommendations specific to holdings
3) Hidden opportunities (unclaimed, stacked yield, governance)
4) Portfolio Health Score (0-100) and one-paragraph rationale

Wallet: ${address}
Holdings (sampled): ${JSON.stringify(balances?.portfolio?.slice(0, 5))}
Available strategies (sampled): ${JSON.stringify(strategies?.strategies?.[0]?.response?.slice(0, 5))}
Answer as concise bullet points + short rationale.`

  const msg = await safeClaudeMessage({ user: prompt, maxTokens: 900 })
  return messageToText(msg)
}
