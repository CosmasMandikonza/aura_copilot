// src/app/api/insights/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getBalances, getStrategies } from '@/lib/aura'
import { CACHE_TTL_MS } from '@/lib/constants'
import { splitStrategies } from '@/lib/normalize'
import { opportunityScore, twelveMonthProfit } from '@/lib/scoring'

const isHex = (s: string) => /^0x[a-fA-F0-9]{40}$/.test(s)
const HAS_DB = !!process.env.DATABASE_URL

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const address = (searchParams.get('address') || '').toLowerCase()
    if (!isHex(address)) {
      return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
    }

    async function getOrFetch(
      kind: 'balances' | 'strategies',
      fetcher: (a: string) => Promise<any>
    ) {
      if (!HAS_DB) {
        // No DB on this deployment: just fetch fresh (no caching) and fail soft
        try {
          return await fetcher(address)
        } catch {
          return null
        }
      }

      // With DB: try cache, refresh if stale
      try {
        const cached = await prisma.cacheEntry.findFirst({
          where: { address, kind },
          orderBy: { createdAt: 'desc' },
        })
        if (
          cached &&
          Date.now() - new Date(cached.createdAt).getTime() < CACHE_TTL_MS
        ) {
          return cached.payload
        }

        const data = await fetcher(address)
        // store best-effort; do not block on failure
        try {
          await prisma.cacheEntry.create({
            data: { address, kind, payload: data },
          })
        } catch {}
        return data
      } catch {
        // DB error -> still try live fetch
        try {
          return await fetcher(address)
        } catch {
          return null
        }
      }
    }

    const [balances, strategies] = await Promise.all([
      getOrFetch('balances', getBalances),
      getOrFetch('strategies', getStrategies),
    ])

    // If upstream failed, still return a valid shape so the UI doesn’t error
    const safeStrategies = Array.isArray(strategies) ? strategies : []
    const split = splitStrategies(safeStrategies)

    const annotate = (items: any[]) =>
      (items || [])
        .map((it) => {
          const score = opportunityScore(it)
          const apy = it?.actions?.[0]?.apy
          // crude notional assumption for demo: $5,000 bucket
          const profit12m = twelveMonthProfit(5000, apy)
          return { ...it, score, profit12m }
        })
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

    const ranked = {
      airdrop: annotate(split.airdrop),
      doubledip: annotate(split.doubledip),
      other: annotate(split.other),
    }

    // quick portfolio stats (for dashboard)
    const networks = new Set<string>()
    let tvlUSD = 0
    for (const p of (balances?.portfolio ?? [])) {
      for (const t of (p.tokens ?? [])) {
        networks.add(p.network?.name || p.network?.chainId || 'unknown')
        if (typeof t.balanceUSD === 'number') tvlUSD += t.balanceUSD
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
  } catch {
    // absolute fail-soft: guaranteed JSON shape
    return NextResponse.json(
      {
        address: null,
        tvlUSD: 0,
        networkCount: 0,
        top: { airdrop: [], doubledip: [], other: [] },
        sections: { airdrop: [], doubledip: [], other: [] },
      },
      { status: 200 }
    )
  }
}

