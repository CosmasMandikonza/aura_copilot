// src/app/api/insights/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getBalances, getStrategies } from '@/lib/aura'
import { CACHE_TTL_MS } from '@/lib/constants'
import { splitStrategies } from '@/lib/normalize'
import { opportunityScore, twelveMonthProfit } from '@/lib/scoring'
import type { AuraStrategiesResponse } from '@/lib/types' // <-- use your real type

const isHex = (s: string) => /^0x[a-fA-F0-9]{40}$/.test(s)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const address = (searchParams.get('address') || '').toLowerCase()

  if (!isHex(address)) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
  }

  // Cache helper with fail-soft behavior
  async function getOrFetch<K extends 'balances' | 'strategies'>(
    kind: K,
    fetcher: (a: string) => Promise<any>
  ) {
    try {
      const cached = await prisma.cacheEntry.findFirst({
        where: { address, kind },
        orderBy: { createdAt: 'desc' },
      })

      if (cached && Date.now() - new Date(cached.createdAt).getTime() < CACHE_TTL_MS) {
        return cached.payload
      }

      const data = await fetcher(address).catch(() => null)
      if (data) {
        await prisma.cacheEntry.create({ data: { address, kind, payload: data } })
      }
      return data
    } catch {
      // If DB/cache is unavailable, still try live fetch; if that fails too, return null
      return fetcher(address).catch(() => null)
    }
  }

  const [balancesRaw, strategiesRaw] = await Promise.all([
    getOrFetch('balances', getBalances),
    getOrFetch('strategies', getStrategies),
  ])

  // ---- Normalize balances for stats (never throw) ----
  const safeBalances: { portfolio?: any[] } =
    balancesRaw && typeof balancesRaw === 'object' ? balancesRaw : { portfolio: [] }

  // ---- Normalize strategies into the EXACT AuraStrategiesResponse your code expects ----
  function normalizeStrategies(raw: any): AuraStrategiesResponse {
    // If the upstream already looks correct, reuse its fields but enforce required ones
    if (raw && typeof raw === 'object' && Array.isArray(raw.strategies)) {
      return {
        address: String(raw.address ?? address),                  // required
        portfolio: Array.isArray(raw.portfolio) ? raw.portfolio : [],
        strategies: raw.strategies,
        cached: Boolean(raw.cached),
        version: String(raw.version ?? 'unknown'),
      }
    }
    // If upstream returned just an array, wrap it
    if (Array.isArray(raw)) {
      return {
        address,                                                  // required
        portfolio: [],
        strategies: raw,
        cached: false,
        version: 'unknown',
      }
    }
    // Total failure fallback
    return {
      address,                                                    // required
      portfolio: [],
      strategies: [],
      cached: false,
      version: 'unknown',
    }
  }

  const safeStrategiesObj: AuraStrategiesResponse = normalizeStrategies(strategiesRaw)

  // Group strategies into sections (airdrop / doubledip / other)
  const split = splitStrategies(safeStrategiesObj)

  // Rank + annotate (score & notional 12m profit)
  const annotate = (items: any[]) =>
    (items || [])
      .map((it) => {
        const score = opportunityScore(it)
        const apy = it?.actions?.[0]?.apy
        const profit12m = twelveMonthProfit(5000, apy) // demo notional
        return { ...it, score, profit12m }
      })
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  const ranked = {
    airdrop: annotate(split.airdrop),
    doubledip: annotate(split.doubledip),
    other: annotate(split.other),
  }

  // Portfolio stats for the dashboard
  const networks = new Set<string>()
  let tvlUSD = 0
  for (const p of safeBalances.portfolio || []) {
    const tokens = (p as any)?.tokens || []
    for (const t of tokens) {
      const chainName = (p as any)?.network?.name || (p as any)?.network?.chainId || 'unknown'
      networks.add(String(chainName))
      if (typeof t?.balanceUSD === 'number') tvlUSD += t.balanceUSD
    }
  }

  return NextResponse.json({
    address,
    tvlUSD: Math.round(tvlUSD * 100) / 100,
    networkCount: networks.size,
    top: {
      airdrop: ranked.airdrop.slice(0, 3),
      doubledip: ranked.doubledip.slice(0, 3),
      other: ranked.other.slice(0, 3),
    },
    sections: ranked,
  })
}

