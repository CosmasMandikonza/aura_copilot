import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getBalances, getStrategies } from '@/lib/aura';
import { splitStrategies } from '@/lib/normalize';
import { opportunityScore, twelveMonthProfit } from '@/lib/scoring';
import { demoBalances, demoStrategies } from '@/lib/demoData';

const TTL_MS = 30 * 60 * 1000;
const DEMO_MODE = (process.env.DEMO_MODE || '').toLowerCase() === 'true';
const isHex = (s: string) => /^0x[a-fA-F0-9]{40}$/.test(s);

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const address = (url.searchParams.get('address') || '').toLowerCase();
  const refresh = url.searchParams.get('refresh') === '1';
  if (!isHex(address)) return NextResponse.json({ error: 'Invalid address' }, { status: 400 });

  async function readCache(kind: 'balances' | 'strategies') {
    const row = await prisma.cacheEntry.findFirst({
      where: { address, kind },
      orderBy: { createdAt: 'desc' },
    });
    if (!row) return null;
    const fresh = Date.now() - +new Date(row.createdAt) < TTL_MS;
    return { fresh, payload: row.payload } as const;
  }

  async function writeCache(kind: 'balances' | 'strategies', payload: any) {
    try {
      await prisma.cacheEntry.create({ data: { address, kind, payload } });
    } catch { /* ignore */ }
  }

  async function load(kind: 'balances'|'strategies') {
    // 1) optional cache read
    const cached = refresh ? null : await readCache(kind);
    if (cached?.fresh && cached.payload) return { source: 'cache', data: cached.payload };

    // 2) upstream fetch
    const upstream = kind === 'balances' ? await getBalances(address) : await getStrategies(address);

    // 3) success → write & return;  failure → fallback to prior cache or demo (if enabled)
    if (upstream.ok && upstream.data) {
      await writeCache(kind, upstream.data);
      return { source: 'upstream', data: upstream.data };
    }

    if (cached?.payload) return { source: 'stale-cache', data: cached.payload };

    if (DEMO_MODE) {
      const demo = kind === 'balances' ? demoBalances : demoStrategies;
      await writeCache(kind, demo);
      return { source: 'demo', data: demo };
    }

    // guaranteed safe empty shapes so UI won’t crash
    const empty = kind === 'balances'
      ? { address, portfolio: [], cached: false, version: 'unknown' }
      : { address, portfolio: [], strategies: [], cached: false, version: 'unknown' };
    return { source: 'empty', data: empty };
  }

  const [B, S] = await Promise.all([load('balances'), load('strategies')]);

  // normalize strategies object to expected shape
  const split = splitStrategies({
    address: S.data.address ?? address,
    portfolio: S.data.portfolio ?? [],
    strategies: Array.isArray(S.data.strategies) ? S.data.strategies : [],
    cached: !!S.data.cached,
    version: S.data.version ?? 'unknown',
  });

  const annotate = (items: any[]) =>
    (items || [])
      .map((it) => {
        const score = opportunityScore(it);
        const apy = it.actions?.[0]?.apy;
        const profit12m = twelveMonthProfit(5000, apy);
        return { ...it, score, profit12m };
      })
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  // quick stats
  const networks = new Set<string>();
  let tvlUSD = 0;
  for (const p of B.data?.portfolio ?? []) {
    for (const t of p.tokens ?? []) {
      networks.add(p.network?.name || p.network?.chainId || 'unknown');
      if (typeof t.balanceUSD === 'number') tvlUSD += t.balanceUSD;
    }
  }

  const resp = NextResponse.json({
    address,
    tvlUSD: Math.round(tvlUSD * 100) / 100,
    networkCount: networks.size,
    top: {
      airdrop: annotate(split.airdrop).slice(0, 3),
      doubledip: annotate(split.doubledip).slice(0, 3),
      other: annotate(split.other).slice(0, 3),
    },
    sections: {
      airdrop: annotate(split.airdrop),
      doubledip: annotate(split.doubledip),
      other: annotate(split.other),
    },
  });

  // helpful headers for debugging during judging
  resp.headers.set('x-aura-source-balances', B.source);
  resp.headers.set('x-aura-source-strategies', S.source);
  resp.headers.set('x-demo-mode', String(DEMO_MODE));
  resp.headers.set('cache-control', 'no-store');

  return resp;
}





