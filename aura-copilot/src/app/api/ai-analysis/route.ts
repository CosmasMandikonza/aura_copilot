import { NextRequest, NextResponse } from 'next/server'
import { analyzePortfolioWithAI } from '@/lib/ai'
import { getBalances, getStrategies } from '@/lib/aura'

const mem = new Map<string, { t: number; v: any }>()
const TTL_MS = 1000 * 60 * 5 // 5 minutes

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get('address')?.toLowerCase()
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
  }

  const key = `ai:${address}`
  const now = Date.now()
  const cached = mem.get(key)
  if (cached && now - cached.t < TTL_MS) {
    return NextResponse.json(cached.v)
  }

  try {
    const [balances, strategies] = await Promise.all([
      getBalances(address),
      getStrategies(address),
    ])

    const analysis = await analyzePortfolioWithAI(address, strategies, balances)
    const body = { address, analysis, timestamp: now }
    mem.set(key, { t: now, v: body })
    return NextResponse.json(body)
  } catch (err: any) {
    // Surface a graceful response on persistent 429
    const status = err?.status || err?.response?.status || 500
    const message = err?.message || 'LLM analysis failed'
    return NextResponse.json({ error: message }, { status })
  }
}

