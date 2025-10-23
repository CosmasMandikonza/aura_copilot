// src/app/api/insights/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getBalances, getStrategies } from '@/lib/aura'

const CACHE_TTL_MS = 30 * 60 * 1000 // 30m

const isHex = (s:string)=> /^0x[a-fA-F0-9]{40}$/.test(s)

function now() { return Date.now() }

function hasNonEmptyStrategies(obj: any) {
  return obj && Array.isArray(obj.strategies) && obj.strategies.length > 0
}
function hasNonEmptyBalances(obj: any) {
  if (!obj?.portfolio) return false
  try {
    const p = obj.portfolio as any[]
    for (const chain of p) {
      if (Array.isArray(chain?.tokens) && chain.tokens.some((t:any)=> typeof t?.balanceUSD === 'number' && t.balanceUSD > 0)) {
        return true
      }
    }
  } catch {}
  return false
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const address = (searchParams.get('address') || '').toLowerCase()
  const refresh = searchParams.get('refresh') === '1'

  if (!isHex(address)) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
  }

  async function readCache(kind: 'balances'|'strategies') {
    const row = await prisma.cacheEntry.findFirst({
      where: { address, kind },
      orderBy: { createdAt: 'desc' },
    })
    if (!row) return null
    const age = now() - new Date(row.createdAt).getTime()
    if (age > CACHE_TTL_MS) return null
    return row.payload as any
  }

  async function writeCache(kind: 'balances'|'strategies', payload: any) {
    await prisma.cacheEntry.create({ data: { address, kind, payload } })
  }

  // 1) try cache (unless refresh)
  let balances: any = null
  let strategies: any = null
  let balancesSource = 'cache-miss'
  let strategiesSource = 'cache-miss'

  if (!refresh) {
    balances = await readCache('balances')
    if (balances) balancesSource = 'cache'
    strategies = await readCache('strategies')
    if (strategies) strategiesSource = 'cache'
  }

  // 2) fetch upstream if needed
  if (!balances) {
    const r = await getBalances(address)
    if (r.ok) {
      balances = r.data
      balancesSource = 'upstream'
      // cache only if non-empty
      if (hasNonEmptyBalances(balances)) await writeCache('balances', balances)
    } else {
      balances = null
      balancesSource = r.status === 429 ? 'rate-limited' : `error-${r.status}`
    }
  }

  if (!strategies) {
    const r = await getStrategies(address)
    if (r.ok) {
      strategies = r.data
      strategiesSource = 'upstream'
      // cache only if non-empty
      if (hasNonEmptyStrategies(strategies)) await writeCache('strategies', strategies)
    } else {
      strategies = null
      strategiesSource = r.status === 429 ? 'rate-limited' : `error-${r.status}`
    }
  }

  // 3) compute quick stats
  let tvlUSD = 0
  let networkCount = 0
  if (balances?.portfolio) {
    const nets = new Set<string>()
    for (const chain of balances.portfolio as any[]) {
      const n = chain?.network?.name || chain?.network?.chainId || 'unknown'
      nets.add(n)
      for (const t of (chain.tokens || [])) {
        if (typeof t.balanceUSD === 'number') tvlUSD += t.balanceUSD
      }
    }
    networkCount = nets.size
  }

  const res = NextResponse.json({
    address,
    tvlUSD: Math.round(tvlUSD * 100) / 100,
    networkCount,
    strategies: strategies?.strategies ?? [],
    meta: {
      balancesSource,
      strategiesSource,
    }
  }, { status: 200 })

  // helpful debug headers
  res.headers.set('x-aura-source-balances', balancesSource)
  res.headers.set('x-aura-source-strategies', strategiesSource)
  return res
}

