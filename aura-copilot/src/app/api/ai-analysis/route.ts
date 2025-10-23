// src/app/api/ai-analysis/route.ts
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const CLAUDE_MODEL =
  process.env.CLAUDE_MODEL ||
  process.env.ANTHROPIC_MODEL ||
  'claude-3-7-sonnet-20250219'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const address = searchParams.get('address')?.trim()
    if (!address) return NextResponse.json({ analysis: null }, { status: 200 })

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        {
          analysis:
            'AI analysis disabled on this deployment. Add ANTHROPIC_API_KEY (+ CLAUDE_MODEL) in Vercel to enable.',
        },
        { status: 200 }
      )
    }

    const anthropic = new Anthropic({ apiKey })
    const msg = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 800,
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: `Give a concise risk & opportunity summary for wallet: ${address}.
- Risk profile 1-10
- Top positions & concentration
- Cross-chain exposure
- Immediate safe actions (no trade advice)
Bullet points, short.`,
        },
      ],
    })

    const text =
      (msg.content?.[0] as any)?.text ||
      (Array.isArray(msg.content) && (msg.content as any[]).find((c) => c.text)?.text) ||
      ''

    return NextResponse.json({ analysis: text || null }, { status: 200 })
  } catch {
    return NextResponse.json({ analysis: null }, { status: 200 })
  }
}


